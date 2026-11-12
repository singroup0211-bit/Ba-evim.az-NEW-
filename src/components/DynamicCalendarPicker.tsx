import React, { useState, useMemo } from 'react';
import { Villa } from '../data/villas';
import { calculateDynamicPrice, formatAzn, isHolidayDate, isWeekendNight } from '../utils/ticker';
import { Calendar, ChevronLeft, ChevronRight, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

interface DynamicCalendarPickerProps {
  villa: Villa;
  onProceedToEscrow: (checkIn: string, checkOut: string, priceDetails: ReturnType<typeof calculateDynamicPrice>) => void;
}

export const DynamicCalendarPicker: React.FC<DynamicCalendarPickerProps> = ({
  villa,
  onProceedToEscrow,
}) => {
  // Default to today and day after tomorrow
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const dayAfterTomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [checkIn, setCheckIn] = useState<string>(tomorrow);
  const [checkOut, setCheckOut] = useState<string>(dayAfterTomorrow);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Generate days for interactive calendar view
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-indexed

  const monthNamesAz = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert so Monday is 0
  const adjustedFirstDay = (firstDayIndex + 6) % 7;

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const priceBreakdown = useMemo(() => {
    return calculateDynamicPrice(villa, checkIn, checkOut);
  }, [villa, checkIn, checkOut]);

  const handleDateClick = (dateIso: string) => {
    const isBooked = (villa.bookedDates || []).includes(dateIso);
    if (isBooked) return; // Cannot select booked dates

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateIso);
      setCheckOut('');
    } else if (checkIn && !checkOut) {
      if (new Date(dateIso) > new Date(checkIn)) {
        setCheckOut(dateIso);
      } else {
        setCheckIn(dateIso);
        setCheckOut('');
      }
    }
  };

  return (
    <div className="rounded-3xl border border-white/15 bg-neutral-950/80 p-5 sm:p-6 backdrop-blur-xl space-y-6">
      {/* Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-neutral-950">
              <Calendar className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold text-white">İnteraktiv Təqvim və Dinamik Qiymət</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Giriş və çıxış tarixlərini seçin. Həftəiçi, həftəsonu və bayram qiymətləri avtomatik hesablanır.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Boş gün
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Dolu (Rezerv)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Bayram / Həftəsonu
          </span>
        </div>
      </div>

      {/* Calendar Navigation & Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white">
            {monthNamesAz[month]} {year}
          </h4>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Əvvəlki ay"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Növbəti ay"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day header names */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400 pb-1">
          <span>B.E</span>
          <span>Ç.A</span>
          <span>Çər</span>
          <span>C.A</span>
          <span className="text-amber-400">Cüm</span>
          <span className="text-amber-400">Şən</span>
          <span className="text-amber-400">Baz</span>
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: adjustedFirstDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-14 rounded-xl opacity-0 pointer-events-none" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateIso = `${year}-${monthStr}-${dayStr}`;

            const isPast = dateIso < today;
            const isBooked = (villa.bookedDates || []).includes(dateIso);
            const isHoliday = isHolidayDate(dateIso);
            const dateObj = new Date(year, month, dayNum);
            const isWeekend = isWeekendNight(dateObj);

            const isSelectedCheckIn = checkIn === dateIso;
            const isSelectedCheckOut = checkOut === dateIso;
            const isInRange =
              checkIn &&
              checkOut &&
              new Date(dateIso) > new Date(checkIn) &&
              new Date(dateIso) < new Date(checkOut);

            let dayRate = villa.weekdayPrice;
            if (isHoliday) dayRate = villa.holidayPrice;
            else if (isWeekend) dayRate = villa.weekendPrice;

            let bgClass = 'border-white/10 bg-neutral-900/60 hover:border-amber-400/50 hover:bg-neutral-800 text-neutral-200';
            if (isPast) {
              bgClass = 'border-white/5 bg-neutral-950/40 text-neutral-600 cursor-not-allowed opacity-50';
            } else if (isBooked) {
              bgClass = 'border-rose-500/30 bg-rose-950/40 text-rose-300 cursor-not-allowed line-through';
            } else if (isSelectedCheckIn || isSelectedCheckOut) {
              bgClass = 'border-amber-400 bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-400/30';
            } else if (isInRange) {
              bgClass = 'border-amber-400/40 bg-amber-400/20 text-amber-200 font-semibold';
            }

            return (
              <button
                key={dateIso}
                type="button"
                disabled={isPast || isBooked}
                onClick={() => handleDateClick(dateIso)}
                className={`flex flex-col items-center justify-between p-1.5 h-14 rounded-xl border transition-all text-left relative cursor-pointer ${bgClass}`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-bold leading-none">{dayNum}</span>
                  {isHoliday && !isBooked && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Bayram günü" />
                  )}
                  {isBooked && (
                    <span className="text-[9px] font-bold text-rose-400 leading-none">Dolu</span>
                  )}
                </div>

                {!isPast && !isBooked && (
                  <span
                    className={`text-[10px] leading-tight font-medium ${
                      isSelectedCheckIn || isSelectedCheckOut ? 'text-neutral-950 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {dayRate} ₼
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Pickers Inputs */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-xs font-semibold text-neutral-300 block mb-1">Giriş Tarixi</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-300 block mb-1">Çıxış Tarixi</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Dynamic Price Breakdown Box */}
      <div className="rounded-2xl border border-white/15 bg-neutral-900/90 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-white/10 pb-2">
          <span>Seçilən Müddət:</span>
          <span className="font-bold text-white">
            {priceBreakdown.totalNights} gecə ({checkIn} → {checkOut})
          </span>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-1.5 text-xs text-neutral-300">
          {priceBreakdown.weekdayNights > 0 && (
            <div className="flex justify-between">
              <span>{priceBreakdown.weekdayNights} həftəiçi gecəsi (baza {villa.weekdayPrice} ₼):</span>
              <span className="font-semibold text-white">{priceBreakdown.weekdaySubtotal} ₼</span>
            </div>
          )}
          {priceBreakdown.weekendNights > 0 && (
            <div className="flex justify-between text-amber-300">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {priceBreakdown.weekendNights} həftəsonu gecəsi ({villa.weekendPrice} ₼):
              </span>
              <span className="font-semibold">{priceBreakdown.weekendSubtotal} ₼</span>
            </div>
          )}
          {priceBreakdown.holidayNights > 0 && (
            <div className="flex justify-between text-amber-400">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {priceBreakdown.holidayNights} rəsmi bayram gecəsi ({villa.holidayPrice} ₼):
              </span>
              <span className="font-semibold">{priceBreakdown.holidaySubtotal} ₼</span>
            </div>
          )}
        </div>

        {/* Total & Escrow Split Display */}
        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-white">Cəmi Məbləğ:</span>
            <span className="text-xl font-extrabold text-amber-400">{formatAzn(priceBreakdown.totalPrice)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-950/70 p-2.5 border border-white/10 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">İndi Ödənilən Beh (10%):</span>
              <span className="text-sm font-bold text-emerald-400">{formatAzn(priceBreakdown.escrowDeposit)}</span>
              <span className="text-[10px] text-neutral-500 block">Zəmanətli Escrow</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Qapıda / Evə çatanda (90%):</span>
              <span className="text-sm font-bold text-white">{formatAzn(priceBreakdown.arrivalBalance)}</span>
              <span className="text-[10px] text-neutral-500 block">Ev sahibinə ödənilir</span>
            </div>
          </div>
        </div>

        {/* Closed Contact Notice */}
        <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <p>
            <strong>Təhlükəsizlik və Qapalı Əlaqə:</strong> Dələduzluğun qarşısını almaq üçün ev sahibinin birbaşa mobil nömrəsi və dəqiq ünvanı yalnız <strong>10% zəmanətli beh</strong> ödənildikdən sonra dərhal açılır.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onProceedToEscrow(checkIn, checkOut, priceBreakdown)}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
        >
          <CreditCard className="h-4 w-4" />
          <span>10% Beh Ödə ({formatAzn(priceBreakdown.escrowDeposit)}) və Əlaqəni Aç</span>
        </button>
      </div>
    </div>
  );
};
