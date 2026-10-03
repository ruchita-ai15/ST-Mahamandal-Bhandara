import React, { useState } from 'react';
import { DelayNotification } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';

interface AudioBusAlertBannerProps {
  notifications: DelayNotification[];
  onOpenNotifications: () => void;
  pushEnabled: boolean;
  onTogglePush: () => void;
}

export const AudioBusAlertBanner: React.FC<AudioBusAlertBannerProps> = ({
  notifications,
  onOpenNotifications,
  pushEnabled,
  onTogglePush,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const activeDelays = notifications.filter((n) => n.type === 'delay');
  const latestDelay = activeDelays[0] || notifications[0];

  const handlePlayAnnouncement = async () => {
    if (isPlaying) {
      busAudio.stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const textToAnnounce = activeDelays.length > 0
      ? `लक्ष द्या प्रवाशांनो! भंडारा जिल्हा एसटी महामंडळ विलंब सूचना. ${activeDelays
          .map((d) => d.messageMr)
          .join('. पुढची सूचना. ')}`
      : 'भंडारा जिल्ह्यातील सर्व एसटी बसेस नियोजित वेळेवर धावत आहेत. कोणताही विलंब नाही.';

    await busAudio.speak(textToAnnounce);
    setIsPlaying(false);
  };

  return (
    <div className="bg-amber-100 border border-amber-300 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      {/* Left zone: Speaker & Live Alert message */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={handlePlayAnnouncement}
          className={`min-h-[46px] min-w-[46px] rounded-xl flex items-center justify-center text-xl transition-all shadow-sm ${
            isPlaying
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
          }`}
          title="ध्वनी सूचना ऐका (Listen Announcement)"
        >
          {isPlaying ? '⏹️' : '🔊'}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              थेट विलंब सूचना (Live Delay Announcement)
            </span>
            <span className="text-[11px] text-amber-800">· {notifications.length} ताज्या अपडेट्स</span>
          </div>

          <p className="text-sm font-semibold text-stone-900 truncate mt-0.5">
            {latestDelay ? latestDelay.messageMr : 'सर्व बसेस वेळेवर सुरू आहेत'}
          </p>
        </div>
      </div>

      {/* Right zone: Audio trigger + Push toggle */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-amber-200">
        <button
          onClick={handlePlayAnnouncement}
          className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>{isPlaying ? 'थांबवा (Stop)' : '🔊 मोठ्याने ऐका'}</span>
        </button>

        <button
          onClick={onTogglePush}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
            pushEnabled
              ? 'bg-emerald-600 text-white border-emerald-700'
              : 'bg-white text-stone-700 border-amber-300 hover:bg-amber-50'
          }`}
          title="मोबाईलवर विलंब सूचना मिळवा"
        >
          <span>{pushEnabled ? '🔔 सूचना सुरू' : '🔕 सूचना बंद'}</span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="px-3 py-2 bg-white hover:bg-amber-50 text-amber-950 rounded-lg text-xs font-semibold border border-amber-300 transition-colors"
        >
          सर्व पहा
        </button>
      </div>
    </div>
  );
};
