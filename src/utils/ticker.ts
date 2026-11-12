import { Villa, VillaCategory } from '../data/villas';

export type MarqueeSpeed = 'slow' | 'normal' | 'fast';
export type MarqueeDirection = 'left' | 'right';

/**
 * Calculates animation duration in seconds based on card count and speed setting
 */
export function calculateMarqueeDuration(itemCount: number, speed: MarqueeSpeed): number {
  const baseSecondsPerItem = {
    slow: 9,
    normal: 6,
    fast: 3.5,
  }[speed];

  return Math.max(20, itemCount * baseSecondsPerItem);
}

/**
 * Duplicates an array for seamless infinite marquee loop (-50% CSS translate3d)
 */
export function duplicateForInfiniteLoop<T>(items: T[], copies: number = 2): T[] {
  if (!items || items.length === 0) return [];
  const result: T[] = [];
  for (let i = 0; i < copies; i++) {
    result.push(...items);
  }
  return result;
}

/**
 * Formats a number as Azerbaijani Manat (AZN / ₼)
 */
export function formatAzn(amount: number): string {
  return new Intl.NumberFormat('az-AZ').format(amount) + ' ₼';
}

/**
 * Azerbaijan Official & Popular Holiday Dates (Month-Day check or specific dates)
 * Novruz (20-24 Mar), Yeni İl (31 Dec, 1-2 Jan), Zəfər Günü (8 Nov), Bayraq Günü (9 Nov), Qurban/Ramazan
 */
export function isHolidayDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const parts = dateStr.split('-');
  if (parts.length < 3) return false;
  const monthDay = `${parts[1]}-${parts[2]}`;
  
  const holidays = [
    '01-01', '01-02', // Yeni İl
    '01-20',          // Şəhidlər günü
    '03-20', '03-21', '03-22', '03-23', '03-24', // Novruz Bayramı
    '05-09',          // Qələbə günü
    '05-28',          // Müstəqillik günü
    '06-15',          // Milli Qurtuluş günü
    '06-26',          // Silahlı Qüvvələr günü
    '11-08',          // Zəfər Günü
    '11-09',          // Dövlət Bayrağı Günü
    '12-31',          // Həmrəylik Günü
  ];

  return holidays.includes(monthDay);
}

/**
 * Checks whether a given day is Friday (5) or Saturday (6) or Sunday (0) (Weekend night)
 */
export function isWeekendNight(date: Date): boolean {
  const day = date.getDay();
  // In villa rental business, Friday night (5) and Saturday night (6) are peak weekend nights
  return day === 5 || day === 6;
}

export interface DynamicPriceBreakdown {
  checkIn: string;
  checkOut: string;
  totalNights: number;
  weekdayNights: number;
  weekendNights: number;
  holidayNights: number;
  weekdaySubtotal: number;
  weekendSubtotal: number;
  holidaySubtotal: number;
  totalPrice: number;
  escrowDeposit: number; // 10% Onlayn beh (platform escrow zəmanəti)
  arrivalBalance: number; // 90% Evə çatanda ödəniləcək məbləğ
  averagePerNight: number;
  dailyRates: {
    date: string;
    dayName: string;
    type: 'weekday' | 'weekend' | 'holiday';
    price: number;
    isBooked: boolean;
  }[];
}

/**
 * Calculates dynamic pricing for selected stay period
 */
export function calculateDynamicPrice(
  villa: Villa,
  checkInStr: string,
  checkOutStr: string
): DynamicPriceBreakdown {
  if (!checkInStr || !checkOutStr) {
    const defaultTotal = villa.price;
    return {
      checkIn: checkInStr,
      checkOut: checkOutStr,
      totalNights: 1,
      weekdayNights: 1,
      weekendNights: 0,
      holidayNights: 0,
      weekdaySubtotal: defaultTotal,
      weekendSubtotal: 0,
      holidaySubtotal: 0,
      totalPrice: defaultTotal,
      escrowDeposit: Math.round(defaultTotal * 0.1),
      arrivalBalance: defaultTotal - Math.round(defaultTotal * 0.1),
      averagePerNight: defaultTotal,
      dailyRates: [],
    };
  }

  const startDate = new Date(checkInStr);
  const endDate = new Date(checkOutStr);

  if (endDate <= startDate) {
    const singlePrice = villa.price;
    return {
      checkIn: checkInStr,
      checkOut: checkOutStr,
      totalNights: 1,
      weekdayNights: 1,
      weekendNights: 0,
      holidayNights: 0,
      weekdaySubtotal: singlePrice,
      weekendSubtotal: 0,
      holidaySubtotal: 0,
      totalPrice: singlePrice,
      escrowDeposit: Math.round(singlePrice * 0.1),
      arrivalBalance: singlePrice - Math.round(singlePrice * 0.1),
      averagePerNight: singlePrice,
      dailyRates: [],
    };
  }

  const dayNamesAz = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
  
  let totalNights = 0;
  let weekdayNights = 0;
  let weekendNights = 0;
  let holidayNights = 0;
  let weekdaySubtotal = 0;
  let weekendSubtotal = 0;
  let holidaySubtotal = 0;
  const dailyRates: DynamicPriceBreakdown['dailyRates'] = [];

  const current = new Date(startDate);
  while (current < endDate) {
    const dateIso = current.toISOString().split('T')[0];
    const isHoliday = isHolidayDate(dateIso);
    const isWeekend = isWeekendNight(current);
    const isBooked = (villa.bookedDates || []).includes(dateIso);

    let price = villa.weekdayPrice || villa.price;
    let rateType: 'weekday' | 'weekend' | 'holiday' = 'weekday';

    if (villa.customDatePricing && villa.customDatePricing[dateIso]) {
      price = villa.customDatePricing[dateIso];
    } else if (isHoliday) {
      price = villa.holidayPrice || villa.price * 1.35;
      rateType = 'holiday';
      holidayNights++;
      holidaySubtotal += price;
    } else if (isWeekend) {
      price = villa.weekendPrice || villa.price * 1.25;
      rateType = 'weekend';
      weekendNights++;
      weekendSubtotal += price;
    } else {
      weekdayNights++;
      weekdaySubtotal += price;
    }

    totalNights++;
    dailyRates.push({
      date: dateIso,
      dayName: dayNamesAz[current.getDay()],
      type: rateType,
      price,
      isBooked,
    });

    current.setDate(current.getDate() + 1);
  }

  const totalPrice = weekdaySubtotal + weekendSubtotal + holidaySubtotal;
  const escrowDeposit = Math.round(totalPrice * 0.1); // 10% onlayn beh
  const arrivalBalance = totalPrice - escrowDeposit; // 90% yerində
  const averagePerNight = Math.round(totalPrice / Math.max(1, totalNights));

  return {
    checkIn: checkInStr,
    checkOut: checkOutStr,
    totalNights,
    weekdayNights,
    weekendNights,
    holidayNights,
    weekdaySubtotal,
    weekendSubtotal,
    holidaySubtotal,
    totalPrice,
    escrowDeposit,
    arrivalBalance,
    averagePerNight,
    dailyRates,
  };
}

/**
 * Checks if a specific date is already marked as booked for this villa
 */
export function isDateBooked(villa: Villa, dateIso: string): boolean {
  return (villa.bookedDates || []).includes(dateIso);
}

export interface VillaFilters {
  region?: string;
  category?: VillaCategory | 'all';
  type?: string;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  hasPool?: boolean;
  
  // Local market specific tags
  istiHovuz?: boolean;
  manqalSamovar?: boolean;
  yalnizAile?: boolean; // Yerli bazarda ən çox soruşulan (subaylara verilmir)
  denizYaxin?: boolean;
  wifiGenerator?: boolean; // Rayonlarda işıq sönməsinə qarşı generator
  kombiKondisioner?: boolean;
  kamin?: boolean;
  verifiedOnly?: boolean; // Yalnız təsdiqlənmiş (çıxarış / yerində çəkiliş)
}

/**
 * Filter function for villas with advanced local market criteria
 */
export function filterVillas(villas: Villa[], filters: VillaFilters): Villa[] {
  return villas.filter((villa) => {
    // Search query match (title, location, tags, zone)
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      const match =
        villa.title.toLowerCase().includes(q) ||
        villa.location.toLowerCase().includes(q) ||
        villa.zone.toLowerCase().includes(q) ||
        villa.region.toLowerCase().includes(q) ||
        villa.tags.some((t) => t.toLowerCase().includes(q)) ||
        villa.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Region
    if (filters.region && filters.region !== 'Bütün regionlar' && villa.region !== filters.region) {
      return false;
    }

    // Category
    if (filters.category && filters.category !== 'all' && villa.category !== filters.category) {
      return false;
    }

    // Type
    if (filters.type && filters.type !== 'Bütün növlər' && villa.type !== filters.type) {
      return false;
    }

    // Min / Max Price
    if (filters.minPrice !== undefined && villa.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && villa.price > filters.maxPrice) {
      return false;
    }

    // Bedrooms
    if (filters.minBedrooms !== undefined && filters.minBedrooms > 0 && villa.bedrooms < filters.minBedrooms) {
      return false;
    }

    // Has Pool
    if (filters.hasPool && !villa.hasPool) {
      return false;
    }

    // Local Feature Tags
    if (filters.istiHovuz && !villa.features.istiHovuz) {
      return false;
    }
    if (filters.manqalSamovar && !villa.features.manqalSamovar) {
      return false;
    }
    if (filters.yalnizAile && !villa.features.yalnizAile) {
      return false;
    }
    if (filters.denizYaxin && !villa.features.denizYaxin) {
      return false;
    }
    if (filters.wifiGenerator && !villa.features.wifiGenerator) {
      return false;
    }
    if (filters.kombiKondisioner && !villa.features.kombiKondisioner) {
      return false;
    }
    if (filters.kamin && !villa.features.kamin) {
      return false;
    }

    // Verified badge
    if (filters.verifiedOnly && villa.verificationStatus === 'pending') {
      return false;
    }

    return true;
  });
}

/**
 * Generates standalone clean React + Tailwind component code for user export
 */
export function getStandaloneReactCode(): string {
  return `/*
 * bagevim.az - Sonsuz Hərəkət Edən (Infinite Marquee) Dynamic Ticker Komponenti
 * Framework: React + Tailwind CSS
 */
export default function VillaMarquee() {
  return <div className="p-4 text-center">bagevim.az Marquee Component</div>;
}`;
}

export function getStandaloneVanillaHtmlCode(): string {
  return `<!-- bagevim.az - Marquee Ticker -->
<div class="marquee">bagevim.az</div>`;
}
