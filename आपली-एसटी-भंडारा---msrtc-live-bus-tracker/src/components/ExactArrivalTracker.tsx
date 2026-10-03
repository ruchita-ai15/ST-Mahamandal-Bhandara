import React, { useState } from 'react';
import { BHANDARA_STOPS, LiveBus, BusStop } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface ExactArrivalTrackerProps {
  buses: LiveBus[];
  onBookBus: (bus: LiveBus) => void;
  onTrackBus: (busId: string) => void;
  lang: Language;
  easyMode?: boolean;
}

export const ExactArrivalTracker: React.FC<ExactArrivalTrackerProps> = ({
  buses,
  onBookBus,
  onTrackBus,
  lang,
  easyMode = false,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedStopId, setSelectedStopId] = useState<string>('bhandara_central');
  const [timeFilter, setTimeFilter] = useState<'all' | '15m' | '30m' | 'student'>('all');
  const [alertBusIds, setAlertBusIds] = useState<Set<string>>(new Set());

  const currentStop = BHANDARA_STOPS.find((s) => s.id === selectedStopId) || BHANDARA_STOPS[0];

  // Calculate upcoming buses for the selected stop
  const arrivingBuses = buses.filter((bus) => {
    // If student filter active, show manav_vikas or ordinary buses
    if (timeFilter === 'student' && bus.category !== 'manav_vikas' && bus.category !== 'lal_pari') {
      return false;
    }
    // Time filter
    if (timeFilter === '15m' && bus.nextStopEtaMins > 15) {
      return false;
    }
    if (timeFilter === '30m' && bus.nextStopEtaMins > 30) {
      return false;
    }
    return true;
  });

  // Sort by closest arrival ETA (ascending)
  const sortedArriving = [...arrivingBuses].sort((a, b) => a.nextStopEtaMins - b.nextStopEtaMins);

  const handleToggleAlert = (bus: LiveBus) => {
    setAlertBusIds((prev) => {
      const next = new Set(prev);
      if (next.has(bus.id)) {
        next.delete(bus.id);
        const msg = lang === 'mr' ? 'आठवण सूचना बंद केली.' : 'Arrival alarm cancelled.';
        busAudio.speak(msg, lang === 'mr' ? 'mr-IN' : 'en-IN');
      } else {
        next.add(bus.id);
        const msg =
          lang === 'mr'
            ? `आठवण सेट केली! ${bus.nameMr} ५ मिनिटे आधी येताच तुम्हाला गजर वाजवून सांगितले जाईल.`
            : `Alarm set! You will be alerted 5 minutes before ${bus.name} arrives.`;
        busAudio.speak(msg, lang === 'mr' ? 'mr-IN' : 'en-IN');
      }
      return next;
    });
  };

  const handleSpeakArrival = (bus: LiveBus) => {
    const text =
      lang === 'mr'
        ? `लक्ष द्या! ${bus.nameMr}, गाडी क्रमांक ${bus.busNumber}, पुढील ${bus.nextStopEtaMins} मिनिटांत प्लॅटफॉर्म क्रमांक ${bus.platformNo} वर पोहोचत आहे. ${bus.delayMinutes > 0 ? `${bus.delayMinutes} मिनिटे उशीर आहे.` : 'गाडी वेळेवर आहे.'}`
        : `Attention! ${bus.name}, Bus number ${bus.busNumber}, arriving in ${bus.nextStopEtaMins} minutes at Platform number ${bus.platformNo}. ${bus.delayMinutes > 0 ? `Running ${bus.delayMinutes} minutes late.` : 'Running on schedule.'}`;
    busAudio.speak(text, lang === 'mr' ? 'mr-IN' : 'en-IN');
  };

  const handleAnnounceAll = () => {
    if (sortedArriving.length === 0) {
      const msg =
        lang === 'mr'
          ? `${currentStop.nameMr} येथे सध्या कोणतीही बस येत नाही.`
          : `No incoming buses currently scheduled for ${currentStop.name}.`;
      busAudio.speak(msg, lang === 'mr' ? 'mr-IN' : 'en-IN');
      return;
    }

    const first = sortedArriving[0];
    const text =
      lang === 'mr'
        ? `${currentStop.nameMr} येथे पुढील बस ${first.nameMr} ही अवघ्या ${first.nextStopEtaMins} मिनिटांत प्लॅटफॉर्म ${first.platformNo} वर येत आहे.`
        : `At ${currentStop.name}, next bus is ${first.name}, arriving in ${first.nextStopEtaMins} minutes at Platform ${first.platformNo}.`;
    busAudio.speak(text, lang === 'mr' ? 'mr-IN' : 'en-IN');
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-700 to-amber-600 text-white rounded-3xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              ⏱️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {t.arrivalRadarTitle}
                </h2>
                <span className="bg-yellow-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Radar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
                {t.arrivalRadarSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleAnnounceAll}
            className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-stone-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all self-stretch sm:self-auto justify-center"
          >
            <span>🔊</span>
            <span>{lang === 'mr' ? 'सर्व बसेसच्या वेळा ऐका' : 'Announce Upcoming Times'}</span>
          </button>
        </div>

        {/* Stop Selector within Banner */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="text-xs font-bold text-amber-200 whitespace-nowrap flex items-center gap-1.5">
            <span>📍</span>
            <span>{t.selectStopPrompt}</span>
          </div>

          <div className="flex-1">
            <select
              value={selectedStopId}
              onChange={(e) => {
                setSelectedStopId(e.target.value);
                const s = BHANDARA_STOPS.find((stop) => stop.id === e.target.value);
                if (s) {
                  const name = lang === 'mr' ? s.nameMr : s.name;
                  busAudio.speak(`${name} निवडले.`, lang === 'mr' ? 'mr-IN' : 'en-IN');
                }
              }}
              className="w-full bg-white/95 text-stone-900 border border-white/40 rounded-xl px-3 py-2.5 text-sm font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {BHANDARA_STOPS.map((stop: BusStop) => (
                <option key={stop.id} value={stop.id} className="text-stone-900">
                  {lang === 'mr' ? stop.nameMr : stop.name} — ({lang === 'mr' ? stop.landmarkMr : stop.landmark})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stop Buttons for Popular Bhandara Stations */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {BHANDARA_STOPS.slice(0, 5).map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStopId(s.id);
                busAudio.speak(lang === 'mr' ? s.nameMr : s.name, lang === 'mr' ? 'mr-IN' : 'en-IN');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedStopId === s.id
                  ? 'bg-white text-stone-900 shadow-sm ring-2 ring-yellow-400'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {lang === 'mr' ? s.nameMr.replace(' बस स्थानक', '') : s.name.replace(' Bus Stand', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs for Arrival Times */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeFilter === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setTimeFilter('15m')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeFilter === '15m'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ⚡ {t.filterNext15}
          </button>
          <button
            onClick={() => setTimeFilter('30m')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeFilter === '30m'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ⏱️ {t.filterNext30}
          </button>
          <button
            onClick={() => setTimeFilter('student')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeFilter === 'student'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🎓 {t.filterStudent}
          </button>
        </div>

        <span className="text-xs text-stone-500 font-semibold">
          {sortedArriving.length} {lang === 'mr' ? 'गाड्यांची माहिती उपलब्ध' : 'buses tracked in radar'}
        </span>
      </div>

      {/* Exact Time Cards List */}
      {sortedArriving.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center text-stone-500">
          <span className="text-4xl block mb-2">⏳</span>
          <p className="font-bold text-stone-800">{t.noBusesNow}</p>
          <p className="text-xs mt-1">
            {lang === 'mr'
              ? 'कृपया वरील वेळ फिल्टर बदला किंवा इतर स्थानक निवडा.'
              : 'Please adjust your time filter or check another station.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedArriving.map((bus) => {
            const hasAlert = alertBusIds.has(bus.id);
            const isDelayed = bus.delayMinutes > 0;

            return (
              <div
                key={bus.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Visual urgency accent line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    bus.nextStopEtaMins <= 5
                      ? 'bg-emerald-500 animate-pulse'
                      : bus.nextStopEtaMins <= 15
                      ? 'bg-amber-500'
                      : 'bg-stone-300'
                  }`}
                />

                <div className="flex items-start justify-between gap-2 mt-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-900 uppercase">
                        {lang === 'mr' ? bus.categoryNameMr : bus.category.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-xs font-bold text-stone-900">
                        {bus.busNumber}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-stone-900 mt-1">
                      {lang === 'mr' ? bus.nameMr : bus.name}
                    </h4>
                  </div>

                  {/* LIVE COUNTDOWN BADGE (The exact minute arrival) */}
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block uppercase font-bold">
                      {t.arrivingIn}
                    </span>
                    <div className="flex items-baseline gap-0.5 justify-end">
                      <span className="text-3xl font-black font-mono text-red-600 tracking-tight">
                        {bus.nextStopEtaMins}
                      </span>
                      <span className="text-xs font-bold text-red-800">
                        {t.mins}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Timing & Platform Data Grid */}
                <div className="mt-3 p-3 bg-stone-50 rounded-xl grid grid-cols-3 gap-2 text-xs border border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-500 block">{t.platform}</span>
                    <strong className="text-amber-900 font-bold font-mono text-sm">
                      {lang === 'mr' ? `क्र. ${bus.platformNo}` : `No. ${bus.platformNo}`}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 block">{t.scheduledTime}</span>
                    <strong className="font-mono text-stone-900 text-xs">
                      {bus.departureTime}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 block">{t.seatsAvailable}</span>
                    <strong className="font-mono text-emerald-700 font-bold text-xs">
                      {bus.availableSeats} / {bus.totalSeats}
                    </strong>
                  </div>
                </div>

                {/* Delay Warning if applicable */}
                {isDelayed && (
                  <div className="mt-2.5 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span>⚠️</span>
                      <span>
                        {lang === 'mr'
                          ? `${bus.delayMinutes} मि. उशीर: ${bus.delayReasonMr}`
                          : `${bus.delayMinutes}m delay: ${bus.delayReasonEn}`}
                      </span>
                    </span>
                  </div>
                )}

                {/* Action Buttons: Alarm, Audio Speech, Booking */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Speak Exact Time */}
                    <button
                      onClick={() => handleSpeakArrival(bus)}
                      className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      title={t.listenEta}
                    >
                      <span>🔊</span>
                      <span className="hidden sm:inline">{t.listenEta}</span>
                    </button>

                    {/* Miss Bus Prevention Alarm Toggle */}
                    <button
                      onClick={() => handleToggleAlert(bus)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${
                        hasAlert
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                      title={t.setAlert}
                    >
                      <span>{hasAlert ? '✓' : '🔔'}</span>
                      <span>{hasAlert ? t.alertSet : t.setAlert}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTrackBus(bus.id)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      {t.trackOnMap}
                    </button>

                    <button
                      onClick={() => onBookBus(bus)}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                    >
                      {t.bookSeat}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
