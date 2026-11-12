import React from 'react';
import { Villa } from '../data/villas';
import { formatAzn, filterVillas, VillaFilters } from '../utils/ticker';
import { LocalFiltersBar } from './LocalFiltersBar';
import {
  MapPin,
  Waves,
  ShieldCheck,
  FileCheck,
  Lock,
  Zap,
  Coffee,
  Users,
  Calendar,
} from 'lucide-react';

interface FeaturedVillasProps {
  villas: Villa[];
  activeFilters: VillaFilters;
  onSelectVilla: (villa: Villa) => void;
  onFilterChange: (filters: VillaFilters) => void;
  onOpenVerificationModal: (villaId?: string) => void;
}

export const FeaturedVillas: React.FC<FeaturedVillasProps> = ({
  villas,
  activeFilters,
  onSelectVilla,
  onFilterChange,
  onOpenVerificationModal,
}) => {
  const filtered = filterVillas(villas, activeFilters);

  const regions = [
    { label: 'Bütün Azərbaycan', value: 'Bütün regionlar' },
    { label: 'Qəbələ', value: 'Qəbələ' },
    { label: 'Quba', value: 'Quba' },
    { label: 'Bakı (Abşeron)', value: 'Bakı' },
    { label: 'Naxçıvan', value: 'Naxçıvan' },
    { label: 'Gəncə & Göygöl', value: 'Gəncə' },
    { label: 'İsmayıllı', value: 'İsmayıllı' },
    { label: 'Şəki', value: 'Şəki' },
  ];

  return (
    <section id="villas-grid" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* 
        OVAL ŞƏKİLDƏ ƏHATƏLƏYƏN ÇƏRÇİVƏ (Seçilmiş Villalar Bölməsi)
      */}
      <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] md:rounded-[4rem] border border-white/20 bg-gradient-to-b from-neutral-900/85 via-neutral-950 to-neutral-900/85 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_90px_-20px_rgba(245,158,11,0.2),inset_0_0_30px_rgba(255,255,255,0.03)] ring-1 ring-white/10">
        {/* Daxili ambient parıltı */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-4/5 rounded-[50%] bg-radial from-amber-400/20 via-amber-500/5 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/2 -translate-x-1/2 h-40 w-4/5 rounded-[50%] bg-radial from-amber-400/15 via-amber-500/5 to-transparent blur-2xl" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                Eksklüziv Seçim & Doğrulanmış Mülklər
              </span>
              <button
                type="button"
                onClick={() => onOpenVerificationModal()}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Kupça & Çəkiliş Doğrulaması</span>
              </button>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              Azərbaycanın Bütün Bölgələri Üzrə Bağ Evləri və Villalar
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              {filtered.length} aktiv təklif tapıldı · Dinamik qiymətləndirmə, qapalı əlaqə və 10% Escrow beh zəmanəti
            </p>
          </div>

          {/* Region Filter Buttons in Oval Capsule Container */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-neutral-950/80 rounded-full border border-white/10 backdrop-blur-md">
            {regions.map((reg) => {
              const isActive =
                (reg.value === 'Bütün regionlar' && (!activeFilters.region || activeFilters.region === 'Bütün regionlar')) ||
                activeFilters.region === reg.value;

              return (
                <button
                  key={reg.value}
                  type="button"
                  onClick={() => onFilterChange({ ...activeFilters, region: reg.value })}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* LOCAL ADVANCED FILTERS BAR (Bina.az / Local Standard: İsti hovuz, Manqal/Samovar, Yalnız Ailə, Generator) */}
        <div className="relative z-10 mt-6">
          <LocalFiltersBar
            filters={activeFilters}
            onChange={onFilterChange}
            totalFound={filtered.length}
          />
        </div>

        {/* Grid of Villas with Real Photography & Escrow Features */}
        <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-white/10 bg-neutral-950/60 p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white">Seçilmiş filtrlərə uyğun bağ evi tapılmadı</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Zəhmət olmasa digər bölgələri və ya meyarları yoxlayın.
              </p>
              <button
                type="button"
                onClick={() =>
                  onFilterChange({
                    region: 'Bütün regionlar',
                    type: 'Bütün növlər',
                  })
                }
                className="rounded-full bg-amber-400 px-5 py-2 text-xs font-bold text-neutral-950 hover:brightness-110 cursor-pointer"
              >
                Filtrləri Sıfırla
              </button>
            </div>
          ) : (
            filtered.map((villa) => (
              <div
                key={villa.id}
                onClick={() => onSelectVilla(villa)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/90 transition-all duration-300 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/15 hover:scale-[1.015] cursor-pointer"
              >
                {/* Real Photography Image Thumbnail */}
                <div className="relative h-64 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={villa.imageUrl}
                    alt={villa.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                  {/* Verification & Trust Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                    {villa.verificationStatus === 'in_person_verified' && (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[10px] font-bold text-neutral-950 shadow-md backdrop-blur-md">
                        <ShieldCheck className="h-3 w-3" />
                        <span>🛡️ Yerində Yoxlanılıb</span>
                      </div>
                    )}
                    {villa.verificationStatus === 'document_verified' && (
                      <div className="flex items-center gap-1 rounded-full bg-sky-500/95 px-2.5 py-1 text-[10px] font-bold text-neutral-950 shadow-md backdrop-blur-md">
                        <FileCheck className="h-3 w-3" />
                        <span>📄 Çıxarışlı Mülk</span>
                      </div>
                    )}
                    {villa.badge && (
                      <div className="rounded-full bg-amber-500/95 px-2.5 py-0.5 text-[10px] font-bold text-neutral-950 shadow-md backdrop-blur-md">
                        {villa.badge}
                      </div>
                    )}
                  </div>

                  {/* View Type Badge */}
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                    {villa.viewType}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between space-y-4">
                  <div>
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-amber-400">{villa.region}</span>
                        <span>·</span>
                        <span className="truncate max-w-[150px]">{villa.zone}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-amber-300">
                        <span>★ {villa.rating}</span>
                        <span className="text-neutral-500">({villa.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 text-base font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {villa.title}
                    </h3>

                    {/* Local Highlights: İsti hovuz, Manqal/Samovar, Yalnız Ailə */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {villa.features.istiHovuz && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                          <Waves className="h-3 w-3" />
                          İsti Hovuz
                        </span>
                      )}
                      {villa.features.yalnizAile && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                          <Users className="h-3 w-3" />
                          Yalnız Ailə
                        </span>
                      )}
                      {villa.features.wifiGenerator && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-yellow-950/60 border border-yellow-500/30 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
                          <Zap className="h-3 w-3" />
                          Generatorlu
                        </span>
                      )}
                      {villa.features.manqalSamovar && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                          <Coffee className="h-3 w-3" />
                          Samovar
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center text-xs text-neutral-300">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Həyət</span>
                      <span className="font-bold text-white">{villa.landArea} sot</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Otaq</span>
                      <span className="font-bold text-white">{villa.bedrooms} yataq</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Qonaq</span>
                      <span className="font-bold text-white">{villa.capacity} nəfər</span>
                    </div>
                  </div>

                  {/* Pricing & Escrow Notice */}
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
                            {formatAzn(villa.weekdayPrice || villa.price)}
                          </span>
                          <span className="text-xs text-neutral-400">/{villa.period}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block">
                          Həftəsonu: {formatAzn(villa.weekendPrice || villa.price * 1.25)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          10% Beh Zəmanəti
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {villa.hostContact.maskedPhone}
                        </span>
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 rounded-full border border-white/15 bg-neutral-800/80 py-2.5 text-xs font-bold text-white transition-all group-hover:bg-amber-400 group-hover:text-neutral-950 group-hover:border-amber-400 cursor-pointer"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Təqvimə Bax & 10% Beh Ödə</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
