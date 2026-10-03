import React from 'react';
import { BHANDARA_STOPS, BusStop } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';

interface EasyVisualStationPickerProps {
  onSelectOrigin: (id: string) => void;
  onSelectDestination: (id: string) => void;
  currentOriginId: string;
  currentDestinationId: string;
}

export const EasyVisualStationPicker: React.FC<EasyVisualStationPickerProps> = ({
  onSelectOrigin,
  onSelectDestination,
  currentOriginId,
  currentDestinationId,
}) => {
  const handleHearStation = (stop: BusStop) => {
    busAudio.speak(`हे ${stop.nameMr} आहे. ओळख चिन्ह: ${stop.landmarkMr}`);
  };

  const getStopEmoji = (iconType: string) => {
    switch (iconType) {
      case 'temple':
        return '🏛️';
      case 'bridge':
        return '🌉';
      case 'wheat':
        return '🌾';
      case 'factory':
        return '🏭';
      case 'store':
        return '🏪';
      default:
        return '🚌';
    }
  };

  return (
    <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-sm">
            👁️
          </span>
          <div>
            <h3 className="text-lg font-black text-amber-950">
              सुलभ चित्र दर्शन कक्ष (Visual Station Selector)
            </h3>
            <p className="text-xs text-amber-800 font-medium">
              वाचता येत नाही का? चित्रावर दाबा आणि आवाज ऐका! (Tap pictorial card to listen)
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            busAudio.speak(
              'सुलभ मोड सुरू आहे. खाली दिलेल्या चित्रांवर दाबा आणि आपले गाव निवडा. हिरवे बटण म्हणजे सुरुवात, लाल बटण म्हणजे जायचे ठिकाण.'
            )
          }
          className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <span>🔊</span>
          <span>मदत ऐका</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {BHANDARA_STOPS.slice(0, 8).map((stop) => {
          const isOrigin = currentOriginId === stop.id;
          const isDest = currentDestinationId === stop.id;

          return (
            <div
              key={stop.id}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between bg-white ${
                isOrigin
                  ? 'border-emerald-600 ring-2 ring-emerald-400 bg-emerald-50/40'
                  : isDest
                  ? 'border-red-600 ring-2 ring-red-400 bg-red-50/40'
                  : 'border-stone-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{getStopEmoji(stop.iconType)}</span>
                <button
                  type="button"
                  onClick={() => handleHearStation(stop)}
                  className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center text-base transition-colors"
                  title="स्थानकाचे नाव ऐका"
                >
                  🔊
                </button>
              </div>

              <div className="mt-2">
                <h4 className="font-black text-stone-900 text-sm">{stop.nameMr}</h4>
                <p className="text-[11px] text-stone-500 font-semibold truncate">{stop.landmarkMr}</p>
              </div>

              {/* Action Buttons for Illiterate: Big Green (Start) & Big Red (Destination) */}
              <div className="mt-3 pt-2 border-t border-stone-100 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectOrigin(stop.id);
                    busAudio.speak(`सुरुवात निवडली: ${stop.nameMr}`);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    isOrigin
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950'
                  }`}
                  title="येथून निघणार"
                >
                  <span>🟢</span>
                  <span>इथून</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectDestination(stop.id);
                    busAudio.speak(`गंतव्य निवडले: ${stop.nameMr}`);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                    isDest
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-red-100 hover:bg-red-200 text-red-950'
                  }`}
                  title="येथे जाणार"
                >
                  <span>🔴</span>
                  <span>इथे</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
