import React from 'react';
import { VillaFilters } from '../utils/ticker';
import { VillaCategory } from '../data/villas';
import {
  Search,
  Flame,
  Coffee,
  Users,
  Waves,
  Zap,
  ShieldCheck,
  X,
  SlidersHorizontal,
  Home,
  Mountain,
  Building,
} from 'lucide-react';

interface LocalFiltersBarProps {
  filters: VillaFilters;
  onChange: (filters: VillaFilters) => void;
  totalFound: number;
}

export const LocalFiltersBar: React.FC<LocalFiltersBarProps> = ({
  filters,
  onChange,
  totalFound,
}) => {
  const toggleTag = (key: keyof VillaFilters) => {
    onChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const handleCategory = (cat: VillaCategory | 'all') => {
    onChange({
      ...filters,
      category: cat,
    });
  };

  const clearAllFilters = () => {
    onChange({
      region: 'Bütün regionlar',
      type: 'Bütün növlər',
      category: 'all',
      searchQuery: '',
      minBedrooms: 0,
      istiHovuz: false,
      manqalSamovar: false,
      yalnizAile: false,
      denizYaxin: false,
      wifiGenerator: false,
      kombiKondisioner: false,
      kamin: false,
      verifiedOnly: false,
    });
  };

  const activeFilterCount = [
    filters.category && filters.category !== 'all',
    filters.searchQuery && filters.searchQuery.trim().length > 0,
    filters.minBedrooms && filters.minBedrooms > 0,
    filters.istiHovuz,
    filters.manqalSamovar,
    filters.yalnizAile,
    filters.denizYaxin,
    filters.wifiGenerator,
    filters.kombiKondisioner,
    filters.kamin,
    filters.verifiedOnly,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Category Tabs Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-neutral-950/80 border border-white/10 backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleCategory('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              !filters.category || filters.category === 'all'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Bütün Mülklər</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategory('dag_kotteci')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filters.category === 'dag_kotteci'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Mountain className="h-3.5 w-3.5" />
            <span>Qəbələ & Dağ Kottecləri</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategory('denizkenari')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filters.category === 'denizkenari'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Waves className="h-3.5 w-3.5" />
            <span>Abşeron Dənizkənarı</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategory('seher_menzil')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filters.category === 'seher_menzil'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Şəhərdaxili Mənzillər</span>
          </button>
        </div>

        {/* Bedroom count quick dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Otaq sayı:</span>
          <select
            value={filters.minBedrooms || 0}
            onChange={(e) => onChange({ ...filters, minBedrooms: Number(e.target.value) })}
            className="rounded-xl border border-white/10 bg-neutral-950 px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
          >
            <option value={0}>Hamısı</option>
            <option value={3}>3+ yataq otağı</option>
            <option value={4}>4+ yataq otağı</option>
            <option value={5}>5+ VIP otaq</option>
          </select>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Yerli bazar axtarışı: Məs: 'Mərdəkan isti hovuz', 'Tufandağ kamin', 'Quba çay kənarı'..."
          value={filters.searchQuery || ''}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          className="w-full rounded-2xl border border-white/15 bg-neutral-950/90 pl-11 pr-24 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 backdrop-blur-md"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, searchQuery: '' })}
              className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-block rounded-lg bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-neutral-300">
            {totalFound} villa
          </span>
        </div>
      </div>

      {/* Local Market Popular Tags (Bina.az / Local Standard) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="h-3 w-3 text-amber-400" />
          Meyarlar:
        </span>

        {/* 1. İsti Hovuz */}
        <button
          type="button"
          onClick={() => toggleTag('istiHovuz')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
            filters.istiHovuz
              ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-md shadow-cyan-500/10'
              : 'border-white/10 bg-neutral-900 text-neutral-300 hover:border-white/20'
          }`}
        >
          <Waves className="h-3.5 w-3.5 text-cyan-400" />
          <span>İsti Hovuz</span>
        </button>

        {/* 2. Manqal & Samovar */}
        <button
          type="button"
          onClick={() => toggleTag('manqalSamovar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
            filters.manqalSamovar
              ? 'border-amber-400 bg-amber-950/80 text-amber-300 shadow-md shadow-amber-500/10'
              : 'border-white/10 bg-neutral-900 text-neutral-300 hover:border-white/20'
          }`}
        >
          <Coffee className="h-3.5 w-3.5 text-amber-400" />
          <span>Manqal & Samovar</span>
        </button>

        {/* 3. Yalnız Ailə üçün (Subaylara verilmir) */}
        <button
          type="button"
          onClick={() => toggleTag('yalnizAile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
            filters.yalnizAile
              ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-md shadow-emerald-500/10'
              : 'border-white/10 bg-neutral-900 text-neutral-300 hover:border-white/20'
          }`}
        >
          <Users className="h-3.5 w-3.5 text-emerald-400" />
          <span>Yalnız Ailəyə (Subaylara verilmir)</span>
        </button>

        {/* 4. Dənizə yaxın */}
        <button
          type="button"
          onClick={() => toggleTag('denizYaxin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
            filters.denizYaxin
              ? 'border-sky-400 bg-sky-950/80 text-sky-300'
              : 'border-white/10 bg-neutral-900 text-neutral-300 hover:border-white/20'
          }`}
        >
          <Waves className="h-3.5 w-3.5 text-sky-400" />
          <span>Dənizə Yaxın</span>
        </button>

        {/* 5. Generatorlu (İşıq sönməz) */}
        <button
          type="button"
          onClick={() => toggleTag('wifiGenerator')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
            filters.wifiGenerator
              ? 'border-yellow-400 bg-yellow-950/80 text-yellow-300'
              : 'border-white/10 bg-neutral-900 text-neutral-300 hover:border-white/20'
          }`}
        >
          <Zap className="h-3.5 w-3.5 text-yellow-400" />
          <span>Generatorlu (İşıq Kəsilməz)</span>
        </button>

        {/* 6. Odun Kaminli */}
        <button
          type="button"
          onClick={() => toggleTag('kamin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
            filters.kamin
              ? 'border-orange-400 bg-orange-950/80 text-orange-300'
              : 'border-white/10 bg-neutral-900 text-neutral-300 hover:border-white/20'
          }`}
        >
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          <span>Təbii Kamin</span>
        </button>

        {/* 7. Yoxlanılmış Evlər (Verified) */}
        <button
          type="button"
          onClick={() => toggleTag('verifiedOnly')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
            filters.verifiedOnly
              ? 'border-amber-400 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-md shadow-amber-400/20'
              : 'border-white/10 bg-neutral-900 text-amber-400 hover:border-amber-400/40'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>🛡️ Yoxlanılmış Evlər (Kupçalı / Çəkiliş)</span>
        </button>

        {/* Clear filters if any active */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 underline ml-auto cursor-pointer"
          >
            <span>Təmizlə ({activeFilterCount})</span>
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
