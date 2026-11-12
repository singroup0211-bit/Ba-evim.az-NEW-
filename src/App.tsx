import { useState } from 'react';
import { VILLAS, Villa, VerificationBadgeType } from './data/villas';
import { VillaFilters, DynamicPriceBreakdown } from './utils/ticker';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedVillas } from './components/FeaturedVillas';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { VillaModal } from './components/VillaModal';
import { BookingModal } from './components/BookingModal';
import { EscrowPaymentModal } from './components/EscrowPaymentModal';
import { TelegramWhatsAppBotModal } from './components/TelegramWhatsAppBotModal';
import { HostVerificationModal } from './components/HostVerificationModal';
import { HostCalendarManagerModal } from './components/HostCalendarManagerModal';

export default function App() {
  const [villasList, setVillasList] = useState<Villa[]>(VILLAS);
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);
  
  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isEscrowOpen, setIsEscrowOpen] = useState<boolean>(false);
  const [escrowVilla, setEscrowVilla] = useState<Villa | null>(null);
  const [escrowBreakdown, setEscrowBreakdown] = useState<DynamicPriceBreakdown | null>(null);
  
  const [isBotModalOpen, setIsBotModalOpen] = useState<boolean>(false);
  const [botVilla, setBotVilla] = useState<Villa>(VILLAS[0]);
  
  const [isHostCalendarOpen, setIsHostCalendarOpen] = useState<boolean>(false);
  const [hostCalendarVilla, setHostCalendarVilla] = useState<Villa>(VILLAS[0]);

  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [verificationVillaId, setVerificationVillaId] = useState<string>(VILLAS[0]?.id);

  const [activeFilters, setActiveFilters] = useState<VillaFilters>({
    region: 'Bütün regionlar',
    type: 'Bütün növlər',
    category: 'all',
  });

  const handleNavigateSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Callback to update villa availability (e.g. from WhatsApp/Telegram bot)
  const handleUpdateVillaAvailability = (villaId: string, dateIso: string, isBooked: boolean) => {
    setVillasList((prev) =>
      prev.map((v) => {
        if (v.id !== villaId) return v;
        const currentDates = v.bookedDates || [];
        const nextDates = isBooked
          ? Array.from(new Set([...currentDates, dateIso]))
          : currentDates.filter((d) => d !== dateIso);
        return {
          ...v,
          bookedDates: nextDates,
        };
      })
    );
  };

  // Callback to update pricing & booked dates from Host Calendar Modal
  const handleUpdateVillaPricingAndCalendar = (
    villaId: string,
    pricing: { weekdayPrice: number; weekendPrice: number; holidayPrice: number },
    bookedDates: string[]
  ) => {
    setVillasList((prev) =>
      prev.map((v) => {
        if (v.id !== villaId) return v;
        return {
          ...v,
          price: pricing.weekdayPrice,
          weekdayPrice: pricing.weekdayPrice,
          weekendPrice: pricing.weekendPrice,
          holidayPrice: pricing.holidayPrice,
          bookedDates,
        };
      })
    );
  };

  // Callback to update verification status from Admin or Host submission
  const handleUpdateVerification = (
    villaId: string,
    status: VerificationBadgeType,
    details: Villa['verificationDetails']
  ) => {
    setVillasList((prev) =>
      prev.map((v) => {
        if (v.id !== villaId) return v;
        return {
          ...v,
          verificationStatus: status,
          verificationDetails: {
            ...v.verificationDetails,
            ...details,
          },
        };
      })
    );
  };

  // Open Escrow Modal from VillaModal or Calendar
  const handleOpenEscrow = (villa: Villa, breakdown: DynamicPriceBreakdown) => {
    setEscrowVilla(villa);
    setEscrowBreakdown(breakdown);
    setIsEscrowOpen(true);
  };

  // Open Bot Simulator for specific villa
  const handleOpenBot = (villa?: Villa) => {
    setBotVilla(villa || selectedVilla || villasList[0]);
    setIsBotModalOpen(true);
  };

  // Open Host Calendar for specific villa
  const handleOpenHostCalendar = (villa?: Villa) => {
    setHostCalendarVilla(villa || selectedVilla || villasList[0]);
    setIsHostCalendarOpen(true);
  };

  // Open Verification Modal
  const handleOpenVerification = (vId?: string) => {
    setVerificationVillaId(vId || selectedVilla?.id || villasList[0]?.id);
    setIsVerificationOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Floating Translucent Oval Header */}
      <Header
        onOpenBooking={() => setIsBookingOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenVerificationModal={() => handleOpenVerification()}
        onOpenBotModal={() => handleOpenBot()}
        onOpenHostCalendarModal={() => handleOpenHostCalendar()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with Infinite Marquee */}
        <HeroSection
          villas={villasList}
          onSelectVilla={(villa) => setSelectedVilla(villa)}
          onFilterChange={(filters) => setActiveFilters(filters)}
        />

        {/* Featured Villas Grid Section with Advanced Local Filters & Escrow */}
        <FeaturedVillas
          villas={villasList}
          activeFilters={activeFilters}
          onSelectVilla={(villa) => setSelectedVilla(villa)}
          onFilterChange={(filters) => setActiveFilters(filters)}
          onOpenVerificationModal={(villaId) => handleOpenVerification(villaId)}
        />

        {/* About & Trust Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => setIsBookingOpen(true)} />

      {/* 1. Villa Details Modal with Dynamic Calendar & Hidden Contacts */}
      <VillaModal
        villa={selectedVilla}
        onClose={() => setSelectedVilla(null)}
        onOpenEscrow={handleOpenEscrow}
        onOpenBotSimulator={handleOpenBot}
        onOpenHostCalendar={handleOpenHostCalendar}
        onOpenVerification={handleOpenVerification}
      />

      {/* 2. Escrow 10% Beh Payment Modal (Epoint / Payriff & ABB Pay) */}
      <EscrowPaymentModal
        isOpen={isEscrowOpen}
        villa={escrowVilla}
        priceBreakdown={escrowBreakdown}
        onClose={() => setIsEscrowOpen(false)}
        onBookingSuccess={(_bookingId) => {
          // If a booking is confirmed, update selected dates
          if (escrowVilla && escrowBreakdown) {
            const newBookedDates = escrowBreakdown.dailyRates.map((d) => d.date);
            setVillasList((prev) =>
              prev.map((v) => {
                if (v.id !== escrowVilla.id) return v;
                return {
                  ...v,
                  bookedDates: Array.from(new Set([...(v.bookedDates || []), ...newBookedDates])),
                };
              })
            );
          }
        }}
      />

      {/* 3. Automated WhatsApp / Telegram Calendar Bot Simulator */}
      <TelegramWhatsAppBotModal
        isOpen={isBotModalOpen}
        villa={botVilla}
        onClose={() => setIsBotModalOpen(false)}
        onUpdateVillaAvailability={handleUpdateVillaAvailability}
      />

      {/* 4. Host Calendar & Dynamic Pricing Manager */}
      <HostCalendarManagerModal
        isOpen={isHostCalendarOpen}
        villa={hostCalendarVilla}
        onClose={() => setIsHostCalendarOpen(false)}
        onUpdateVillaPricingAndCalendar={handleUpdateVillaPricingAndCalendar}
      />

      {/* 5. "Yoxlanılmış Ev" (Verified) & Sənəd / Çıxarış / Yerində Çəkiliş Modalı */}
      <HostVerificationModal
        isOpen={isVerificationOpen}
        villas={villasList}
        selectedVillaId={verificationVillaId}
        onClose={() => setIsVerificationOpen(false)}
        onUpdateVerification={handleUpdateVerification}
      />

      {/* Standard Quick Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
