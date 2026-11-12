import React from 'react';
import { CalendarCheck, ShieldCheck, Bot, Calendar } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onNavigateSection: (id: string) => void;
  onOpenVerificationModal: () => void;
  onOpenBotModal: () => void;
  onOpenHostCalendarModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onNavigateSection,
  onOpenVerificationModal,
  onOpenBotModal,
  onOpenHostCalendarModal,
}) => {
  return (
    <aside className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl">
      {/* 
        Floating Translucent Oval Header 
      */}
      <header className="relative flex items-center justify-between gap-3 sm:gap-6 rounded-full border border-white/20 bg-neutral-950/80 px-3.5 sm:px-6 py-2.5 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85),0_0_25px_rgba(245,158,11,0.12)] backdrop-blur-2xl ring-1 ring-white/10 transition-all duration-300">
        {/* Brand Logo Container */}
        <div className="flex items-center gap-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            id="brand-logo-container"
            className="group relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-black p-0.5 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40 transition-all duration-300 hover:scale-105 hover:ring-amber-400 cursor-pointer overflow-hidden"
            aria-label="bagevim loqo"
            title="bagevim loqo"
          >
            <img
              src="/logo.jpeg"
              alt="bagevim loqo"
              className="h-full w-full rounded-full object-contain object-center transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = '/assets/aistudio/Gemini_Generated_Image_j6n1npj6n1npj6n1_copy_1275488f.jpeg';
              }}
            />
          </a>
          <span className="hidden xl:inline text-xs font-bold text-white tracking-wide">
            bagevim<span className="text-amber-400">.az</span>
          </span>
        </div>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-neutral-300">
          <button
            onClick={() => onNavigateSection('villas-grid')}
            className="rounded-full px-3 py-1.5 transition-all hover:bg-white/10 hover:text-amber-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            Seçilmiş Villalar
          </button>

          {/* 1. Yoxlanılmış Evlər (Çıxarış & Yerində Çəkiliş) */}
          <button
            onClick={onOpenVerificationModal}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all hover:bg-white/10 hover:text-emerald-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Yoxlanılmış Evlər</span>
          </button>

          {/* 2. WhatsApp/Telegram Təqvim Botu */}
          <button
            onClick={onOpenBotModal}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all hover:bg-white/10 hover:text-sky-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Bot className="h-3.5 w-3.5 text-sky-400" />
            <span>Təqvim Botu</span>
          </button>

          {/* 3. Ev Sahibi Dinamik Təqvimi */}
          <button
            onClick={onOpenHostCalendarModal}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all hover:bg-white/10 hover:text-amber-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Calendar className="h-3.5 w-3.5 text-amber-400" />
            <span>Ev Sahibi Paneli</span>
          </button>

          <button
            onClick={() => onNavigateSection('about-section')}
            className="rounded-full px-3 py-1.5 transition-all hover:bg-white/10 hover:text-amber-300 cursor-pointer whitespace-nowrap shrink-0"
          >
            Haqqımızda
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Bot shortcut on smaller screens */}
          <button
            type="button"
            onClick={onOpenBotModal}
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            title="Təqvim Botu"
          >
            <Bot className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Bron et</span>
          </button>
        </div>
      </header>
    </aside>
  );
};
