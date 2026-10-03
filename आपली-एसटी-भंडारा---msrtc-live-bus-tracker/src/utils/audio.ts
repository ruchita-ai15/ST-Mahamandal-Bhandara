/**
 * Audio synthesis utility for MSRTC Bhandara
 * Provides depot chime (डिंग-डाँग-डिंग) and text-to-speech in Marathi / Hindi / English
 */

class BusAudioService {
  private audioCtx: AudioContext | null = null;
  private isSpeaking = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays the iconic MSRTC bus station gong / chime
   * (Three pleasant descending-ascending warm chime notes)
   */
  public playDepotChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const ctx = this.getAudioContext();
        const now = ctx.currentTime;
        const notes = [
          { freq: 523.25, time: 0.0, dur: 0.25 }, // C5
          { freq: 659.25, time: 0.22, dur: 0.28 }, // E5
          { freq: 783.99, time: 0.45, dur: 0.45 }, // G5
        ];

        notes.forEach((n) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.freq, now + n.time);

          gain.gain.setValueAtTime(0.0001, now + n.time);
          gain.gain.linearRampToValueAtTime(0.25, now + n.time + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + n.time);
          osc.stop(now + n.time + n.dur);
        });

        setTimeout(resolve, 800);
      } catch {
        resolve();
      }
    });
  }

  /**
   * Speaks announcement text using Web Speech API with fallback
   */
  public async speak(text: string, lang = 'mr-IN'): Promise<void> {
    if (!('speechSynthesis' in window)) {
      return;
    }

    try {
      // First play depot chime
      await this.playDepotChime();

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.92; // Slightly measured pace for clarity
      utterance.pitch = 1.0;

      // Find best matching voice according to target language
      const voices = window.speechSynthesis.getVoices();
      const isEnglish = lang.startsWith('en');

      let chosenVoice: SpeechSynthesisVoice | undefined;
      if (isEnglish) {
        chosenVoice = voices.find((v) => v.lang === 'en-IN') ||
                      voices.find((v) => v.lang.startsWith('en'));
      } else {
        chosenVoice = voices.find((v) => v.lang.includes('mr') || v.lang.includes('mar')) ||
                      voices.find((v) => v.lang.includes('hi') || v.lang.includes('hin')) ||
                      voices.find((v) => v.lang === 'en-IN');
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      this.isSpeaking = true;
      utterance.onend = () => {
        this.isSpeaking = false;
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const busAudio = new BusAudioService();
