import React from 'react';
import { LiveBus } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';

interface BusListCardProps {
  bus: LiveBus;
  onTrackOnMap: (busId: string) => void;
  onBook: (bus: LiveBus) => void;
  isSubscribed?: boolean;
  onToggleSubscribe?: (busId: string) => void;
  easyMode?: boolean;
}

export const BusListCard: React.FC<BusListCardProps> = ({
  bus,
  onTrackOnMap,
  onBook,
  isSubscribed = false,
  onToggleSubscribe,
  easyMode = false,
}) => {
  const isDelayed = bus.delayMinutes > 0;

  const handlePlayAudio = () => {
    busAudio.speak(bus.audioAlertMr);
  };

  const getCategoryStyles = () => {
    switch (bus.category) {
      case 'lal_pari':
        return {
          bg: 'bg-red-50 border-red-200 text-red-900',
          dot: 'bg-red-600',
          pill: 'bg-red-600 text-white',
        };
      case 'shivshahi':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          dot: 'bg-emerald-600',
          pill: 'bg-emerald-700 text-white',
        };
      case 'hirkani':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-900',
          dot: 'bg-blue-600',
          pill: 'bg-blue-600 text-white',
        };
      case 'manav_vikas':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          dot: 'bg-amber-500',
          pill: 'bg-amber-600 text-white',
        };
      default:
        return {
          bg: 'bg-stone-50 border-stone-200 text-stone-900',
          dot: 'bg-stone-600',
          pill: 'bg-stone-800 text-white',
        };
    }
  };

  const styles = getCategoryStyles();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Top Banner Row */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b ${styles.bg}`}>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-sm ${styles.pill}`}>
            {bus.categoryNameMr}
          </span>
          <span className="font-mono text-xs font-bold text-stone-900 tracking-wide">
            {bus.busNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio read button */}
          <button
            onClick={handlePlayAudio}
            className="min-h-[36px] px-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            title="बसची माहिती ऐका"
          >
            <span>🔊</span>
            <span className="hidden sm:inline">माहिती ऐका</span>
          </button>

          {/* Delay notification alert toggle */}
          {onToggleSubscribe && (
            <button
              onClick={() => onToggleSubscribe(bus.id)}
              className={`min-h-[36px] px-2 rounded-lg text-xs font-bold border transition-colors ${
                isSubscribed
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title="या बसच्या विलंबाच्या सूचना मिळवा"
            >
              <span>{isSubscribed ? '🔔 सूचना चालू' : '🔕 सूचना बंद'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bus Content */}
      <div className="p-4">
        {/* Name and Route */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-stone-900 leading-tight">
              {bus.nameMr}
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">{bus.name}</p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-stone-500 block">प्लॅटफॉर्म</span>
            <span className="text-base font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 inline-block font-mono">
              क्र. {bus.platformNo}
            </span>
          </div>
        </div>

        {/* Timetable & Duration Row */}
        <div className="mt-3 grid grid-cols-3 items-center py-2.5 px-3 bg-stone-50 rounded-xl border border-stone-100">
          <div>
            <span className="text-[10px] text-stone-500 block">सुटण्याची वेळ</span>
            <span className="text-sm font-bold text-stone-900 font-mono">
              {bus.departureTime}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-stone-500 block">स्थिती</span>
            <span
              className={`text-xs font-bold inline-flex items-center gap-1 ${
                isDelayed ? 'text-red-600' : 'text-emerald-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDelayed ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{bus.statusTextMr}</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-500 block">अपेक्षित आगमन</span>
            <span className="text-sm font-bold text-stone-900 font-mono">
              {bus.expectedArrivalTime}
            </span>
          </div>
        </div>

        {/* Real-time Delay Reason if applicable */}
        {isDelayed && (
          <div className="mt-2.5 p-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
            <span className="text-sm mt-0.5">⚠️</span>
            <div>
              <span className="font-bold">विलंब कारण: </span>
              <span>{bus.delayReasonMr}</span>
            </div>
          </div>
        )}

        {/* Live GPS Telemetry Row */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2 border-t border-stone-100 pt-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">📍 पुढील थांबा:</span>
            <strong className="text-stone-900">{bus.nextStopEtaMins} मिनिटांत पोहोचेल</strong>
          </div>

          <div className="flex items-center gap-3">
            <span>वेग: <strong className="font-mono text-stone-900">{bus.speedKmH} किमी/तास</strong></span>
            <span>·</span>
            <span>
              जागा: <strong className="text-stone-900 font-bold">{bus.availableSeats} शिल्लक</strong>
            </span>
          </div>
        </div>

        {/* Conductor & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-xs text-stone-500 self-start sm:self-center">
            वाहक: <span className="font-semibold text-stone-800">{bus.conductorNameMr}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onTrackOnMap(bus.id)}
              className="flex-1 sm:flex-none px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>🗺️</span>
              <span>नकाशावर पहा</span>
            </button>

            <button
              onClick={() => onBook(bus)}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <span>🎫</span>
              <span>तिकीट आरक्षण</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
