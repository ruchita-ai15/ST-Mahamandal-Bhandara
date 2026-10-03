import React, { useState } from 'react';
import { LiveBus, CONCESSION_SCHEMES, ConcessionScheme } from '../data/bhandaraData';
import { busAudio } from '../utils/audio';

interface BookingTicketModalProps {
  bus: LiveBus | null;
  onClose: () => void;
  easyMode?: boolean;
}

export const BookingTicketModal: React.FC<BookingTicketModalProps> = ({
  bus,
  onClose,
  easyMode = false,
}) => {
  const [selectedSeat, setSelectedSeat] = useState<number>(14);
  const [passengerName, setPassengerName] = useState<string>('प्रवासी');
  const [passengerAge, setPassengerAge] = useState<number>(38);
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [concession, setConcession] = useState<ConcessionScheme>(CONCESSION_SCHEMES[1]); // Default Mahila Samman 50%
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash'>('upi');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>('');

  if (!bus) return null;

  // Base fare calculation
  const basePrice = bus.category === 'shivshahi' ? 85 : 45;
  const discountMultiplier = (100 - concession.discountPercent) / 100;
  const finalPrice = Math.round(basePrice * discountMultiplier);

  // Generate 32 seats with standard MSRTC layout
  const seats = Array.from({ length: 32 }, (_, i) => {
    const seatNo = i + 1;
    const isBookedAlready = [3, 7, 8, 12, 18, 22, 27].includes(seatNo);
    const isWomenReserved = [1, 2, 4, 5, 6].includes(seatNo);
    const isSeniorReserved = [9, 10, 11].includes(seatNo);
    return {
      seatNo,
      isBooked: isBookedAlready,
      isWomenReserved,
      isSeniorReserved,
    };
  });

  const handleConfirmBooking = () => {
    const randomTicketNo = `ST-BND-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(randomTicketNo);
    setIsBooked(true);

    const announcement = `अभिनंदन! आपले ${bus.nameMr} बसचे तिकीट यशस्वीपणे आरक्षित झाले आहे. आसन क्रमांक ${selectedSeat}, तिकीट क्रमांक ${randomTicketNo}. गाडी प्लॅटफॉर्म क्रमांक ${bus.platformNo} वरून सुटेल. शुभ प्रवास!`;
    busAudio.speak(announcement);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Header */}
        <div className="bg-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎫</span>
            <div>
              <h3 className="font-bold text-base sm:text-lg">एसटी महामंडळ तिकीट आरक्षण</h3>
              <p className="text-xs text-red-100">{bus.nameMr} · {bus.busNumber}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-800 hover:bg-red-900 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {!isBooked ? (
          <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Bus Summary Banner */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between text-xs text-stone-800">
              <div>
                <span className="text-stone-500 block">प्रस्थान वेळ:</span>
                <strong className="text-sm text-stone-950 font-mono">{bus.departureTime}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">प्लॅटफॉर्म:</span>
                <strong className="text-sm text-amber-900 font-bold font-mono">क्र. {bus.platformNo}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">मूळ दर:</span>
                <strong className="text-sm text-stone-900 font-mono">₹{basePrice}</strong>
              </div>
            </div>

            {/* Quick 1-Click Concession Selector (Icon-rich for low-literacy) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
                <span>सवलत योजना निवडा (Concession Scheme):</span>
                <span className="text-amber-700 text-[11px]">शासकीय सवलती उपलब्ध</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CONCESSION_SCHEMES.map((scheme) => {
                  const isSelected = concession.id === scheme.id;
                  return (
                    <button
                      key={scheme.id}
                      type="button"
                      onClick={() => {
                        setConcession(scheme);
                        busAudio.speak(`${scheme.nameMr} निवडले. तिकीट दर ₹${Math.round(basePrice * ((100 - scheme.discountPercent) / 100))}`);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-red-600 bg-red-50/70 ring-1 ring-red-500'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-xl mt-0.5">{scheme.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {scheme.nameMr}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {scheme.descriptionMr}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seat Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-800">
                  आसन निवडा (Select Seat): <span className="text-red-600 font-bold">सीट क्र. {selectedSeat}</span>
                </label>
                <div className="flex items-center gap-2 text-[10px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-red-600 rounded" /> निवडलेले
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-stone-200 rounded" /> आरक्षित
                  </span>
                </div>
              </div>

              {/* Bus Layout Frame */}
              <div className="bg-stone-100 p-3 rounded-xl border border-stone-300">
                <div className="flex items-center justify-between text-[11px] text-stone-500 border-b border-stone-200 pb-1.5 mb-2 font-mono">
                  <span>चालक केबिन (Driver) 🚌</span>
                  <span>प्रवेशद्वार (Door)</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {seats.map((seat) => {
                    const isSelected = selectedSeat === seat.seatNo;
                    return (
                      <button
                        key={seat.seatNo}
                        type="button"
                        disabled={seat.isBooked}
                        onClick={() => {
                          setSelectedSeat(seat.seatNo);
                          busAudio.speak(`आसन क्रमांक ${seat.seatNo} निवडले.`);
                        }}
                        className={`h-9 rounded-lg font-mono text-xs font-bold transition-all flex flex-col items-center justify-center ${
                          seat.isBooked
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-400 scale-105'
                            : seat.isWomenReserved
                            ? 'bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300'
                            : seat.isSeniorReserved
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-300'
                        }`}
                      >
                        <span>{seat.seatNo}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Passenger Quick Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">प्रवाशाचे नाव</label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                  placeholder="नाव प्रविष्ट करा"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">लिंग (Gender)</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="female">महिला (Female)</option>
                  <option value="male">पुरुष (Male)</option>
                  <option value="other">इतर</option>
                </select>
              </div>
            </div>

            {/* Payment Option */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">पेमेंट पद्धत निवडा:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMode === 'upi'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                      : 'border-stone-200 bg-white text-stone-700'
                  }`}
                >
                  <span>📲</span>
                  <span>UPI / QR कोड (GPay, PhonePe)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('cash')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    paymentMode === 'cash'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                      : 'border-stone-200 bg-white text-stone-700'
                  }`}
                >
                  <span>💵</span>
                  <span>वाहकाकडे रोख द्या (Cash on Board)</span>
                </button>
              </div>
            </div>

            {/* Price Breakdown Footer */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">एकूण देय रक्कम:</span>
                <span className="text-2xl font-black text-stone-900 font-mono">
                  {finalPrice === 0 ? 'मोफत (₹0)' : `₹${finalPrice}`}
                </span>
                {concession.discountPercent > 0 && (
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    (महाराष्ट्र शासन {concession.discountPercent}% सवलत लागू)
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>आरक्षण निश्चित करा</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        ) : (
          /* Booked Digital E-Ticket View */
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                ✓
              </div>
              <h4 className="text-base font-bold text-emerald-950 mt-2">
                तिकीट यशस्वीपणे आरक्षित झाले!
              </h4>
              <p className="text-xs text-emerald-800">
                आपला एसटी प्रवास सुखकर होवो.
              </p>
            </div>

            {/* MSRTC Digital Boarding Pass Ticket */}
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 bg-amber-50/50 relative overflow-hidden font-sans">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-red-700">
                    महाराष्ट्र राज्य मार्ग परिवहन महामंडळ
                  </span>
                  <h4 className="text-lg font-black text-stone-900">MSRTC BHANDARA E-TICKET</h4>
                  <p className="text-xs font-mono text-stone-600">PNR: {ticketId}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-800">आसन क्र.</span>
                  <div className="text-2xl font-black text-red-700 font-mono">
                    #{selectedSeat}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 text-xs border-b border-stone-200">
                <div>
                  <span className="text-stone-500 block">गाडी नाव:</span>
                  <strong className="text-stone-900 font-bold">{bus.nameMr}</strong>
                  <span className="text-stone-600 block font-mono">{bus.busNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">प्रस्थान वेळ व स्थानक:</span>
                  <strong className="text-stone-900 font-bold">{bus.departureTime}</strong>
                  <span className="text-amber-800 block font-bold">प्लॅटफॉर्म क्र. {bus.platformNo}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">प्रवासी नाव:</span>
                  <strong className="text-stone-900">{passengerName} ({gender === 'female' ? 'स्त्री' : 'पुरुष'})</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">भरलेले भाडे:</span>
                  <strong className="text-base font-black text-stone-900 font-mono">
                    {finalPrice === 0 ? 'मोफत (₹0)' : `₹${finalPrice}`}
                  </strong>
                </div>
              </div>

              {/* QR Code and Conductor Scanner Barcode simulation */}
              <div className="pt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white border border-stone-300 p-1 rounded-lg flex items-center justify-center">
                    {/* SVG QR Code Simulation */}
                    <svg className="w-full h-full text-stone-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm0-4h4v4h-4v-4zM10 10h4v4h-4v-4z" />
                    </svg>
                  </div>
                  <div className="text-[11px] text-stone-600">
                    <p className="font-bold text-stone-900">वाहकासाठी डिजिटल क्यूआर</p>
                    <p>एसटीमध्ये चढताना हा कोड वाहकास दाखवा.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const announcement = `तिकीट माहिती: आसन क्रमांक ${selectedSeat}, बस ${bus.nameMr}, प्रस्थान वेळ ${bus.departureTime}, प्लॅटफॉर्म क्रमांक ${bus.platformNo}.`;
                    busAudio.speak(announcement);
                  }}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <span>🔊</span>
                  <span>तिकीट ऐका</span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🖨️</span>
                <span>तिकीट डाउनलोड / प्रिंट</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
              >
                बंद करा
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
