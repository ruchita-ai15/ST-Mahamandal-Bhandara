/**
 * Localization dictionary for MSRTC Bhandara
 * Supports seamless bilingual toggling between Marathi (मराठी) and English
 */

export type Language = 'mr' | 'en';

export const TRANSLATIONS = {
  mr: {
    appTitle: 'आपली एसटी भंडारा',
    appSubtitle: 'महाराष्ट्र राज्य मार्ग परिवहन महामंडळ · भंडारा विभाग',
    heroTitle: 'भंडारा जिल्हा थेट एसटी बस ट्रॅकर',
    heroDesc: 'वेळेची अनिश्चितता दूर करा. अचूक वेळ, नेमके स्थान, विलंबाच्या थेट ऑडिओ सूचना आणि सुलभ आरक्षण.',
    activeBuses: 'सक्रिय बसेस',
    majorDepots: 'मुख्य आगारे',
    voiceAnnouncements: 'ध्वनी सूचना',
    
    // Navigation
    navMap: 'थेट नकाशा',
    navArrivals: 'आगमन वेळ (Exact Time)',
    navRoutes: 'मार्ग शोध',
    navCommuters: 'दैनंदिन कक्ष',
    navDelays: 'विलंब सूचना',
    easyModeActive: '👁️ सुलभ मोड चालू',
    easyModeToggle: '👁️ सुलभ दृश्य मोड',

    // Voice search
    voiceSearchTitle: 'बोला आणि बस शोधा (Voice Search)',
    voiceSearchListening: 'आम्ही ऐकत आहोत... शहराचे नाव बोला!',
    voiceSearchHint: 'मायक्रोफोनवर टॅप करा आणि "साकोली", "तुमसर" किंवा "पवनी" म्हणा',
    voiceSpokenPrefix: 'तुम्ही बोललात:',
    tapVisualDest: 'किंवा थेट चित्रावर दाबा (Tap visual destination):',
    
    // Arrival Radar
    arrivalRadarTitle: 'बस कधी येणार? (Exact Bus Arrival Radar)',
    arrivalRadarSubtitle: 'थांब्यावर जास्त वेळ थांबू नका! अचूक आगमन मिनिटे, प्लॅटफॉर्म आणि थेट काउंटींग',
    selectStopPrompt: 'आपला थांबा / बस स्थानक निवडा:',
    filterAll: 'सर्व बसेस',
    filterNext15: 'पुढील १५ मिनिटे (Next 15m)',
    filterNext30: 'पुढील ३० मिनिटे (Next 30m)',
    filterStudent: 'शाळा / कॉलेज बसेस (Student Special)',
    arrivingIn: 'येत आहे',
    mins: 'मि.',
    exactEta: 'अचूक आगमन वेळ',
    scheduledTime: 'नियोजित वेळ',
    platform: 'प्लॅटफॉर्म',
    crowd: 'गर्दी',
    seatsAvailable: 'जागा शिल्लक',
    setAlert: '🔔 ५ मिनिटे आधी आठवण करा',
    alertSet: '✓ आठवण सुरू',
    listenEta: '🔊 वेळ ऐका',
    noBusesNow: 'पुढील काही वेळेत या थांब्यावर कोणतीही बस नियोजित नाही.',
    
    // Route Search
    findRoutes: 'मार्ग व वेळापत्रक शोधा (Find Routes)',
    fromStation: 'कुठून निघणार? (Origin)',
    toStation: 'कुठे जायचे आहे? (Destination)',
    speakStation: '🎤 बोला',
    listening: '🎙️ ऐकत आहोत...',
    swapStations: 'दिशा उलटी करा',
    filterBusType: 'एसटी बस प्रकार निवडा:',
    allBuses: 'सर्व बसेस (All)',
    searchBuses: 'उपलब्ध बसेस शोधा',
    voiceSearchBtn: 'आवाजाने शोधा',
    
    // Telemetry / Status
    onTime: 'वेळेवर धावत आहे',
    delayed: 'उशिरा धावत आहे',
    speed: 'वेग',
    nextStop: 'पुढील थांबा',
    conductor: 'वाहक',
    bookSeat: 'तिकीट आरक्षण',
    trackOnMap: 'नकाशावर पहा',
    listenInfo: 'माहिती ऐका',
    
    // Concessions
    concessions: 'सवलत योजना',
    generalFare: 'सर्वसाधारण प्रवासी (पूर्ण भाडे)',
    mahilaSamman: 'महिला सन्मान योजना (५०% सवलत)',
    amritSenior: 'अमृत ज्येष्ठ नागरिक (७५+ वर्षे मोफत)',
    seniorCitizen: 'ज्येष्ठ नागरिक (६५ ते ७४ वर्षे ५०% सवलत)',
    studentPass: 'विद्यार्थी / मासिक पास धारक',
    
    // Footer
    footerNote: 'भंडारा आगार मदत क्रमांक: ०७१८४-२५२१३४ · २४x७ आपत्कालीन सहायता',
  },
  en: {
    appTitle: 'Aapli ST Bhandara',
    appSubtitle: 'MSRTC · Maharashtra State Transport · Bhandara Division',
    heroTitle: 'Bhandara District Real-Time ST Bus Tracker',
    heroDesc: 'Eliminate scheduling uncertainty. Live GPS tracking, exact arrival countdown, delay voice alerts, and easy booking.',
    activeBuses: 'Active Buses',
    majorDepots: 'Major Depots',
    voiceAnnouncements: 'Voice Alerts',
    
    // Navigation
    navMap: 'Live Map',
    navArrivals: 'Arrival Times (Radar)',
    navRoutes: 'Find Routes',
    navCommuters: 'Commuter Hub',
    navDelays: 'Delay Alerts',
    easyModeActive: '👁️ Easy Mode ON',
    easyModeToggle: '👁️ Easy Visual Mode',

    // Voice search
    voiceSearchTitle: 'Speak & Find Buses (Voice Search)',
    voiceSearchListening: 'Listening... Speak station name now!',
    voiceSearchHint: 'Tap mic and say "Sakoli", "Tumsar", "Pauni", or "Lakhani"',
    voiceSpokenPrefix: 'You said:',
    tapVisualDest: 'Or tap pictorial destination:',
    
    // Arrival Radar
    arrivalRadarTitle: 'When is the Bus Coming? (Exact Arrival Radar)',
    arrivalRadarSubtitle: 'Don\'t wait or miss your bus! Exact arrival minutes, platform numbers, and live countdown for daily commuters & students',
    selectStopPrompt: 'Select your bus stop / station:',
    filterAll: 'All Buses',
    filterNext15: 'Next 15 mins',
    filterNext30: 'Next 30 mins',
    filterStudent: 'Student & College Buses',
    arrivingIn: 'Arriving in',
    mins: 'mins',
    exactEta: 'Expected Arrival',
    scheduledTime: 'Scheduled',
    platform: 'Platform',
    crowd: 'Crowd',
    seatsAvailable: 'seats left',
    setAlert: '🔔 Alert me 5 mins before',
    alertSet: '✓ Alert Set',
    listenEta: '🔊 Listen ETA',
    noBusesNow: 'No upcoming buses scheduled for this stop in this time window.',
    
    // Route Search
    findRoutes: 'Find Routes & Timetable',
    fromStation: 'Where from? (Origin)',
    toStation: 'Where to? (Destination)',
    speakStation: '🎤 Speak',
    listening: '🎙️ Listening...',
    swapStations: 'Swap Stations',
    filterBusType: 'Select Bus Category:',
    allBuses: 'All Buses',
    searchBuses: 'Search Available Buses',
    voiceSearchBtn: 'Voice Search',
    
    // Telemetry / Status
    onTime: 'On Time',
    delayed: 'Delayed',
    speed: 'Speed',
    nextStop: 'Next Stop',
    conductor: 'Conductor',
    bookSeat: 'Book Ticket',
    trackOnMap: 'Track on Map',
    listenInfo: 'Listen Info',
    
    // Concessions
    concessions: 'Concession Schemes',
    generalFare: 'General Commuter (Full Fare)',
    mahilaSamman: 'Mahila Samman (50% Off for Women)',
    amritSenior: 'Amrit Senior 75+ (100% Free Travel)',
    seniorCitizen: 'Senior Citizen 65-74 (50% Off)',
    studentPass: 'Student / Monthly Pass Holder',
    
    // Footer
    footerNote: 'Bhandara Depot Helpline: 07184-252134 · 24x7 Emergency Assistance',
  },
};
