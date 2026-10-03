import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BHANDARA_STOPS, BHANDARA_ROUTES, LiveBus, BusStop } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';

interface LiveBusMapProps {
  buses: LiveBus[];
  selectedBusId: string | null;
  onSelectBus: (busId: string) => void;
  onBookBus: (bus: LiveBus) => void;
  easyMode?: boolean;
}

export const LiveBusMap: React.FC<LiveBusMapProps> = ({
  buses,
  selectedBusId,
  onSelectBus,
  onBookBus,
  easyMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayersRef = useRef<L.Polyline[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Bhandara District [21.1712, 79.7500]
    const map = L.map(mapContainerRef.current, {
      center: [21.1600, 79.7500],
      zoom: 11,
      minZoom: 9,
      maxZoom: 17,
      zoomControl: false,
    });

    // Add zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // High quality OpenStreetMap carto tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    // Draw route polylines
    BHANDARA_ROUTES.forEach((route) => {
      const isNH = route.id === 'bnd_skl';
      const polyline = L.polyline(route.pathCoordinates, {
        color: isNH ? '#dc2626' : '#d97706',
        weight: isNH ? 5 : 4,
        opacity: 0.75,
        dashArray: isNH ? undefined : '6, 6',
      }).addTo(map);

      polyline.bindTooltip(
        `<div class="font-sans text-xs font-semibold text-stone-800">${route.nameMr}</div>`,
        { sticky: true }
      );

      routeLayersRef.current.push(polyline);
    });

    // Draw Bus Stands / Depots
    BHANDARA_STOPS.forEach((stop: BusStop) => {
      const isDepot = stop.type === 'depot';
      const stopHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-8 h-8 rounded-full ${
            isDepot ? 'bg-amber-900 border-2 border-amber-300 shadow-md' : 'bg-stone-800 border-2 border-white'
          } flex items-center justify-center text-white text-xs shadow-sm transition-transform hover:scale-110">
            ${isDepot ? '🏢' : '🚏'}
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-stone-900/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none">
            ${stop.nameMr.replace(' बस स्थानक आगार', '').replace(' मध्यवर्ती आगार', '')}
          </div>
        </div>
      `;

      const stopIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: stopHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).addTo(map);
      marker.bindPopup(`
        <div class="p-2 font-sans text-sm">
          <div class="font-bold text-amber-950 text-base flex items-center gap-1.5">
            <span>${stop.type === 'depot' ? '🏢' : '🚏'}</span>
            <span>${stop.nameMr}</span>
          </div>
          <p class="text-xs text-stone-600 mt-1">${stop.landmarkMr}</p>
          <div class="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <span class="text-stone-500">स्थानक कोड: <strong class="text-stone-900">${stop.code}</strong></span>
            <button id="voice-stop-${stop.id}" class="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px] flex items-center gap-1">
              🔊 ऐका
            </button>
          </div>
        </div>
      `);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`voice-stop-${stop.id}`);
        if (btn) {
          btn.onclick = () => {
            busAudio.speak(`हे ${stop.nameMr} आहे. खुण: ${stop.landmarkMr}`);
          };
        }
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update or render live moving bus markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    buses.forEach((bus) => {
      let marker = busMarkersRef.current.get(bus.id);
      const isSelected = bus.id === selectedBusId;

      // Color scheme according to MSRTC category
      const colorBg =
        bus.category === 'lal_pari'
          ? 'bg-red-600 border-amber-300'
          : bus.category === 'shivshahi'
          ? 'bg-emerald-700 border-emerald-200'
          : bus.category === 'hirkani'
          ? 'bg-blue-600 border-white'
          : bus.category === 'manav_vikas'
          ? 'bg-amber-500 border-red-700'
          : 'bg-red-700 border-yellow-300';

      const isDelayed = bus.delayMinutes > 0;

      const busHtml = `
        <div class="relative cursor-pointer transition-transform duration-500 ${isSelected ? 'scale-125 z-50' : 'z-20'}">
          ${
            isDelayed
              ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-red-600 text-[8px] text-white font-bold items-center justify-center">!</span></span>'
              : ''
          }
          <div class="w-10 h-10 rounded-full ${colorBg} border-2 shadow-lg flex flex-col items-center justify-center text-white">
            <span class="text-sm leading-none">🚌</span>
            <span class="text-[8px] font-mono font-bold leading-none mt-0.5 tracking-tighter">MH36</span>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-white font-bold text-[9px] px-1 py-0.2 rounded shadow">
            ${bus.busNumber.replace('MH-36-', '')}
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        className: `bus-marker-${bus.id}`,
        html: busHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      if (!marker) {
        marker = L.marker([bus.currentLat, bus.currentLng], { icon: busIcon }).addTo(map);
        marker.on('click', () => {
          onSelectBus(bus.id);
        });
        busMarkersRef.current.set(bus.id, marker);
      } else {
        marker.setLatLng([bus.currentLat, bus.currentLng]);
        marker.setIcon(busIcon);
      }

      // Popup content with audio button and book button
      const popupHtml = `
        <div class="p-2.5 font-sans min-w-[240px]">
          <div class="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span class="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                bus.category === 'lal_pari'
                  ? 'bg-red-100 text-red-900'
                  : bus.category === 'shivshahi'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-stone-100 text-stone-900'
              }">${bus.categoryNameMr}</span>
              <h4 class="font-bold text-stone-900 text-sm mt-1">${bus.nameMr}</h4>
              <p class="font-mono text-xs text-stone-600 font-semibold">${bus.busNumber}</p>
            </div>
          </div>

          <div class="mt-2 space-y-1.5 text-xs text-stone-700">
            <div class="flex items-center justify-between">
              <span class="text-stone-500">सध्याचा वेग:</span>
              <span class="font-bold text-stone-900">${bus.speedKmH} किमी/तास</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-stone-500">प्लॅटफॉर्म:</span>
              <span class="font-bold text-stone-900">क्रमांक ${bus.platformNo}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-stone-500">स्थिती:</span>
              <span class="font-bold ${isDelayed ? 'text-red-600' : 'text-emerald-700'}">
                ${isDelayed ? `⚠️ ${bus.delayMinutes} मि. उशीर` : '✅ वेळेवर'}
              </span>
            </div>
            ${
              isDelayed
                ? `<div class="p-1.5 bg-red-50 text-red-800 text-[11px] rounded border border-red-200">${bus.delayReasonMr}</div>`
                : ''
            }
            <div class="flex items-center justify-between text-stone-500 pt-1">
              <span>उपलब्ध जागा:</span>
              <span class="font-bold text-stone-900">${bus.availableSeats} / ${bus.totalSeats}</span>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-stone-200 flex gap-1.5">
            <button id="voice-bus-${bus.id}" class="flex-1 py-1.5 px-2 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors">
              <span>🔊</span>
              <span>माहिती ऐका</span>
            </button>
            <button id="book-bus-${bus.id}" class="flex-1 py-1.5 px-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors shadow-sm">
              <span>🎫</span>
              <span>आरक्षण</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const audioBtn = document.getElementById(`voice-bus-${bus.id}`);
        if (audioBtn) {
          audioBtn.onclick = () => {
            busAudio.speak(bus.audioAlertMr);
          };
        }
        const bookBtn = document.getElementById(`book-bus-${bus.id}`);
        if (bookBtn) {
          bookBtn.onclick = () => {
            onBookBus(bus);
          };
        }
      });
    });

    // If selected bus changed, pan to it smoothly
    if (selectedBusId) {
      const selected = buses.find((b) => b.id === selectedBusId);
      if (selected) {
        map.panTo([selected.currentLat, selected.currentLng], { animate: true, duration: 0.8 });
        const marker = busMarkersRef.current.get(selectedBusId);
        if (marker && !marker.isPopupOpen()) {
          marker.openPopup();
        }
      }
    }
  }, [buses, selectedBusId, onSelectBus, onBookBus]);

  const handleCenterBhandara = () => {
    mapInstanceRef.current?.setView([21.1712, 79.6548], 12);
  };

  const handleCenterAll = () => {
    mapInstanceRef.current?.setView([21.1600, 79.7500], 10);
  };

  return (
    <div className="relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden border border-amber-900/10 shadow-lg bg-stone-100">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls & Quick Legend */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-stone-200">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-900">थेट जीपीएस ट्रॅकिंग (Live GPS)</span>
            <span className="text-[11px] text-stone-500 font-mono">Bhandara District</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCenterBhandara}
            className="px-3 py-1.5 bg-white/95 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-lg shadow border border-stone-200 flex items-center gap-1.5 transition-colors"
          >
            <span>🎯</span>
            <span>भंडारा मुख्य आगार</span>
          </button>
          <button
            onClick={handleCenterAll}
            className="px-3 py-1.5 bg-white/95 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-lg shadow border border-stone-200 flex items-center gap-1.5 transition-colors"
          >
            <span>🗺️</span>
            <span>संपूर्ण जिल्हा</span>
          </button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-stone-200 hidden sm:block">
        <div className="text-[11px] font-bold text-stone-700 mb-1.5">बस रंग दर्शक (Bus Types)</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
            <span>लालपरी (साधी)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-700 inline-block" />
            <span>शिवशाही (AC)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span>हिरकणी (निमआराम)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>मानव विकास</span>
          </div>
        </div>
      </div>

      {/* Illiterate Friendly Quick Voice Helper Banner on Map */}
      {easyMode && (
        <div className="absolute top-4 right-4 z-[400] max-w-xs bg-amber-600 text-white p-3 rounded-xl shadow-xl flex items-center gap-3">
          <span className="text-2xl">🔊</span>
          <div className="text-xs">
            <p className="font-bold">नकाशावरील कोणत्याही बसवर दाबा!</p>
            <p className="text-amber-100 text-[11px]">ती कुठे पोहोचली आहे ते ऐका.</p>
          </div>
        </div>
      )}
    </div>
  );
};
