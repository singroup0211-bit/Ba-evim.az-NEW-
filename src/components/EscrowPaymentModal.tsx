import React, { useState } from 'react';
import { Villa } from '../data/villas';
import { formatAzn, DynamicPriceBreakdown } from '../utils/ticker';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface EscrowPaymentModalProps {
  isOpen: boolean;
  villa: Villa | null;
  priceBreakdown: DynamicPriceBreakdown | null;
  onClose: () => void;
  onBookingSuccess?: (bookingId: string) => void;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  isOpen,
  villa,
  priceBreakdown,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !villa || !priceBreakdown) return null;

  const [gateway, setGateway] = useState<'epoint' | 'payriff'>('epoint');
  const [step, setStep] = useState<'details' | '3dsecure' | 'success'>('details');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('+994 ');
  const [cardNumber, setCardNumber] = useState('4169 7388 9201 4455');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('890');
  const [otpCode, setOtpCode] = useState('123456');
  const [copied, setCopied] = useState(false);

  const bookingCode = `BG-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('3dsecure');
  };

  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    if (onBookingSuccess) {
      onBookingSuccess(bookingCode);
    }
  };

  const copyContact = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="escrow-modal-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-neutral-900 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-neutral-950 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 id="escrow-modal-title" className="text-sm sm:text-base font-bold text-white">
                bagevim.az Escrow Qapalı Beh Şlüzü
              </h3>
              <p className="text-[11px] text-neutral-400">
                Yerli tərəfdaşlar: Epoint.az & Payriff (ABB Pay) Split Ödəniş
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-white hover:text-black transition-colors cursor-pointer"
            aria-label="Bağla"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {/* STEP 1: PAYMENT DETAILS */}
          {step === 'details' && (
            <form onSubmit={handlePaySubmit} className="space-y-6">
              {/* Villa Mini Summary */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-neutral-950 p-4">
                <img
                  src={villa.imageUrl}
                  alt={villa.title}
                  className="h-16 w-20 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{villa.title}</h4>
                  <p className="text-xs text-neutral-400">
                    {priceBreakdown.totalNights} gecə ({priceBreakdown.checkIn} → {priceBreakdown.checkOut})
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-extrabold text-amber-400">
                      Ümumi: {formatAzn(priceBreakdown.totalPrice)}
                    </span>
                    <span className="text-[10px] text-neutral-500">·</span>
                    <span className="text-xs font-bold text-emerald-400">
                      Beh: {formatAzn(priceBreakdown.escrowDeposit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Escrow Mechanism Explanation */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Lock className="h-4 w-4" />
                  <span>10% Qorunan Beh (Escrow) Necə İşləyir?</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Ödədiyiniz <strong>{formatAzn(priceBreakdown.escrowDeposit)} (10%)</strong> ev sahibinə dərhal verilmir;
                  bagevim.az təhlükəsizlik hesabında bloklanır. Evə çatdıqda mülk təsvirə tam uyğun olarsa, qalan 90%-i ({formatAzn(priceBreakdown.arrivalBalance)}) ev sahibinə ödəyirsiniz. Əgər ev təsvirə uyğun gəlməzsə, beh 100% kartınıza geri qaytarılır.
                </p>
              </div>

              {/* Gateway Selector (Epoint vs Payriff) */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Ödəniş Operatorunu Seçin:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGateway('epoint')}
                    className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      gateway === 'epoint'
                        ? 'border-amber-400 bg-amber-400/10 shadow-md shadow-amber-400/10'
                        : 'border-white/10 bg-neutral-950 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">Epoint.az</span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        Split Ödəniş
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1">
                      Azərbaycanın aparıcı fintech ekvayrinq sistemi
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGateway('payriff')}
                    className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                      gateway === 'payriff'
                        ? 'border-amber-400 bg-amber-400/10 shadow-md shadow-amber-400/10'
                        : 'border-white/10 bg-neutral-950 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white">Payriff</span>
                      <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                        ABB Pay / Apple Pay
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1">
                      İnternet-ekvayrinq və avtomatik refund idarəetməsi
                    </span>
                  </button>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Adınız və Soyadınız
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məs: Rəşad Məmmədov"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Mobil Nömrəniz (SMS bildiriş üçün)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+994 (50) 000-00-00"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Card Form */}
              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-amber-400" />
                    Bank Kartı Məlumatları
                  </span>
                  <span className="text-[10px] text-neutral-500">256-bit SSL Təhlükəsizlik</span>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Kart nömrəsi</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Bitmə tarixi</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-mono text-white focus:border-amber-400 focus:outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-mono text-white focus:border-amber-400 focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {gateway === 'epoint' ? 'Epoint ilə' : 'Payriff ilə'} {formatAzn(priceBreakdown.escrowDeposit)} Beh Ödə
                </span>
              </button>
            </form>
          )}

          {/* STEP 2: 3D SECURE OTP SIMULATION */}
          {step === '3dsecure' && (
            <form onSubmit={handleConfirmOtp} className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Lock className="h-7 w-7" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  3D Secure Təsdiq Kodu ({gateway === 'epoint' ? 'Epoint 3DS' : 'ABB Pay / Payriff'})
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  {userPhone} nömrənizə və bank tətbiqinizə birdəfəlik təhlükəsizlik şifrəsi göndərildi.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full rounded-2xl border-2 border-amber-400 bg-neutral-950 px-4 py-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none"
                  maxLength={6}
                />
                <span className="text-[11px] text-neutral-500 block">
                  Simulyasiya üçün kod artıq daxil edilib: 123456
                </span>
              </div>

              <div className="flex gap-3 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 rounded-full border border-white/10 bg-neutral-800 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
                >
                  Geri Qayıt
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-emerald-500 py-2.5 text-xs font-bold text-neutral-950 hover:brightness-110 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  Kodu Təsdiqlə
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & UNLOCKED CONTACTS */}
          {step === 'success' && (
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-neutral-950 p-6 text-center space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-extrabold text-white">
                  Beh Qəbul Edildi! Əlaqə Məlumatları Açıldı
                </h4>
                <p className="text-xs text-neutral-300">
                  Rəsmi Bron Kodu: <strong className="text-amber-400 font-mono text-sm">{bookingCode}</strong>
                </p>
                <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                  {formatAzn(priceBreakdown.escrowDeposit)} beh məbləği bagevim.az Escrow zəmanəti altındadır
                </span>
              </div>

              {/* UNLOCKED HOST CONTACT CARD */}
              <div className="rounded-2xl border-2 border-amber-400/50 bg-neutral-950 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-neutral-950 font-bold">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-[11px] text-neutral-400 block">Ev Sahibi (Mülkiyyətçi):</span>
                      <h5 className="text-sm font-bold text-white">{villa.hostContact.name}</h5>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    Əlaqə Açıldı
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-center justify-between rounded-xl bg-neutral-900 p-3 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-neutral-950">
                        <Phone className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Birbaşa Telefon Nömrəsi</span>
                        <a
                          href={`tel:${villa.hostContact.phone}`}
                          className="text-sm font-bold text-emerald-400 hover:underline"
                        >
                          {villa.hostContact.phone}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyContact(villa.hostContact.phone)}
                      className="rounded-lg border border-white/10 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:text-white cursor-pointer"
                    >
                      {copied ? 'Kopyalandı' : 'Kopyala'}
                    </button>
                  </div>

                  {/* Full Address */}
                  <div className="flex items-start gap-3 rounded-xl bg-neutral-900 p-3 border border-white/10">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-neutral-950 shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <span className="text-[10px] text-neutral-400 block">Dəqiq Ünvan və Lokasiya</span>
                      <p className="text-xs font-semibold text-white">{villa.hostContact.fullAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={villa.hostContact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp-la Əlaqə</span>
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(villa.hostContact.fullAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-neutral-800 py-3 text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Xəritədə Yol Aç</span>
                  </a>
                </div>
              </div>

              {/* Settlement Reminder */}
              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 text-xs text-neutral-300 space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Ödənilmiş 10% Beh:</span>
                  <span className="font-bold text-emerald-400">{formatAzn(priceBreakdown.escrowDeposit)} (Ödənildi)</span>
                </div>
                <div className="flex justify-between text-white font-semibold">
                  <span>Məkanda ödəniləcək 90% qalıq:</span>
                  <span className="text-amber-400 font-bold">{formatAzn(priceBreakdown.arrivalBalance)}</span>
                </div>
                <p className="text-[11px] text-neutral-500 pt-1">
                  Məkana çatdıqda qapıda təhvil alarkən ev sahibinə nağd və ya kart köçürməsi ilə ödəyirsiniz.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full bg-amber-400 py-3 text-sm font-bold text-neutral-950 hover:brightness-110 cursor-pointer"
              >
                Pəncərəni Bağla
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
