import React, { useState } from 'react';
import { Villa } from '../data/villas';
import { formatAzn, calculateDynamicPrice } from '../utils/ticker';
import { DynamicCalendarPicker } from './DynamicCalendarPicker';
import {
  X,
  MapPin,
  Waves,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Lock,
  FileCheck,
  Zap,
  Coffee,
  Users,
  Calendar,
  Bot,
} from 'lucide-react';

interface VillaModalProps {
  villa: Villa | null;
  onClose: () => void;
  onOpenEscrow: (villa: Villa, breakdown: ReturnType<typeof calculateDynamicPrice>) => void;
  onOpenBotSimulator: (villa: Villa) => void;
  onOpenHostCalendar: (villa: Villa) => void;
  onOpenVerification: (villaId: string) => void;
}

export const VillaModal: React.FC<VillaModalProps> = ({
  villa,
  onClose,
  onOpenEscrow,
  onOpenBotSimulator,
  onOpenHostCalendar,
  onOpenVerification,
}) => {
  if (!villa) return null;

  const [activeTourAngle, setActiveTourAngle] = useState<'pool' | 'front' | 'interior'>('pool');
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar'>('overview');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-villa-title"
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-neutral-900 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-white hover:text-black transition-colors cursor-pointer"
          aria-label="Pəncərəni bağla"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media / Real Photography Viewport */}
        <div className="relative h-[280px] sm:h-[380px] w-full overflow-hidden bg-neutral-950">
          <img
            src={villa.imageUrl}
            alt={villa.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80';
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/50" />

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {villa.verificationStatus === 'in_person_verified' && (
              <div
                onClick={() => onOpenVerification(villa.id)}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500/95 px-3.5 py-1 text-xs font-bold text-neutral-950 shadow-lg backdrop-blur-md cursor-pointer hover:brightness-110"
                title="Komandamız tərəfindən yerində çəkiliş və yoxlama aparılıb"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>🛡️ Yerində Yoxlanılıb</span>
              </div>
            )}
            {villa.verificationStatus === 'document_verified' && (
              <div
                onClick={() => onOpenVerification(villa.id)}
                className="flex items-center gap-1.5 rounded-full bg-sky-500/95 px-3.5 py-1 text-xs font-bold text-neutral-950 shadow-lg backdrop-blur-md cursor-pointer hover:brightness-110"
                title="Kupça və mülkiyyətçi sənədləri notariat bazasından təsdiqlənib"
              >
                <FileCheck className="h-4 w-4" />
                <span>📄 Çıxarışlı Mülk (Kupçalı)</span>
              </div>
            )}
          </div>

          {/* Tour View Selector */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-neutral-950/80 p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTourAngle('pool')}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTourAngle === 'pool' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Hovuz & Terras
              </button>
              <button
                type="button"
                onClick={() => setActiveTourAngle('front')}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTourAngle === 'front' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Fasad & Ərazi
              </button>
              <button
                type="button"
                onClick={() => setActiveTourAngle('interior')}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTourAngle === 'interior' ? 'bg-amber-400 text-neutral-950' : 'text-neutral-300 hover:text-white'
                }`}
              >
                İnteryer & Zal
              </button>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-neutral-950/80 px-3.5 py-1.5 text-xs text-amber-300 backdrop-blur-md">
              <Compass className="h-3.5 w-3.5" />
              <span>{villa.viewType}</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs: Overview vs Interactive Calendar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 sm:px-8 py-3 bg-neutral-950/40">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Mülk Haqqında
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>İnteraktiv Təqvim & 10% Beh</span>
            </button>
          </div>

          {/* Quick Host Shortcuts */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenBotSimulator(villa)}
              className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>WhatsApp/Telegram Botu</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenHostCalendar(villa)}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-neutral-800 px-3 py-1.5 text-[11px] font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Ev Sahibi Təqvimi</span>
            </button>
          </div>
        </div>

        {/* Modal Details Body */}
        <div className="max-h-[55vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          {activeTab === 'overview' ? (
            <>
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="font-bold text-amber-400">{villa.region}</span>
                    <span>·</span>
                    <span>{villa.zone}</span>
                    <span>·</span>
                    <span>Reytinq: {villa.rating} ({villa.reviewsCount} rəy)</span>
                  </div>
                  <h2 id="modal-villa-title" className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {villa.title}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    {villa.location}
                  </p>
                </div>

                {/* Dynamic Rates Pill */}
                <div className="flex flex-col items-baseline sm:items-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                      {formatAzn(villa.weekdayPrice || villa.price)}
                    </span>
                    <span className="text-xs text-neutral-400">/gecə (həftəiçi)</span>
                  </div>
                  <span className="text-[11px] text-amber-300/80">
                    Həftəsonu: {formatAzn(villa.weekendPrice || villa.price * 1.25)} · Bayram: {formatAzn(villa.holidayPrice || villa.price * 1.45)}
                  </span>
                </div>
              </div>

              {/* LOCAL MARKET SPECIAL CRITERIA HIGHLIGHTS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {villa.features.istiHovuz && (
                  <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-2.5 text-xs text-cyan-200">
                    <Waves className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>İsidilən İsti Hovuz</span>
                  </div>
                )}
                {villa.features.yalnizAile && (
                  <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-xs text-emerald-200">
                    <Users className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Yalnız Ailə üçün</span>
                  </div>
                )}
                {villa.features.wifiGenerator && (
                  <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-950/20 p-2.5 text-xs text-yellow-200">
                    <Zap className="h-4 w-4 text-yellow-400 shrink-0" />
                    <span>24/7 Generatorlu</span>
                  </div>
                )}
                {villa.features.manqalSamovar && (
                  <div className="flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-2.5 text-xs text-amber-200">
                    <Coffee className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Manqal & Samovar</span>
                  </div>
                )}
              </div>

              {/* Specifications Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-white/10 bg-neutral-950/60 p-4 text-center">
                <div>
                  <span className="text-xs text-neutral-400 block">Həyət sahəsi</span>
                  <span className="text-base font-bold text-white mt-0.5 block">{villa.landArea} sot</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Ev sahəsi</span>
                  <span className="text-base font-bold text-white mt-0.5 block">{villa.houseArea} kv.m</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Otaqlar</span>
                  <span className="text-base font-bold text-white mt-0.5 block">{villa.bedrooms} yataq / {villa.bathrooms} s/q</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block">Qonaq tutumu</span>
                  <span className="text-base font-bold text-white mt-0.5 block">{villa.capacity} nəfər</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Təsvir</h4>
                <p className="mt-2 text-sm text-neutral-300 leading-relaxed">{villa.description}</p>
              </div>

              {/* Features & Amenities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Xüsusiyyətlər və Komfort</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {villa.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-800/80 px-3.5 py-1.5 text-xs text-neutral-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {tag}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-800/80 px-3.5 py-1.5 text-xs text-neutral-200">
                    <Waves className="h-3.5 w-3.5 text-cyan-400" />
                    {villa.poolType}
                  </span>
                </div>
              </div>

              {/* QAPALI ƏLAQƏ VƏ ESCROW QAYDASI */}
              <div className="rounded-2xl border-2 border-amber-400/30 bg-neutral-950 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-neutral-950">
                      <Lock className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        Qapalı Əlaqə və Zəmanətli Onlayn Beh (Escrow)
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Dələduzluqdan qorunma məqsədilə ev sahibinin birbaşa nömrəsi qapalıdır
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                    10% Beh Tələb Olunur
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-neutral-900 p-3 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Ev Sahibinin Nömrəsi:</span>
                      <span className="font-mono font-bold text-neutral-300 tracking-wider">
                        {villa.hostContact.maskedPhone}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-semibold">Qapalıdır 🔒</span>
                  </div>

                  <div className="rounded-xl bg-neutral-900 p-3 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Dəqiq Ünvan və Lokasiya:</span>
                      <span className="font-semibold text-neutral-300 truncate max-w-[170px] block">
                        {villa.zone} (Tam ünvan gizlidir)
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-semibold">Qapalıdır 🔒</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400">
                  ⚡ Yalnız ümumi məbləğin <strong>10%-i (zəmanətli beh)</strong> Epoint və ya Payriff üzərindən ödənildikdən sonra ev sahibinin mobil nömrəsi, birbaşa WhatsApp keçidi və dəqiq lokasyonu açılır.
                </p>

                {/* CTA to open calendar and pay escrow */}
                <button
                  type="button"
                  onClick={() => setActiveTab('calendar')}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-xs sm:text-sm font-bold text-neutral-950 shadow-md shadow-amber-500/20 hover:brightness-110 cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Tarixləri Seç və 10% Beh ilə Əlaqəni Aç</span>
                </button>
              </div>
            </>
          ) : (
            /* INTERACTIVE CALENDAR TAB */
            <DynamicCalendarPicker
              villa={villa}
              onProceedToEscrow={(_checkIn, _checkOut, breakdown) => {
                onOpenEscrow(villa, breakdown);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
