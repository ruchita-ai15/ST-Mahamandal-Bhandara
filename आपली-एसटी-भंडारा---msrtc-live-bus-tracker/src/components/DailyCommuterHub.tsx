import React, { useState } from 'react';
import { FREQUENT_BHANDARA_ROUTES, LiveBus } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';

interface DailyCommuterHubProps {
  onSelectQuickRoute: (fromId: string, toId: string) => void;
  buses: LiveBus[];
  onTrackBus: (busId: string) => void;
  easyMode?: boolean;
}

export const DailyCommuterHub: React.FC<DailyCommuterHubProps> = ({
  onSelectQuickRoute,
  buses,
  onTrackBus,
  easyMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'quick_routes' | 'pass_portal' | 'timetable'>('quick_routes');
  const [passNumber, setPassNumber] = useState('BND-PASS-2026-9812');
  const [showPassResult, setShowPassResult] = useState(false);

  const handleVerifyPass = () => {
    setShowPassResult(true);
    busAudio.speak('आपला मासिक पास वैध आहे! भंडारा ते साकोली मार्गावर २८ दिवस शिल्लक.');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
      {/* Tab Header (Clean Segmented Tabs) */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
            <span>🎒</span>
            <span>दैनंदिन प्रवासी कक्ष (Daily Commuter Hub)</span>
          </h3>
          <p className="text-xs text-stone-500">रोज प्रवास करणाऱ्या नोकरदार, विद्यार्थी व प्रवाशांसाठी</p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('quick_routes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'quick_routes'
                ? 'bg-white text-stone-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            वारंवार मार्ग
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pass_portal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'pass_portal'
                ? 'bg-white text-stone-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            माझा एसटी पास
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timetable')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'timetable'
                ? 'bg-white text-stone-900 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            पूर्ण वेळापत्रक
          </button>
        </div>
      </div>

      {/* Tab 1: Frequent Bhandara Routes */}
      {activeTab === 'quick_routes' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700">
              भंडारा जिल्ह्यातील सर्वाधिक गर्दीचे मार्ग (१-टॅपमध्ये शोधा):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FREQUENT_BHANDARA_ROUTES.map((route, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{route.icon}</span>
                    <span className="text-xs font-mono font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {route.fare}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mt-2">{route.titleMr}</h4>
                  <p className="text-xs text-stone-500">{route.titleEn}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                  <span>⏱️ {route.duration}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">{route.frequency}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    busAudio.speak(`${route.titleMr} निवडले.`);
                    onSelectQuickRoute(route.fromId, route.toId);
                  }}
                  className="mt-3 w-full py-1.5 bg-white hover:bg-amber-500 hover:text-white text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <span>बसेस पहा</span>
                  <span>➔</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Commuter Monthly Pass Portal */}
      {activeTab === 'pass_portal' && (
        <div className="mt-4 max-w-lg mx-auto">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <span>🎟️</span>
              <span>मासिक पास तपासणी व नूतनीकरण</span>
            </h4>
            <p className="text-xs text-stone-600 mt-1">
              भंडारा, साकोली, तुमसर, लाखनी मार्गावरील आपला डिजिटल एसटी पास तपासा.
            </p>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                पास किंवा आधार क्रमांक प्रविष्ट करा:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={passNumber}
                  onChange={(e) => setPassNumber(e.target.value)}
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyPass}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  तपासा
                </button>
              </div>
            </div>

            {showPassResult && (
              <div className="mt-4 p-3 bg-white rounded-xl border border-emerald-300 space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-800 font-bold border-b border-stone-100 pb-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>पास सक्रिय आहे (ACTIVE PASS)</span>
                  </span>
                  <span className="font-mono">वैधता: ३१ ऑक्टोबर २०२६</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div>प्रवासी नाव: <strong>गणेश ठाकरे (विद्यार्थी)</strong></div>
                  <div>मार्ग: <strong>भंडारा ⇄ साकोली</strong></div>
                  <div>सवलत प्रकार: <strong>६६% विद्यार्थी पास</strong></div>
                  <div>शिल्लक दिवस: <strong className="text-emerald-700">२८ दिवस</strong></div>
                </div>
                <button
                  type="button"
                  onClick={() => busAudio.speak('आपला पास सक्रिय आहे. गणेश ठाकरे, भंडारा ते साकोली मार्ग.')}
                  className="w-full mt-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-semibold text-[11px] flex items-center justify-center gap-1"
                >
                  <span>🔊</span>
                  <span>पास तपशील ऐका</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: District Live Timetable Grid */}
      {activeTab === 'timetable' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold bg-stone-50">
                <th className="py-2.5 px-3">गाडी क्र. व नाव</th>
                <th className="py-2.5 px-3">प्रकार</th>
                <th className="py-2.5 px-3">प्रस्थान</th>
                <th className="py-2.5 px-3">प्लॅटफॉर्म</th>
                <th className="py-2.5 px-3">स्थिती</th>
                <th className="py-2.5 px-3 text-right">कृती</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {buses.map((b) => (
                <tr key={b.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-stone-900">{b.nameMr}</div>
                    <div className="font-mono text-[11px] text-stone-500">{b.busNumber}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-stone-700">{b.categoryNameMr}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                    {b.departureTime}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-900">
                    क्र. {b.platformNo}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        b.delayMinutes > 0 ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      <span>{b.statusTextMr}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => busAudio.speak(b.audioAlertMr)}
                        className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded"
                        title="माहिती ऐका"
                      >
                        🔊
                      </button>
                      <button
                        type="button"
                        onClick={() => onTrackBus(b.id)}
                        className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-bold text-[11px]"
                      >
                        ट्रॅक करा
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
