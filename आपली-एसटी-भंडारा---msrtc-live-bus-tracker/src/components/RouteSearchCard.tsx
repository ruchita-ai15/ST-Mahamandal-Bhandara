import React, { useState } from 'react';
import { BHANDARA_STOPS, BusCategory } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface RouteSearchCardProps {
  originId: string;
  destinationId: string;
  onOriginChange: (id: string) => void;
  onDestinationChange: (id: string) => void;
  onSwap: () => void;
  selectedCategory: BusCategory | 'all';
  onCategoryChange: (cat: BusCategory | 'all') => void;
  onSearch: () => void;
  lang?: Language;
  easyMode?: boolean;
}

export const RouteSearchCard: React.FC<RouteSearchCardProps> = ({
  originId,
  destinationId,
  onOriginChange,
  onDestinationChange,
  onSwap,
  selectedCategory,
  onCategoryChange,
  onSearch,
  lang = 'mr',
  easyMode = false,
}) => {
  const t = TRANSLATIONS[lang];
  const [listeningTarget, setListeningTarget] = useState<'origin' | 'destination' | 'full' | null>(null);
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');

  const categories: { id: BusCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: lang === 'mr' ? 'सर्व बसेस (All)' : 'All Buses', icon: '🚌' },
    { id: 'lal_pari', label: lang === 'mr' ? 'लालपरी (साधी)' : 'Lal Pari (Ordinary)', icon: '🔴' },
    { id: 'shivshahi', label: lang === 'mr' ? 'शिवशाही AC' : 'Shivshahi AC', icon: '🟢' },
    { id: 'hirkani', label: lang === 'mr' ? 'हिरकणी (निमआराम)' : 'Hirkani Semi-Luxury', icon: '🔵' },
    { id: 'parivartan', label: lang === 'mr' ? 'परिवर्तन' : 'Parivartan', icon: '🚐' },
    { id: 'manav_vikas', label: lang === 'mr' ? 'मानव विकास' : 'Manav Vikas Special', icon: '🟡' },
  ];

  const originStop = BHANDARA_STOPS.find((s) => s.id === originId);
  const destStop = BHANDARA_STOPS.find((s) => s.id === destinationId);

  const handleSpeakRoute = () => {
    const text =
      lang === 'mr'
        ? `${originStop?.nameMr || 'भंडारा'} येथून ${destStop?.nameMr || 'साकोली'} कडे जाणाऱ्या बसेस`
        : `Buses from ${originStop?.name || 'Bhandara'} to ${destStop?.name || 'Sakoli'}`;
    busAudio.speak(text, lang === 'mr' ? 'mr-IN' : 'en-IN');
  };

  // Match spoken text to Bhandara stops
  const matchStop = (spokenText: string) => {
    const cleaned = spokenText.trim().toLowerCase();
    return BHANDARA_STOPS.find((s) => {
      const nameClean = s.nameMr.replace(' बस स्थानक', '').replace(' आगार', '').trim();
      return (
        s.nameMr.includes(cleaned) ||
        cleaned.includes(nameClean) ||
        s.name.toLowerCase().includes(cleaned) ||
        cleaned.includes(s.code.toLowerCase())
      );
    });
  };

  // Voice Search Handler
  const handleStartVoice = (target: 'origin' | 'destination' | 'full') => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceFeedback('ब्राऊझरमध्ये मायक्रोफोन उपलब्ध नाही. खालील यादीतून निवडा.');
      busAudio.speak('मायक्रोफोन उपलब्ध नाही. कृपया यादीतून गाव निवडा.');
      return;
    }

    try {
      setListeningTarget(target);
      const promptText =
        target === 'origin'
          ? 'सुरुवातीचे गाव बोला (उदा. भंडारा, तुमसर)'
          : target === 'destination'
          ? 'जायचे ठिकाण बोला (उदा. साकोली, पवनी)'
          : 'संपूर्ण मार्ग बोला (उदा. भंडारा ते साकोली)';

      setVoiceFeedback(`आम्ही ऐकत आहोत... ${promptText}`);
      busAudio.playDepotChime();

      const recognition = new SpeechRecognition();
      recognition.lang = 'mr-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListeningTarget(target);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        setVoiceFeedback(`तुम्ही बोललात: "${transcript}"`);
        setListeningTarget(null);

        if (target === 'full') {
          // Parse "X ते Y" or "X to Y"
          if (transcript.includes('ते') || transcript.includes('to')) {
            const parts = transcript.split(/ते|to/);
            const part1 = parts[0]?.trim();
            const part2 = parts[1]?.trim();

            const match1 = matchStop(part1);
            const match2 = matchStop(part2);

            if (match1) onOriginChange(match1.id);
            if (match2) onDestinationChange(match2.id);

            const originName = match1 ? match1.nameMr : 'भंडारा';
            const destName = match2 ? match2.nameMr : 'साकोली';

            busAudio.speak(`${originName} ते ${destName} मार्ग शोधत आहोत.`);
            onSearch();
          } else {
            // Assume single spoken station is destination
            const matched = matchStop(transcript);
            if (matched) {
              onDestinationChange(matched.id);
              busAudio.speak(`${matched.nameMr} कडे जाणाऱ्या बसेस शोधत आहोत.`);
              onSearch();
            } else {
              busAudio.speak(`${transcript} सापडले नाही. कृपया पुन्हा बोला.`);
            }
          }
        } else if (target === 'origin') {
          const matched = matchStop(transcript);
          if (matched) {
            onOriginChange(matched.id);
            busAudio.speak(`सुरुवात: ${matched.nameMr} निवडले.`);
          } else {
            busAudio.speak(`${transcript} स्थानक सापडले नाही.`);
          }
        } else if (target === 'destination') {
          const matched = matchStop(transcript);
          if (matched) {
            onDestinationChange(matched.id);
            busAudio.speak(`गंतव्य: ${matched.nameMr} निवडले.`);
          } else {
            busAudio.speak(`${transcript} स्थानक सापडले नाही.`);
          }
        }
      };

      recognition.onerror = () => {
        setListeningTarget(null);
        setVoiceFeedback('आवाज स्पष्ट समजला नाही. कृपया पुन्हा बोला.');
      };

      recognition.onend = () => {
        setListeningTarget(null);
      };

      recognition.start();
    } catch {
      setListeningTarget(null);
      setVoiceFeedback('मायक्रोफोन सुरू होऊ शकला नाही.');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📍</span>
          <div>
            <h3 className="font-bold text-base text-stone-900">मार्ग व वेळापत्रक शोधा (Find Routes)</h3>
            <p className="text-xs text-stone-500">भंडारा जिल्हा अंतर्गत सर्व एसटी फेऱ्या</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Main Full-Voice Search Button */}
          <button
            onClick={() => handleStartVoice('full')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              listeningTarget === 'full'
                ? 'bg-yellow-400 text-stone-900 ring-2 ring-red-600 animate-pulse'
                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
            }`}
            title="संपूर्ण मार्ग बोलून शोधा"
          >
            <span>{listeningTarget === 'full' ? '🎙️ ऐकत आहोत...' : '🎤 बोलून शोधा (Voice)'}</span>
          </button>

          <button
            onClick={handleSpeakRoute}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1 transition-colors border border-amber-200"
            title="सध्याचा मार्ग ऐका"
          >
            <span>🔊</span>
            <span className="hidden sm:inline">मार्ग ऐका</span>
          </button>
        </div>
      </div>

      {/* Voice listening status feedback box */}
      {voiceFeedback && (
        <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="animate-spin text-base">🎙️</span>
            <span className="font-semibold">{voiceFeedback}</span>
          </div>
          <button
            onClick={() => setVoiceFeedback('')}
            className="text-amber-700 hover:text-amber-950 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Origin Dropdown with Dedicated Voice Mic */}
        <div className="md:col-span-5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <span>🟢</span>
              <span>कुठून निघणार? (Origin)</span>
            </label>

            {/* Origin Voice Search Mic Button */}
            <button
              type="button"
              onClick={() => handleStartVoice('origin')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                listeningTarget === 'origin'
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
              }`}
              title="सुरुवातीचे स्थानक बोला"
            >
              <span>{listeningTarget === 'origin' ? '🎙️ ऐकत आहोत...' : '🎤 बोला'}</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={originId}
              onChange={(e) => {
                onOriginChange(e.target.value);
                const stop = BHANDARA_STOPS.find((s) => s.id === e.target.value);
                if (stop) busAudio.speak(`सुरुवात: ${stop.nameMr}`);
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              {BHANDARA_STOPS.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.nameMr} ({stop.landmarkMr})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-2 flex justify-center py-1">
          <button
            onClick={() => {
              onSwap();
              busAudio.speak('स्थानके बदलली.');
            }}
            className="w-11 h-11 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="दिशा उलटी करा (Swap Stations)"
          >
            <span className="text-lg">⇄</span>
          </button>
        </div>

        {/* Destination Dropdown with Dedicated Voice Mic */}
        <div className="md:col-span-5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <span>🔴</span>
              <span>कुठे जायचे आहे? (Destination)</span>
            </label>

            {/* Destination Voice Search Mic Button */}
            <button
              type="button"
              onClick={() => handleStartVoice('destination')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                listeningTarget === 'destination'
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
              }`}
              title="जायचे स्थानक बोला"
            >
              <span>{listeningTarget === 'destination' ? '🎙️ ऐकत आहोत...' : '🎤 बोला'}</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={destinationId}
              onChange={(e) => {
                onDestinationChange(e.target.value);
                const stop = BHANDARA_STOPS.find((s) => s.id === e.target.value);
                if (stop) busAudio.speak(`गंतव्य: ${stop.nameMr}`);
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              {BHANDARA_STOPS.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.nameMr} ({stop.landmarkMr})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bus Type Filter Buttons (Zero-pill compliant segmented tabs) */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <span className="block text-xs font-semibold text-stone-600 mb-2">
          एसटी बस प्रकार निवडा (Filter Bus Type):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id);
                  const msg = lang === 'mr' ? `${cat.label} निवडले.` : `${cat.label} selected.`;
                  busAudio.speak(msg, lang === 'mr' ? 'mr-IN' : 'en-IN');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
        <div className="text-xs text-stone-500">
          आजच्या फेऱ्या: <strong className="text-stone-900 font-bold">२४ तास अखंड सेवा</strong>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Voice Search Quick Trigger Button */}
          <button
            type="button"
            onClick={() => handleStartVoice('full')}
            className="flex-1 sm:flex-none px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
            title="आवाजाने बस शोधा"
          >
            <span>🎙️</span>
            <span>आवाजाने शोधा</span>
          </button>

          <button
            onClick={() => {
              onSearch();
              handleSpeakRoute();
            }}
            className="flex-1 sm:flex-none px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            <span>उपलब्ध बसेस शोधा</span>
          </button>
        </div>
      </div>
    </div>
  );
};

