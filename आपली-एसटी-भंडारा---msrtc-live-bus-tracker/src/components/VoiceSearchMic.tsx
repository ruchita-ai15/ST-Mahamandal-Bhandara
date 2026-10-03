import React, { useState } from 'react';
import { busAudio } from '../utils/audio';

interface VoiceSearchMicProps {
  onSelectStation: (stationName: string, stationId?: string) => void;
  easyMode?: boolean;
}

export const VoiceSearchMic: React.FC<VoiceSearchMicProps> = ({
  onSelectStation,
  easyMode = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Preset popular Bhandara destinations for 1-tap voice & visual selection
  const voicePresets = [
    { id: 'sakoli', nameMr: 'साकोली', icon: '🏢', label: 'साकोली आगार' },
    { id: 'tumsar', nameMr: 'तुमसर', icon: '🏭', label: 'तुमसर पितळ नगरी' },
    { id: 'lakhani', nameMr: 'लाखनी', icon: '🌾', label: 'लाखनी भात गिरणी' },
    { id: 'pauni', nameMr: 'पवनी', icon: '🏛️', label: 'पवनी किल्ला' },
    { id: 'mohadi', nameMr: 'मोहाडी', icon: '👕', label: 'मोहाडी विणकर' },
    { id: 'nagpur_ganeshpet', nameMr: 'नागपूर', icon: '⚡', label: 'नागपूर गणेशपेठ' },
  ];

  const handleStartListening = () => {
    setErrorMsg('');
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('आपल्या ब्राऊझरमध्ये मायक्रोफोन उपलब्ध नाही. खालील चिन्हावर दाबा.');
      busAudio.speak('मायक्रोफोन उपलब्ध नाही. खालील शहराच्या चिन्हावर दाबा.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'mr-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      busAudio.playDepotChime();

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const spokenWord = event.results[0][0].transcript.trim();
        setTranscript(spokenWord);
        setIsListening(false);

        busAudio.speak(`${spokenWord} साठी बसेस शोधत आहोत.`);
        onSelectStation(spokenWord);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setErrorMsg('आवाज समजला नाही. कृपया पुन्हा बोला किंवा खालील चिन्हावर दाबा.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMsg('मायक्रोफोन सुरू होऊ शकला नाही.');
    }
  };

  const handlePresetClick = (preset: { id: string; nameMr: string; label: string }) => {
    busAudio.speak(`${preset.nameMr} निवडले. बसेस शोधत आहोत.`);
    onSelectStation(preset.nameMr, preset.id);
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white p-4 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartListening}
            className={`min-h-[52px] min-w-[52px] rounded-full flex items-center justify-center text-2xl transition-all shadow-lg ${
              isListening
                ? 'bg-yellow-400 text-stone-900 ring-4 ring-white animate-pulse'
                : 'bg-white text-red-600 hover:scale-105 active:scale-95'
            }`}
            title="मायक्रोफोनवर बोलून शोधा"
          >
            {isListening ? '🎙️' : '🎤'}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg">
                {isListening ? 'आम्ही ऐकत आहोत... शहराचे नाव बोला!' : 'बोला आणि बस शोधा (Voice Search)'}
              </span>
              <span className="bg-white/20 text-[11px] px-2 py-0.5 rounded-full font-medium">मराठी</span>
            </div>
            <p className="text-xs text-amber-100">
              {easyMode
                ? 'वाचता येत नाही का? फक्त मायक्रोफोनवर दाबा आणि गावाचे नाव बोला!'
                : 'मायक्रोफोनवर टॅप करा आणि "साकोली", "तुमसर" किंवा "पवनी" म्हणा'}
            </p>
          </div>
        </div>

        {transcript && (
          <div className="bg-black/25 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
            <span>तुम्ही बोललात:</span>
            <strong className="text-yellow-300 text-sm">{transcript}</strong>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs bg-red-800/80 text-white p-2 rounded-lg mt-2">{errorMsg}</p>
      )}

      {/* Illiterate-Friendly 1-Tap Pictorial Quick Destination Cards */}
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-amber-100">
            किंवा थेट चित्रावर दाबा (Tap visual destination):
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {voicePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className="bg-white/10 hover:bg-white/25 active:bg-white/40 border border-white/20 rounded-xl p-2 flex flex-col items-center justify-center transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{preset.icon}</span>
              <span className="text-xs font-bold mt-1 text-white">{preset.nameMr}</span>
              <span className="text-[9px] text-amber-200 truncate max-w-full">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
