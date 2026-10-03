/**
 * Bhandara District MSRTC Transport Data
 * Comprehensive network data for Bhandara, Sakoli, Lakhani, Tumsar, Pauni, Mohadi, Lakhandur
 */

export interface BusStop {
  id: string;
  name: string;
  nameMr: string;
  code: string;
  lat: number;
  lng: number;
  type: 'depot' | 'major_stand' | 'rural_stop';
  landmark: string;
  landmarkMr: string;
  iconType: 'bus' | 'temple' | 'bridge' | 'wheat' | 'factory' | 'store' | 'hospital';
  district: string;
  voiceDescMr: string;
}

export interface BusRoute {
  id: string;
  name: string;
  nameMr: string;
  routeCode: string;
  originId: string;
  destinationId: string;
  viaStops: string[]; // stop IDs in order
  distanceKm: number;
  approxDurationMins: number;
  pathCoordinates: [number, number][]; // lat, lng polyline
  baseFare: number;
}

export type BusCategory = 'lal_pari' | 'shivshahi' | 'hirkani' | 'parivartan' | 'manav_vikas';

export interface LiveBus {
  id: string;
  busNumber: string; // e.g. MH-36-F-4128
  name: string;
  nameMr: string;
  category: BusCategory;
  categoryNameMr: string;
  routeId: string;
  originId: string;
  destinationId: string;
  currentLat: number;
  currentLng: number;
  heading: number; // angle in degrees
  speedKmH: number;
  status: 'on_time' | 'delayed' | 'boarding' | 'departed';
  statusTextMr: string;
  delayMinutes: number;
  delayReasonMr: string;
  delayReasonEn: string;
  departureTime: string;
  expectedArrivalTime: string;
  platformNo: number;
  crowdLevel: 'low' | 'medium' | 'high';
  crowdTextMr: string;
  totalSeats: number;
  availableSeats: number;
  conductorNameMr: string;
  conductorPhone: string;
  nextStopId: string;
  nextStopEtaMins: number;
  audioAlertMr: string;
}

export interface DelayNotification {
  id: string;
  busId: string;
  busNumber: string;
  busNameMr: string;
  timestamp: string;
  type: 'delay' | 'arrival' | 'platform_change';
  delayMinutes?: number;
  messageMr: string;
  messageEn: string;
  read: boolean;
  priority: 'high' | 'normal';
}

// ST Bus Depots and Stations in Bhandara District
export const BHANDARA_STOPS: BusStop[] = [
  {
    id: 'bhandara_central',
    name: 'Bhandara Central Bus Stand',
    nameMr: 'भंडारा मध्यवर्ती आगार',
    code: 'BND',
    lat: 21.1712,
    lng: 79.6548,
    type: 'depot',
    landmark: 'Khat Road / Trimurti Chowk',
    landmarkMr: 'खात रोड, त्रिमूर्ती चौक',
    iconType: 'bus',
    district: 'Bhandara',
    voiceDescMr: 'भंडारा मुख्य बस स्थानक, खात रोड',
  },
  {
    id: 'kardha_bridge',
    name: 'Kardha Wainganga Bridge',
    nameMr: 'कार्धा वैनगंगा नदी पूल',
    code: 'KRD',
    lat: 21.1645,
    lng: 79.6210,
    type: 'rural_stop',
    landmark: 'Wainganga River Bridge Toll',
    landmarkMr: 'वैनगंगा नदी मोठा पूल',
    iconType: 'bridge',
    district: 'Bhandara',
    voiceDescMr: 'कार्धा वैनगंगा नदी पूल',
  },
  {
    id: 'shahapur',
    name: 'Shahapur Fata',
    nameMr: 'शहापूर फाटा',
    code: 'SHP',
    lat: 21.1550,
    lng: 79.7320,
    type: 'rural_stop',
    landmark: 'Shahapur Market Junction',
    landmarkMr: 'शहापूर आठवडी बाजार चौक',
    iconType: 'store',
    district: 'Bhandara',
    voiceDescMr: 'शहापूर फाटा',
  },
  {
    id: 'lakhani',
    name: 'Lakhani Bus Stand',
    nameMr: 'लाखनी बस स्थानक',
    code: 'LKH',
    lat: 21.1215,
    lng: 79.8450,
    type: 'major_stand',
    landmark: 'Samarth Nagar / Rice Mill Hub',
    landmarkMr: 'समर्थ नगर, भात गिरणी चौक',
    iconType: 'wheat',
    district: 'Bhandara',
    voiceDescMr: 'लाखनी बस स्थानक, भात गिरणी परिसर',
  },
  {
    id: 'sakoli',
    name: 'Sakoli Bus Stand & Depot',
    nameMr: 'साकोली बस स्थानक आगार',
    code: 'SKL',
    lat: 21.0825,
    lng: 79.9875,
    type: 'depot',
    landmark: 'NH-53 Junction, Sendurwafa',
    landmarkMr: 'राष्ट्रीय महामार्ग ५३, सेंदूरवाफा चौक',
    iconType: 'bus',
    district: 'Bhandara',
    voiceDescMr: 'साकोली आगार, महामार्ग जंक्शन',
  },
  {
    id: 'tumsar',
    name: 'Tumsar Bus Stand & Depot',
    nameMr: 'तुमसर बस स्थानक आगार',
    code: 'TMR',
    lat: 21.3812,
    lng: 79.7420,
    type: 'depot',
    landmark: 'Brass Market / Manganese Depot',
    landmarkMr: 'पितळ नगरी, मॅंगनीज चौक',
    iconType: 'factory',
    district: 'Bhandara',
    voiceDescMr: 'तुमसर आगार, पितळ नगरी',
  },
  {
    id: 'mohadi',
    name: 'Mohadi Bus Stand',
    nameMr: 'मोहाडी बस स्थानक',
    code: 'MHD',
    lat: 21.3160,
    lng: 79.6640,
    type: 'major_stand',
    landmark: 'Handloom Weaver Market',
    landmarkMr: 'हातमाग विणकर चौक',
    iconType: 'store',
    district: 'Bhandara',
    voiceDescMr: 'मोहाडी बस स्थानक, विणकर पेठ',
  },
  {
    id: 'pauni',
    name: 'Pauni Bus Stand & Depot',
    nameMr: 'पवनी बस स्थानक आगार',
    code: 'PWN',
    lat: 20.7915,
    lng: 79.6340,
    type: 'depot',
    landmark: 'Historic Fort & Dakshin Kashi Temples',
    landmarkMr: 'पवनी ऐतिहासिक किल्ला वेस व मंदिर',
    iconType: 'temple',
    district: 'Bhandara',
    voiceDescMr: 'पवनी आगार, किल्ला वेस',
  },
  {
    id: 'lakhandur',
    name: 'Lakhandur Bus Stand',
    nameMr: 'लाखांदूर बस स्थानक',
    code: 'LKD',
    lat: 20.7710,
    lng: 79.9120,
    type: 'major_stand',
    landmark: 'Itiadoh Junction / Main Market',
    landmarkMr: 'इटियाडोह चौक, मुख्य बाजार',
    iconType: 'store',
    district: 'Bhandara',
    voiceDescMr: 'लाखांदूर बस स्थानक',
  },
  {
    id: 'sihora',
    name: 'Sihora Bus Stop',
    nameMr: 'सिहोरा बस थांबा',
    code: 'SIH',
    lat: 21.4920,
    lng: 79.7910,
    type: 'rural_stop',
    landmark: 'Bawanthadi River Link',
    landmarkMr: 'बावनथडी नदी लिंक',
    iconType: 'bridge',
    district: 'Bhandara',
    voiceDescMr: 'सिहोरा बस थांबा',
  },
  {
    id: 'nagpur_ganeshpet',
    name: 'Nagpur Ganeshpet Bus Stand',
    nameMr: 'नागपूर गणेशपेठ मध्यवर्ती स्थानक',
    code: 'NGP',
    lat: 21.1458,
    lng: 79.0882,
    type: 'depot',
    landmark: 'Nagpur City Hub',
    landmarkMr: 'नागपूर मुख्य आगार',
    iconType: 'bus',
    district: 'Nagpur',
    voiceDescMr: 'नागपूर गणेशपेठ बस स्थानक',
  },
];

// Bhandara Road Polylines
export const BHANDARA_ROUTES: BusRoute[] = [
  {
    id: 'bnd_skl',
    name: 'Bhandara - Lakhani - Sakoli (NH-53)',
    nameMr: 'भंडारा - लाखनी - साकोली (राष्ट्रीय महामार्ग ५३)',
    routeCode: 'BND-SKL-01',
    originId: 'bhandara_central',
    destinationId: 'sakoli',
    viaStops: ['bhandara_central', 'shahapur', 'lakhani', 'sakoli'],
    distanceKm: 42,
    approxDurationMins: 55,
    pathCoordinates: [
      [21.1712, 79.6548],
      [21.1660, 79.6850],
      [21.1550, 79.7320], // Shahapur
      [21.1400, 79.7890],
      [21.1215, 79.8450], // Lakhani
      [21.1050, 79.9120],
      [21.0825, 79.9875], // Sakoli
    ],
    baseFare: 45,
  },
  {
    id: 'bnd_tmr',
    name: 'Bhandara - Mohadi - Tumsar',
    nameMr: 'भंडारा - मोहाडी - तुमसर',
    routeCode: 'BND-TMR-02',
    originId: 'bhandara_central',
    destinationId: 'tumsar',
    viaStops: ['bhandara_central', 'mohadi', 'tumsar'],
    distanceKm: 34,
    approxDurationMins: 45,
    pathCoordinates: [
      [21.1712, 79.6548],
      [21.2250, 79.6580],
      [21.3160, 79.6640], // Mohadi
      [21.3450, 79.7020],
      [21.3812, 79.7420], // Tumsar
    ],
    baseFare: 40,
  },
  {
    id: 'bnd_pwn',
    name: 'Bhandara - Kardha - Pauni',
    nameMr: 'भंडारा - कार्धा - पवनी',
    routeCode: 'BND-PWN-03',
    originId: 'bhandara_central',
    destinationId: 'pauni',
    viaStops: ['bhandara_central', 'kardha_bridge', 'pauni'],
    distanceKm: 46,
    approxDurationMins: 60,
    pathCoordinates: [
      [21.1712, 79.6548],
      [21.1645, 79.6210], // Kardha
      [21.0750, 79.6150],
      [20.9500, 79.6220],
      [20.8650, 79.6290],
      [20.7915, 79.6340], // Pauni
    ],
    baseFare: 55,
  },
  {
    id: 'skl_lkd',
    name: 'Sakoli - Lakhandur - Pauni Link',
    nameMr: 'साकोली - लाखांदूर - पवनी लिंक',
    routeCode: 'SKL-LKD-04',
    originId: 'sakoli',
    destinationId: 'lakhandur',
    viaStops: ['sakoli', 'lakhandur'],
    distanceKm: 38,
    approxDurationMins: 50,
    pathCoordinates: [
      [21.0825, 79.9875],
      [20.9850, 79.9650],
      [20.8920, 79.9380],
      [20.7710, 79.9120], // Lakhandur
    ],
    baseFare: 42,
  },
  {
    id: 'bnd_ngp',
    name: 'Bhandara - Nagpur Ganeshpet Express',
    nameMr: 'भंडारा - नागपूर गणेशपेठ जलद एक्सप्रेस',
    routeCode: 'BND-NGP-05',
    originId: 'bhandara_central',
    destinationId: 'nagpur_ganeshpet',
    viaStops: ['bhandara_central', 'kardha_bridge', 'nagpur_ganeshpet'],
    distanceKm: 62,
    approxDurationMins: 75,
    pathCoordinates: [
      [21.1712, 79.6548],
      [21.1645, 79.6210],
      [21.1620, 79.5200],
      [21.1590, 79.3800],
      [21.1550, 79.2300],
      [21.1458, 79.0882],
    ],
    baseFare: 80,
  },
];

// Live Simulated Bus Fleet in Bhandara District
export const INITIAL_LIVE_BUSES: LiveBus[] = [
  {
    id: 'bus-1',
    busNumber: 'MH-36-F-4128',
    name: 'Bhandara - Sakoli Lal Pari',
    nameMr: 'भंडारा - साकोली लालपरी',
    category: 'lal_pari',
    categoryNameMr: 'लालपरी (साधी)',
    routeId: 'bnd_skl',
    originId: 'bhandara_central',
    destinationId: 'sakoli',
    currentLat: 21.1350,
    currentLng: 79.8050, // Between Shahapur and Lakhani
    heading: 110,
    speedKmH: 46,
    status: 'delayed',
    statusTextMr: '१२ मिनिटे उशिरा',
    delayMinutes: 12,
    delayReasonMr: 'शहापूर आठवडी बाजारात जड वाहतूक कोंडीमुळे',
    delayReasonEn: 'Heavy traffic near Shahapur weekly market',
    departureTime: '09:15 AM',
    expectedArrivalTime: '10:22 AM',
    platformNo: 3,
    crowdLevel: 'medium',
    crowdTextMr: 'मध्यम गर्दी (१६ जागा रिकाम्या)',
    totalSeats: 48,
    availableSeats: 16,
    conductorNameMr: 'संजय मेश्राम',
    conductorPhone: '९८२३XXXXXX',
    nextStopId: 'lakhani',
    nextStopEtaMins: 8,
    audioAlertMr: 'लक्ष द्या! भंडारा-साकोली लालपरी बस MH ३६ F ४१२८ ही शहापूर बाजारातील गर्दीमुळे १२ मिनिटे उशिराने धावत असून, ८ मिनिटांत लाखनी बस स्थानकावर पोहोचत आहे.',
  },
  {
    id: 'bus-2',
    busNumber: 'MH-36-F-3290',
    name: 'Bhandara - Tumsar Express',
    nameMr: 'भंडारा - तुमसर जलद बस',
    category: 'parivartan',
    categoryNameMr: 'परिवर्तन एसटी',
    routeId: 'bnd_tmr',
    originId: 'bhandara_central',
    destinationId: 'tumsar',
    currentLat: 21.2850,
    currentLng: 79.6620, // Near Mohadi
    heading: 10,
    speedKmH: 52,
    status: 'on_time',
    statusTextMr: 'वेळेवर धावत आहे',
    delayMinutes: 0,
    delayReasonMr: 'रस्ता सुरळीत सुरू आहे',
    delayReasonEn: 'Clear road conditions',
    departureTime: '09:30 AM',
    expectedArrivalTime: '10:15 AM',
    platformNo: 1,
    crowdLevel: 'low',
    crowdTextMr: 'कमी गर्दी (२८ जागा रिकाम्या)',
    totalSeats: 48,
    availableSeats: 28,
    conductorNameMr: 'अमोल खोब्रागडे',
    conductorPhone: '९९७०XXXXXX',
    nextStopId: 'mohadi',
    nextStopEtaMins: 5,
    audioAlertMr: 'भंडारा ते तुमसर परिवर्तन बस MH ३६ F ३२९० अगदी वेळेवर धावत असून, ५ मिनिटांत मोहाडी स्थानकावर येत आहे.',
  },
  {
    id: 'bus-3',
    busNumber: 'MH-36-G-5011',
    name: 'Nagpur - Bhandara - Sakoli Shivshahi AC',
    nameMr: 'नागपूर - भंडारा - साकोली शिवशाही वातानुकूलित',
    category: 'shivshahi',
    categoryNameMr: 'शिवशाही AC',
    routeId: 'bnd_skl',
    originId: 'bhandara_central',
    destinationId: 'sakoli',
    currentLat: 21.1712,
    currentLng: 79.6548, // At Bhandara Depot platform
    heading: 90,
    speedKmH: 0,
    status: 'boarding',
    statusTextMr: 'स्थानकावर प्रवासी चढत आहेत',
    delayMinutes: 0,
    delayReasonMr: 'नियोजित वेळेनुसार सुटत आहे',
    delayReasonEn: 'Departing on schedule',
    departureTime: '10:00 AM',
    expectedArrivalTime: '10:55 AM',
    platformNo: 4,
    crowdLevel: 'low',
    crowdTextMr: 'बैठक व्यवस्था उपलब्ध (२२ जागा)',
    totalSeats: 45,
    availableSeats: 22,
    conductorNameMr: 'प्रशांत वंजारी',
    conductorPhone: '९४२२XXXXXX',
    nextStopId: 'shahapur',
    nextStopEtaMins: 15,
    audioAlertMr: 'लक्ष द्या प्रवासी बंधू-भगिनींनो! भंडारा ते साकोली शिवशाही वातानुकूलित बस क्रमांक MH ३६ G ५०११ प्लॅटफॉर्म क्रमांक ४ वर लागलेली आहे. १० वाजता प्रस्थान करेल.',
  },
  {
    id: 'bus-4',
    busNumber: 'MH-36-F-2184',
    name: 'Bhandara - Pauni Lal Pari',
    nameMr: 'भंडारा - पवनी लालपरी (किल्ला मार्ग)',
    category: 'lal_pari',
    categoryNameMr: 'लालपरी (साधी)',
    routeId: 'bnd_pwn',
    originId: 'bhandara_central',
    destinationId: 'pauni',
    currentLat: 21.0450,
    currentLng: 79.6180, // South of Kardha
    heading: 185,
    speedKmH: 42,
    status: 'delayed',
    statusTextMr: '१५ मिनिटे उशिरा',
    delayMinutes: 15,
    delayReasonMr: 'कार्धा वैनगंगा पुलावर रस्ता दुरुस्ती काम सुरू असल्याने',
    delayReasonEn: 'Wainganga bridge road maintenance delay',
    departureTime: '08:45 AM',
    expectedArrivalTime: '10:00 AM',
    platformNo: 2,
    crowdLevel: 'high',
    crowdTextMr: 'पूर्ण भरलेली (फक्त ४ जागा)',
    totalSeats: 48,
    availableSeats: 4,
    conductorNameMr: 'दिनेश वाघमारे',
    conductorPhone: '९८२२XXXXXX',
    nextStopId: 'pauni',
    nextStopEtaMins: 20,
    audioAlertMr: 'सूचना! भंडारा ते पवनी लालपरी बस कार्धा वैनगंगा पुलावरील कामामुळे १५ मिनिटे उशिराने धावत आहे.',
  },
  {
    id: 'bus-5',
    busNumber: 'MH-36-F-1845',
    name: 'Manav Vikas Rural Special (Sakoli - Lakhandur)',
    nameMr: 'मानव विकास ग्रामीण विशेष (साकोली - लाखांदूर)',
    category: 'manav_vikas',
    categoryNameMr: 'मानव विकास विशेष',
    routeId: 'skl_lkd',
    originId: 'sakoli',
    destinationId: 'lakhandur',
    currentLat: 20.9320,
    currentLng: 79.9520, // Midway to Lakhandur
    heading: 195,
    speedKmH: 40,
    status: 'on_time',
    statusTextMr: 'वेळेवर धावत आहे',
    delayMinutes: 0,
    delayReasonMr: 'शाळा व महाविद्यालयांच्या वेळेनुसार वेळेवर',
    delayReasonEn: 'Running on schedule for students and commuters',
    departureTime: '09:00 AM',
    expectedArrivalTime: '09:50 AM',
    platformNo: 1,
    crowdLevel: 'high',
    crowdTextMr: 'विद्यार्थी व प्रवासी गर्दी (६ जागा)',
    totalSeats: 52,
    availableSeats: 6,
    conductorNameMr: 'सुनील बावनकुळे',
    conductorPhone: '९८५०XXXXXX',
    nextStopId: 'lakhandur',
    nextStopEtaMins: 12,
    audioAlertMr: 'साकोली ते लाखांदूर मानव विकास बस वेळेवर धावत असून १२ मिनिटांत लाखांदूर पोहोचत आहे. शालेय विद्यार्थिनी व प्रवाशांनी तयारी ठेवावी.',
  },
  {
    id: 'bus-6',
    busNumber: 'MH-36-F-6672',
    name: 'Tumsar - Mohadi - Bhandara Return',
    nameMr: 'तुमसर - मोहाडी - भंडारा परतीची फेरी',
    category: 'hirkani',
    categoryNameMr: 'हिरकणी (निमआराम)',
    routeId: 'bnd_tmr',
    originId: 'tumsar',
    destinationId: 'bhandara_central',
    currentLat: 21.3320,
    currentLng: 79.6750, // Between Tumsar and Mohadi heading south
    heading: 200,
    speedKmH: 48,
    status: 'on_time',
    statusTextMr: 'वेळेवर धावत आहे',
    delayMinutes: 0,
    delayReasonMr: 'रस्ता सुरळीत',
    delayReasonEn: 'On time',
    departureTime: '09:40 AM',
    expectedArrivalTime: '10:25 AM',
    platformNo: 2,
    crowdLevel: 'medium',
    crowdTextMr: 'मध्यम गर्दी (१८ जागा)',
    totalSeats: 45,
    availableSeats: 18,
    conductorNameMr: 'विकास नागपुरे',
    conductorPhone: '९४०३XXXXXX',
    nextStopId: 'mohadi',
    nextStopEtaMins: 7,
    audioAlertMr: 'तुमसर ते भंडारा हिरकणी बस ७ मिनिटांत मोहाडी स्थानकावर येत आहे.',
  },
];

// Initial Real-time Push Delay Notifications for Bhandara
export const INITIAL_NOTIFICATIONS: DelayNotification[] = [
  {
    id: 'notif-1',
    busId: 'bus-1',
    busNumber: 'MH-36-F-4128',
    busNameMr: 'भंडारा - साकोली लालपरी',
    timestamp: '१० मिनिटांपूर्वी',
    type: 'delay',
    delayMinutes: 12,
    messageMr: 'बस MH-36-F-4128 शहापूर बाजारातील वाहतूक कोंडीमुळे १२ मिनिटे उशिराने धावत आहे. पुढील थांबा लाखनी.',
    messageEn: 'Bus MH-36-F-4128 delayed by 12 mins due to Shahapur market congestion.',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif-2',
    busId: 'bus-4',
    busNumber: 'MH-36-F-2184',
    busNameMr: 'भंडारा - पवनी लालपरी',
    timestamp: '२० मिनिटांपूर्वी',
    type: 'delay',
    delayMinutes: 15,
    messageMr: 'कार्धा वैनगंगा पुलावर दुरुस्ती कामामुळे १५ मिनिटे विलंब. प्रवासी कृपया नोंद घ्यावी.',
    messageEn: 'Wainganga Bridge road repair causing 15 min delay on Pauni route.',
    read: false,
    priority: 'high',
  },
  {
    id: 'notif-3',
    busId: 'bus-3',
    busNumber: 'MH-36-G-5011',
    busNameMr: 'भंडारा - साकोली शिवशाही',
    timestamp: 'आत्ताच',
    type: 'arrival',
    messageMr: 'शिवशाही बस MH-36-G-5011 भंडारा आगार प्लॅटफॉर्म क्रमांक ४ वर लागली आहे.',
    messageEn: 'Shivshahi AC bus docked at Bhandara Platform 4 for boarding.',
    read: true,
    priority: 'normal',
  },
];

// Concession schemes available on MSRTC
export interface ConcessionScheme {
  id: string;
  nameMr: string;
  nameEn: string;
  discountPercent: number;
  descriptionMr: string;
  icon: string;
}

export const CONCESSION_SCHEMES: ConcessionScheme[] = [
  {
    id: 'general',
    nameMr: 'सर्वसाधारण प्रवासी (पूर्ण भाडे)',
    nameEn: 'Regular General Commuter',
    discountPercent: 0,
    descriptionMr: 'नियमित संपूर्ण तिकीट दर',
    icon: '👤',
  },
  {
    id: 'mahila_samman',
    nameMr: 'महिला सन्मान योजना (५०% सवलत)',
    nameEn: 'Mahila Samman (50% Off)',
    discountPercent: 50,
    descriptionMr: 'महाराष्ट्र शासन ५०% महिला तिकीट सवलत योजना',
    icon: '👩',
  },
  {
    id: 'amrit_jyeshtha',
    nameMr: 'अमृत ज्येष्ठ नागरिक (७५+ वर्षे मोफत)',
    nameEn: 'Amrit Senior 75+ (100% Free)',
    discountPercent: 100,
    descriptionMr: '७५ वर्षांवरील ज्येष्ठांना १००% मोफत एसटी प्रवास',
    icon: '🧓',
  },
  {
    id: 'senior_65',
    nameMr: 'ज्येष्ठ नागरिक (६५ ते ७४ वर्षे ५०% सवलत)',
    nameEn: 'Senior Citizen 65-74 (50% Off)',
    discountPercent: 50,
    descriptionMr: '६५ ते ७४ वयोगटासाठी ५०% एसटी प्रवास सवलत',
    icon: '👴',
  },
  {
    id: 'student_pass',
    nameMr: 'विद्यार्थी / मासिक पास धारक',
    nameEn: 'Student / Commuter Pass',
    discountPercent: 66,
    descriptionMr: 'शालेय व महाविद्यालयीन पास धारक ६६% सवलत',
    icon: '🎓',
  },
];

// Quick frequent commuter routes for Bhandara district daily travelers
export const FREQUENT_BHANDARA_ROUTES = [
  {
    fromId: 'bhandara_central',
    toId: 'sakoli',
    titleMr: 'भंडारा ⇄ साकोली',
    titleEn: 'Bhandara to Sakoli',
    duration: '५५ मिनिटे',
    distance: '४२ किमी',
    frequency: 'दर १५ मिनिटांनी',
    fare: '₹४५',
    icon: '🛣️',
  },
  {
    fromId: 'bhandara_central',
    toId: 'tumsar',
    titleMr: 'भंडारा ⇄ तुमसर',
    titleEn: 'Bhandara to Tumsar',
    duration: '४५ मिनिटे',
    distance: '३४ किमी',
    frequency: 'दर २० मिनिटांनी',
    fare: '₹४०',
    icon: '🏭',
  },
  {
    fromId: 'lakhani',
    toId: 'bhandara_central',
    titleMr: 'लाखनी ⇄ भंडारा',
    titleEn: 'Lakhani to Bhandara',
    duration: '३० मिनिटे',
    distance: '२२ किमी',
    frequency: 'दर १० मिनिटांनी',
    fare: '₹२५',
    icon: '🌾',
  },
  {
    fromId: 'bhandara_central',
    toId: 'pauni',
    titleMr: 'भंडारा ⇄ पवनी',
    titleEn: 'Bhandara to Pauni',
    duration: '६० मिनिटे',
    distance: '४६ किमी',
    frequency: 'दर ३० मिनिटांनी',
    fare: '₹५५',
    icon: '🏛️',
  },
  {
    fromId: 'bhandara_central',
    toId: 'nagpur_ganeshpet',
    titleMr: 'भंडारा ⇄ नागपूर',
    titleEn: 'Bhandara to Nagpur',
    duration: '७५ मिनिटे',
    distance: '६२ किमी',
    frequency: 'दर १० मिनिटांनी',
    fare: '₹८०',
    icon: '⚡',
  },
];
