import React, { useState } from 'react';
import { Villa } from '../data/villas';
import { isHolidayDate, isWeekendNight } from '../utils/ticker';
import {
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  Sparkles,
  Lock,
  Unlock,
} from 'lucide-react';

interface HostCalendarManagerModalProps {
  isOpen: boolean;
  villa: Villa;
  onClose: () => void;
  onUpdateVillaPricingAndCalendar: (
    villaId: string,
    pricing: { weekdayPrice: number; weekendPrice: number; holidayPrice: number },
    bookedDates: string[]
  ) => void;
}

export const HostCalendarManagerModal: React.FC<HostCalendarManagerModalProps> = ({
  isOpen,
  villa,
  onClose,
  onUpdateVillaPricingAndCalendar,
}) => {
  if (!isOpen) return null;

  const [weekdayPrice, setWeekdayPrice] = useState(villa.weekdayPrice || villa.price);
  const [weekendPrice, setWeekendPrice] = useState(villa.weekendPrice || Math.round(villa.price * 1.25));
  const [holidayPrice, setHolidayPrice] = useState(villa.holidayPrice || Math.round(villa.price * 1.45));
  const [bookedDates, setBookedDates] = useState<string[]>(villa.bookedDates || []);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [savedNotice, setSavedNotice] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNamesAz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDay = (firstDayIndex + 6) % 7;

  const toggleDateBooked = (dateIso: string) => {
    if (bookedDates.includes(dateIso)) {
      setBookedDates(bookedDates.filter((d) => d !== dateIso));
    } else {
      setBookedDates([...bookedDates, dateIso]);
    }
  };

  const handleSave = () => {
    onUpdateVillaPricingAndCalendar(
      villa.id,
      {
        weekdayPrice: Number(weekdayPrice),
        weekendPrice: Number(weekendPrice),
        holidayPrice: Number(holidayPrice),
      },
      bookedDates
    );
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="host-cal-modal-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-neutral-900 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400 text-neutral-950 font-bold shadow-md">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <h3 id="host-cal-modal-title" className="text-sm sm:text-base font-bold text-white">
                Ev Sahibi: Təqvim və Dinamik Qiymət İdarəetməsi
              </h3>
              <p className="text-[11px] text-neutral-400 truncate max-w-sm">
                {villa.title} ({villa.region})
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

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Dynamic Rates Configuration Inputs */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Dinamik Gecəlik Qiymətlər
              </h4>
              <span className="text-[10px] text-neutral-500">Müştəri seçdikdə avtomatik hesablanır</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Həftəiçi (B.E - C.A)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weekdayPrice}
                    onChange={(e) => setWeekdayPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-bold text-white pr-7 focus:border-amber-400 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-neutral-500">₼</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-amber-300 block mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Həftəsonu (Cümə - Baz)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weekendPrice}
                    onChange={(e) => setWeekendPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-amber-400/30 bg-neutral-900 px-3 py-2 text-xs font-bold text-amber-300 pr-7 focus:border-amber-400 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-amber-500">₼</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-rose-300 block mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Bayram Günləri
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={holidayPrice}
                    onChange={(e) => setHolidayPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-rose-400/30 bg-neutral-900 px-3 py-2 text-xs font-bold text-rose-300 pr-7 focus:border-rose-400 focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2 text-xs text-rose-500">₼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Month Grid for Booking/Unbooking */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white">Təqvimdə Günləri Tək Toxunuşla Bağla / Aç</h4>
                <p className="text-[11px] text-neutral-400">
                  İstənilən günün üzərinə klikləyərək dolu (qırmızı) və ya boş (yaşıl) edin.
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg border border-white/10 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-white px-2">
                  {monthNamesAz[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg border border-white/10 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400 pb-1">
              <span>B.E</span>
              <span>Ç.A</span>
              <span>Çər</span>
              <span>C.A</span>
              <span className="text-amber-400">Cüm</span>
              <span className="text-amber-400">Şən</span>
              <span className="text-amber-400">Baz</span>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: adjustedFirstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-12 opacity-0 pointer-events-none" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const monthStr = String(month + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateIso = `${year}-${monthStr}-${dayStr}`;

                const isBooked = bookedDates.includes(dateIso);
                const isHoliday = isHolidayDate(dateIso);
                const isWeekend = isWeekendNight(new Date(year, month, dayNum));

                let dayPrice = weekdayPrice;
                if (isHoliday) dayPrice = holidayPrice;
                else if (isWeekend) dayPrice = weekendPrice;

                return (
                  <button
                    key={dateIso}
                    type="button"
                    onClick={() => toggleDateBooked(dateIso)}
                    className={`flex flex-col items-center justify-between p-1.5 h-12 rounded-xl border transition-all cursor-pointer ${
                      isBooked
                        ? 'border-rose-500/50 bg-rose-950/60 text-rose-300'
                        : 'border-white/10 bg-neutral-900 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-neutral-200'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between text-[11px] font-bold">
                      <span>{dayNum}</span>
                      {isBooked ? (
                        <Lock className="h-3 w-3 text-rose-400" />
                      ) : (
                        <Unlock className="h-3 w-3 text-emerald-400 opacity-60" />
                      )}
                    </div>
                    <span className="text-[9px] font-mono leading-none">
                      {isBooked ? 'Dolu' : `${dayPrice}₼`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {savedNotice && (
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Təqvim və dinamik qiymətlər yadda saxlanıldı və saytda dərhal yeniləndi!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-white/15 bg-neutral-800 py-3 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
            >
              Bağla
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-amber-500/20 hover:brightness-110 cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Dəyişiklikləri Təsdiqlə</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
