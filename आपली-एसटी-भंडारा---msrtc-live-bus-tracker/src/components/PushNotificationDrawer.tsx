import React from 'react';
import { DelayNotification } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';

interface PushNotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: DelayNotification[];
  onMarkAllAsRead: () => void;
  onTriggerTestDelayAlert: () => void;
}

export const PushNotificationDrawer: React.FC<PushNotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onTriggerTestDelayAlert,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-amber-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <div>
              <h3 className="font-bold text-base">थेट विलंब सूचना कक्ष</h3>
              <p className="text-xs text-amber-200">भंडारा जिल्हा एसटी वाहतूक नियंत्रण</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-800 hover:bg-amber-700 flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Action bar */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllAsRead}
            className="text-stone-600 hover:text-stone-900 font-semibold"
          >
            सर्व वाचलेले खूण करा
          </button>

          <button
            onClick={onTriggerTestDelayAlert}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition-colors flex items-center gap-1"
          >
            <span>⚡</span>
            <span>नवीन विलंब अलर्ट सिम्युलेट करा</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="font-bold">सध्या कोणतीही विलंब सूचना नाही!</p>
              <p className="text-xs text-stone-400 mt-1">सर्व गाड्या वेळेवर धावत आहेत.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  notif.type === 'delay'
                    ? 'bg-red-50/70 border-red-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{notif.type === 'delay' ? '⚠️' : '🚌'}</span>
                    <span className="font-bold text-xs text-stone-900">{notif.busNameMr}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">{notif.timestamp}</span>
                </div>

                <p className="text-xs text-stone-800 font-medium mt-1.5 leading-relaxed">
                  {notif.messageMr}
                </p>

                <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-stone-600">{notif.busNumber}</span>
                  <button
                    onClick={() => busAudio.speak(notif.messageMr)}
                    className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 rounded border border-amber-300 font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <span>🔊</span>
                    <span>ऐका</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500">
          आपत्कालीन एसटी नियंत्रण कक्ष (भंडारा): <strong className="text-stone-900">०७१८४-२५२१३४</strong>
        </div>
      </div>
    </div>
  );
};
