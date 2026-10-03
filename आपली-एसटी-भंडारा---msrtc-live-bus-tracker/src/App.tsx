/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BHANDARA_STOPS,
  INITIAL_LIVE_BUSES,
  INITIAL_NOTIFICATIONS,
  LiveBus,
  DelayNotification,
  BusCategory,
} from './data/bhandaraData';
import { busAudio } from './utils/audio';
import { Language, TRANSLATIONS } from './utils/i18n';
import { LiveBusMap } from './components/LiveBusMap';
import { RouteSearchCard } from './components/RouteSearchCard';
import { BusListCard } from './components/BusListCard';
import { VoiceSearchMic } from './components/VoiceSearchMic';
import { AudioBusAlertBanner } from './components/AudioBusAlertBanner';
import { EasyVisualStationPicker } from './components/EasyVisualStationPicker';
import { BookingTicketModal } from './components/BookingTicketModal';
import { DailyCommuterHub } from './components/DailyCommuterHub';
import { PushNotificationDrawer } from './components/PushNotificationDrawer';
import { ExactArrivalTracker } from './components/ExactArrivalTracker';

export default function App() {
  // Localization state
  const [lang, setLang] = useState<Language>('mr');
  const t = TRANSLATIONS[lang];

  // Navigation / View State
  const [activeNav, setActiveNav] = useState<'map' | 'arrivals' | 'routes' | 'commuters' | 'delays'>('map');
  const [easyMode, setEasyMode] = useState<boolean>(false);

  // Search State
  const [originId, setOriginId] = useState<string>('bhandara_central');
  const [destinationId, setDestinationId] = useState<string>('sakoli');
  const [selectedCategory, setSelectedCategory] = useState<BusCategory | 'all'>('all');

  // Live Buses Fleet State
  const [buses, setBuses] = useState<LiveBus[]>(INITIAL_LIVE_BUSES);
  const [selectedBusId, setSelectedBusId] = useState<string | null>('bus-1');
  const [subscribedBusIds, setSubscribedBusIds] = useState<Set<string>>(new Set(['bus-1', 'bus-4']));

  // Notifications State
  const [notifications, setNotifications] = useState<DelayNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [activeToast, setActiveToast] = useState<DelayNotification | null>(null);

  // Booking Modal State
  const [bookingBus, setBookingBus] = useState<LiveBus | null>(null);

  const handleToggleLanguage = () => {
    const nextLang: Language = lang === 'mr' ? 'en' : 'mr';
    setLang(nextLang);
    const announcement =
      nextLang === 'en'
        ? 'Website converted to English.'
        : 'वेबसाईट मराठी भाषेत बदलली आहे.';
    busAudio.speak(announcement, nextLang === 'en' ? 'en-IN' : 'mr-IN');
  };

  // Real-time bus simulation movement interval
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          // If bus is boarding at depot, it stays parked; otherwise moves slightly
          if (bus.status === 'boarding') {
            return bus;
          }

          // Small lat/lng step to simulate smooth movement
          const deltaLat = (Math.random() - 0.48) * 0.0006;
          const deltaLng = (Math.random() - 0.48) * 0.0006;
          const newSpeed = Math.max(30, Math.min(65, bus.speedKmH + Math.floor((Math.random() - 0.5) * 4)));

          // Slowly decrement ETA
          const newEta = Math.max(1, bus.nextStopEtaMins - (Math.random() > 0.8 ? 1 : 0));

          return {
            ...bus,
            currentLat: bus.currentLat + deltaLat,
            currentLng: bus.currentLng + deltaLng,
            speedKmH: newSpeed,
            nextStopEtaMins: newEta,
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Filtered Buses for Search
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => {
      // Category filter
      if (selectedCategory !== 'all' && bus.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [buses, selectedCategory]);

  // Selected Bus object
  const selectedBus = useMemo(() => {
    return buses.find((b) => b.id === selectedBusId) || buses[0];
  }, [buses, selectedBusId]);

  // Handle station selection from voice mic
  const handleVoiceSelectStation = useCallback((spokenName: string, stationId?: string) => {
    if (stationId) {
      setDestinationId(stationId);
      setActiveNav('routes');
      return;
    }

    // Attempt matching with Bhandara stops
    const matched = BHANDARA_STOPS.find(
      (s) =>
        s.nameMr.includes(spokenName) ||
        spokenName.includes(s.nameMr.replace(' बस स्थानक', '')) ||
        s.name.toLowerCase().includes(spokenName.toLowerCase())
    );

    if (matched) {
      setDestinationId(matched.id);
      setActiveNav('routes');
    } else {
      // Default to Sakoli
      setDestinationId('sakoli');
      setActiveNav('routes');
    }
  }, []);

  // Swap Origin and Destination
  const handleSwapStations = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
  };

  // Toggle Push alert subscription for specific bus
  const handleToggleSubscribe = (busId: string) => {
    setSubscribedBusIds((prev) => {
      const next = new Set(prev);
      if (next.has(busId)) {
        next.delete(busId);
        busAudio.speak('या बसची सूचना बंद केली.');
      } else {
        next.add(busId);
        busAudio.speak('या बसची विलंब सूचना सुरू केली.');
      }
      return next;
    });
  };

  // Trigger simulated delay notification
  const handleTriggerTestDelay = () => {
    const reasons = [
      'लाखांदूर-पवनी रस्त्यावर झाड पडल्यामुळे वाहतूक संथ गतीने - १० मिनिटे विलंब',
      'खात रोड रेल्वे फाटक बंद असल्यामुळे तुमसर बस १५ मिनिटे उशिरा',
      'वैनगंगा नदी पुलावर अवजड वाहनांची रांग लागल्यामुळे १२ मिनिटे विलंब',
      'साकोली सेंदूरवाफा चौकात वाहतूक कोंडीमुळे ८ मिनिटे विलंब',
    ];
    const pickedReason = reasons[Math.floor(Math.random() * reasons.length)];
    const targetBus = buses[Math.floor(Math.random() * buses.length)];

    const newNotif: DelayNotification = {
      id: `notif-${Date.now()}`,
      busId: targetBus.id,
      busNumber: targetBus.busNumber,
      busNameMr: targetBus.nameMr,
      timestamp: 'आत्ताच',
      type: 'delay',
      delayMinutes: 12,
      messageMr: `नवीन विलंब सूचना! ${targetBus.busNumber} (${targetBus.nameMr}): ${pickedReason}.`,
      messageEn: `Delay update on ${targetBus.nameMr}: ${pickedReason}`,
      read: false,
      priority: 'high',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);

    if (pushEnabled) {
      busAudio.speak(newNotif.messageMr);
    }

    setTimeout(() => {
      setActiveToast((curr) => (curr?.id === newNotif.id ? null : curr));
    }, 7000);
  };

  const handleSelectQuickRoute = (from: string, to: string) => {
    setOriginId(from);
    setDestinationId(to);
    setActiveNav('routes');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. TOP BAR CONTRACT: Zone 1 (Single Text Brand) - Zone 2 (4-5 Nav Links) - Zone 3 (Primary Actions) */}
      <header className="sticky top-0 z-[500] bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand single text wordmark */}
          <a
            href="/"
            className="text-lg sm:text-xl font-black tracking-tight text-red-700 hover:text-red-800 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-base shadow-sm">
              🚌
            </span>
            <span>{t.appTitle}</span>
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-stone-600">
            <button
              onClick={() => setActiveNav('map')}
              className={`hover:text-red-700 transition-colors ${
                activeNav === 'map' ? 'text-red-700 font-bold border-b-2 border-red-700 pb-0.5' : ''
              }`}
            >
              {t.navMap}
            </button>
            <button
              onClick={() => setActiveNav('arrivals')}
              className={`hover:text-red-700 transition-colors flex items-center gap-1 ${
                activeNav === 'arrivals' ? 'text-red-700 font-bold border-b-2 border-red-700 pb-0.5' : ''
              }`}
            >
              <span>⏱️</span>
              <span>{t.navArrivals}</span>
            </button>
            <button
              onClick={() => setActiveNav('routes')}
              className={`hover:text-red-700 transition-colors ${
                activeNav === 'routes' ? 'text-red-700 font-bold border-b-2 border-red-700 pb-0.5' : ''
              }`}
            >
              {t.navRoutes}
            </button>
            <button
              onClick={() => setActiveNav('commuters')}
              className={`hover:text-red-700 transition-colors ${
                activeNav === 'commuters' ? 'text-red-700 font-bold border-b-2 border-red-700 pb-0.5' : ''
              }`}
            >
              {t.navCommuters}
            </button>
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="hover:text-red-700 transition-colors flex items-center gap-1.5"
            >
              <span>{t.navDelays}</span>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions (Language Switcher + Easy Visual Mode + Bell) */}
          <div className="flex items-center gap-2">
            {/* Bilingual English / Marathi Language Switcher */}
            <button
              onClick={handleToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 shadow-2xs flex items-center gap-1"
              title={lang === 'mr' ? 'Switch to English' : 'मराठीमध्ये बदला'}
            >
              <span className="text-sm">🌐</span>
              <span className="font-semibold">{lang === 'mr' ? 'English' : 'मराठी'}</span>
            </button>

            {/* Illiterate Easy Mode Switch */}
            <button
              onClick={() => {
                const nextMode = !easyMode;
                setEasyMode(nextMode);
                busAudio.speak(
                  nextMode
                    ? (lang === 'mr' ? 'सुलभ दृष्टी मोड सुरू केला आहे. आता मोठी चिन्हे आणि आवाज उपलब्ध आहेत.' : 'Easy Visual Mode activated.')
                    : (lang === 'mr' ? 'सामान्य मोड सुरू केला आहे.' : 'Standard mode activated.'),
                  lang === 'mr' ? 'mr-IN' : 'en-IN'
                );
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                easyMode
                  ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-400 shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title="अक्षर ओळख नसलेल्या प्रवाशांसाठी सुलभ मोड"
            >
              <span>{easyMode ? t.easyModeActive : t.easyModeToggle}</span>
            </button>

            {/* Notification trigger button */}
            <button
              onClick={() => setIsNotifDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
              title="विलंब सूचना उघडा"
            >
              <span className="text-base">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Live Toast Push Alert */}
      {activeToast && (
        <div className="fixed top-20 right-4 z-[999] max-w-sm bg-red-600 text-white p-3.5 rounded-2xl shadow-2xl border-2 border-yellow-300 animate-bounce">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <strong className="text-xs font-bold">{activeToast.busNameMr}</strong>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-white hover:text-stone-200 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-xs mt-1 text-red-50 leading-snug">
            {lang === 'mr' ? activeToast.messageMr : activeToast.messageEn}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-red-500">
            <span className="font-mono">{activeToast.busNumber}</span>
            <button
              onClick={() => busAudio.speak(lang === 'mr' ? activeToast.messageMr : activeToast.messageEn, lang === 'mr' ? 'mr-IN' : 'en-IN')}
              className="px-2 py-0.5 bg-yellow-400 text-stone-950 font-bold rounded"
            >
              🔊 {lang === 'mr' ? 'पुन्हा ऐका' : 'Listen Again'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex-1 w-full space-y-5">
        {/* District Headline & Hero Banner with Generated Asset */}
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-md">
          <div className="relative h-44 sm:h-56 w-full overflow-hidden">
            <img
              src="/src/assets/images/msrtc_bhandara_bus_1791018859853.jpg"
              alt="MSRTC Lal Pari bus on Bhandara highway near Wainganga river"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-45 brightness-95"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 text-white">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                  <span>{t.appSubtitle}</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {t.heroTitle}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
                  {t.heroDesc}
                </p>
              </div>

              {/* District Stats Strip */}
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">{t.activeBuses}</span>
                  <strong className="text-amber-400 font-mono text-sm">{buses.length} {lang === 'mr' ? 'गाड्या' : 'buses'}</strong>
                </div>
                <span className="text-stone-600">|</span>
                <div>
                  <span className="text-[10px] text-stone-400 block">{t.majorDepots}</span>
                  <strong className="text-white font-mono text-sm">8 {lang === 'mr' ? 'स्थानके' : 'depots'}</strong>
                </div>
                <span className="text-stone-600">|</span>
                <div>
                  <span className="text-[10px] text-stone-400 block">{t.voiceAnnouncements}</span>
                  <strong className="text-emerald-400 font-semibold text-xs">{lang === 'mr' ? 'मराठी' : 'English & Marathi'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Live Delay Announcement Banner */}
        <AudioBusAlertBanner
          notifications={notifications}
          onOpenNotifications={() => setIsNotifDrawerOpen(true)}
          pushEnabled={pushEnabled}
          onTogglePush={() => {
            const next = !pushEnabled;
            setPushEnabled(next);
            busAudio.speak(
              next
                ? (lang === 'mr' ? 'विलंब सूचना सुरू केल्या आहेत.' : 'Delay alerts enabled.')
                : (lang === 'mr' ? 'विलंब सूचना बंद केल्या आहेत.' : 'Delay alerts disabled.'),
              lang === 'mr' ? 'mr-IN' : 'en-IN'
            );
          }}
        />

        {/* Voice Search & Pictorial Speakable Destination Cards */}
        <VoiceSearchMic
          onSelectStation={handleVoiceSelectStation}
          easyMode={easyMode}
        />

        {/* Illiterate / Low-Literacy Visual Mode Helper */}
        {easyMode && (
          <EasyVisualStationPicker
            onSelectOrigin={(id) => setOriginId(id)}
            onSelectDestination={(id) => setDestinationId(id)}
            currentOriginId={originId}
            currentDestinationId={destinationId}
          />
        )}

        {/* Dynamic Nav View Switcher: Map View vs Exact Arrival Times vs Route View vs Daily Commuters */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-2 overflow-x-auto gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveNav('map')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNav === 'map'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>🗺️</span>
              <span>{t.navMap}</span>
            </button>

            {/* Exact Arrival Times Menu Button */}
            <button
              onClick={() => setActiveNav('arrivals')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNav === 'arrivals'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>⏱️</span>
              <span>{t.navArrivals}</span>
            </button>

            <button
              onClick={() => setActiveNav('routes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNav === 'routes'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>🔍</span>
              <span>{t.navRoutes} ({filteredBuses.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('commuters')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNav === 'commuters'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>🎒</span>
              <span>{t.navCommuters}</span>
            </button>
          </div>

          <button
            onClick={handleTriggerTestDelay}
            className="hidden sm:flex text-xs text-amber-800 hover:text-amber-950 font-semibold items-center gap-1 shrink-0"
            title="विलंब सूचनांचे प्रात्यक्षिक पहा"
          >
            <span>⚡ {lang === 'mr' ? 'प्रात्यक्षिक सूचना' : 'Simulate Delay'}</span>
          </button>
        </div>

        {/* View 0: Exact Bus Arrival Radar (Addresses students and daily commuters waiting/missing buses) */}
        {activeNav === 'arrivals' && (
          <ExactArrivalTracker
            buses={buses}
            onBookBus={(bus) => setBookingBus(bus)}
            onTrackBus={(id) => {
              setSelectedBusId(id);
              setActiveNav('map');
            }}
            lang={lang}
            easyMode={easyMode}
          />
        )}

        {/* View 1: Real-Time Map & Live Bus Details Card */}
        {activeNav === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8">
              <LiveBusMap
                buses={buses}
                selectedBusId={selectedBusId}
                onSelectBus={(id) => setSelectedBusId(id)}
                onBookBus={(bus) => setBookingBus(bus)}
                easyMode={easyMode}
              />
            </div>

            {/* Right sidebar: Selected Bus Live Status details */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    निवडलेली बस माहिती
                  </span>
                  <button
                    onClick={() => busAudio.speak(selectedBus.audioAlertMr)}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <span>🔊</span>
                    <span>आवाज ऐका</span>
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {selectedBus.categoryNameMr}
                    </span>
                    <span className="font-mono text-xs font-bold text-stone-900">
                      {selectedBus.busNumber}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mt-1.5">
                    {selectedBus.nameMr}
                  </h3>
                  <p className="text-xs text-stone-500">{selectedBus.name}</p>

                  <div className="mt-3 p-3 bg-stone-50 rounded-xl space-y-2 text-xs border border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">स्थानक प्लॅटफॉर्म:</span>
                      <strong className="text-amber-900 font-bold text-sm">
                        प्लॅटफॉर्म क्र. {selectedBus.platformNo}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">प्रस्थान वेळ:</span>
                      <strong className="font-mono text-stone-900 text-sm">
                        {selectedBus.departureTime}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">थेट स्थिती:</span>
                      <strong
                        className={
                          selectedBus.delayMinutes > 0 ? 'text-red-600' : 'text-emerald-700'
                        }
                      >
                        {selectedBus.statusTextMr}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">पुढील थांबा:</span>
                      <strong className="text-stone-900">
                        {selectedBus.nextStopEtaMins} मिनिटांत आगमन
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">सध्याचा वेग:</span>
                      <strong className="font-mono text-stone-900">
                        {selectedBus.speedKmH} किमी/तास
                      </strong>
                    </div>
                  </div>

                  {selectedBus.delayMinutes > 0 && (
                    <div className="mt-3 p-2.5 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs">
                      <strong className="block mb-0.5">⚠️ विलंबाचे कारण:</strong>
                      <p>{selectedBus.delayReasonMr}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setBookingBus(selectedBus)}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>🎫</span>
                      <span>या बसमध्ये जागा आरक्षित करा</span>
                    </button>
                  </div>
                </div>
              </div>

                {/* Other live buses in district quick picker */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
                  <h4 className="text-xs font-bold text-stone-800 mb-2">
                    इतर धावत्या बसेस ({buses.length}):
                  </h4>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {buses.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBusId(b.id)}
                        className={`w-full text-left p-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                          selectedBusId === b.id
                            ? 'bg-amber-100/70 border border-amber-300 font-bold text-amber-950'
                            : 'hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="block truncate">{b.nameMr}</span>
                          <span className="font-mono text-[10px] text-stone-500">{b.busNumber}</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap ${
                            b.delayMinutes > 0
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {b.delayMinutes > 0 ? `+${b.delayMinutes}मि.` : 'वेळेवर'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* View 2: Route Search and Bus List View */}
        {activeNav === 'routes' && (
          <div className="space-y-5">
            <RouteSearchCard
              originId={originId}
              destinationId={destinationId}
              onOriginChange={(id) => setOriginId(id)}
              onDestinationChange={(id) => setDestinationId(id)}
              onSwap={handleSwapStations}
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => setSelectedCategory(cat)}
              onSearch={() => setActiveNav('routes')}
              lang={lang}
              easyMode={easyMode}
            />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <span>🚌</span>
                  <span>उपलब्ध बसेसची यादी ({filteredBuses.length})</span>
                </h3>
                <span className="text-xs text-stone-500">
                  थेट जीपीएस ट्रॅकिंगसह जोडलेले
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBuses.map((bus) => (
                  <BusListCard
                    key={bus.id}
                    bus={bus}
                    onTrackOnMap={(id) => {
                      setSelectedBusId(id);
                      setActiveNav('map');
                    }}
                    onBook={(b) => setBookingBus(b)}
                    isSubscribed={subscribedBusIds.has(bus.id)}
                    onToggleSubscribe={handleToggleSubscribe}
                    easyMode={easyMode}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View 3: Daily Commuter Hub & Pass Portal */}
        {activeNav === 'commuters' && (
          <DailyCommuterHub
            onSelectQuickRoute={handleSelectQuickRoute}
            buses={buses}
            onTrackBus={(id) => {
              setSelectedBusId(id);
              setActiveNav('map');
            }}
            easyMode={easyMode}
          />
        )}
      </main>

      {/* Booking and E-Ticket Modal */}
      <BookingTicketModal
        bus={bookingBus}
        onClose={() => setBookingBus(null)}
        easyMode={easyMode}
      />

      {/* Push Delay Notifications Slide Drawer */}
      <PushNotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          busAudio.speak('सर्व सूचना वाचल्याची खूण केली.');
        }}
        onTriggerTestDelayAlert={handleTriggerTestDelay}
      />

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-stone-200 py-6 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">आपली एसटी - भंडारा जिल्हा आगार</span>
            <span>·</span>
            <span>महाराष्ट्र राज्य मार्ग परिवहन महामंडळ</span>
          </div>

          <div className="flex items-center gap-4 text-stone-500">
            <span>भंडारा आगार मदत क्रमांक: ०७१८४-२५२१३४</span>
            <span>·</span>
            <span>२४x७ आपत्कालीन सहायता</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
