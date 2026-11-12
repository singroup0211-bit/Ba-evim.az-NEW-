import React, { useState } from 'react';
import { Villa } from '../data/villas';
import {
  X,
  MessageSquare,
  Bot,
  Send,
  CheckCircle2,
  BellRing,
  Smartphone,
  Settings,
  Check,
} from 'lucide-react';

interface TelegramWhatsAppBotModalProps {
  isOpen: boolean;
  villa: Villa;
  onClose: () => void;
  onUpdateVillaAvailability: (villaId: string, dateIso: string, isBooked: boolean) => void;
}

export const TelegramWhatsAppBotModal: React.FC<TelegramWhatsAppBotModalProps> = ({
  isOpen,
  villa,
  onClose,
  onUpdateVillaAvailability,
}) => {
  if (!isOpen) return null;

  const [platform, setPlatform] = useState<'whatsapp' | 'telegram'>('whatsapp');
  const [activeTab, setActiveTab] = useState<'simulator' | 'settings'>('simulator');
  const [todayStatus, setTodayStatus] = useState<'available' | 'booked' | 'pending'>('pending');
  const [bookingPromptStatus, setBookingPromptStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [telegramToken, setTelegramToken] = useState('7819283719:AAG-BagevimBotSecretKeyAz');
  const [telegramChatId, setTelegramChatId] = useState('994503124488');
  const [savedSettings, setSavedSettings] = useState(false);

  const todayIso = new Date().toISOString().split('T')[0];

  const handleMorningResponse = (status: 'available' | 'booked') => {
    setTodayStatus(status);
    onUpdateVillaAvailability(villa.id, todayIso, status === 'booked');
  };

  const handleBookingPrompt = (status: 'accepted' | 'declined') => {
    setBookingPromptStatus(status);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bot-modal-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-neutral-900 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-2xl font-bold shadow-md ${
                platform === 'whatsapp' ? 'bg-emerald-500 text-neutral-950' : 'bg-sky-500 text-white'
              }`}
            >
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h3 id="bot-modal-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Avtomatlaşdırılmış Təqvim Botu</span>
                <span className="rounded-full bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 border border-amber-400/30">
                  Canlı Simulyator
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Ev sahibləri sayta girmədən hər səhər WhatsApp və ya Telegram-dan təqvimi yeniləyir
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

        {/* Platform Selector & Tab Strip */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 bg-neutral-950/40">
          {/* WhatsApp vs Telegram */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-800/80 border border-white/10">
            <button
              type="button"
              onClick={() => setPlatform('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                platform === 'whatsapp'
                  ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>WhatsApp Bot</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatform('telegram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                platform === 'telegram'
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Telegram Bot</span>
            </button>
          </div>

          {/* Simulator vs Settings Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1 text-xs font-medium rounded-lg cursor-pointer ${
                activeTab === 'simulator' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Canlı Söhbət
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer ${
                activeTab === 'settings' ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Parametrlər</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'simulator' ? (
            <div className="space-y-6">
              {/* Phone Container Screen */}
              <div
                className={`rounded-3xl border p-4 sm:p-6 space-y-4 shadow-inner ${
                  platform === 'whatsapp'
                    ? 'border-emerald-500/20 bg-[#0b141a]'
                    : 'border-sky-500/20 bg-[#17212b]'
                }`}
              >
                {/* Chat Header Bar */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-white font-bold ${
                      platform === 'whatsapp' ? 'bg-emerald-600' : 'bg-sky-600'
                    }`}
                  >
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{platform === 'whatsapp' ? 'bagevim.az WhatsApp Bot' : '@bagevim_calendar_bot'}</span>
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h5>
                    <p className="text-[10px] text-neutral-400">Rəsmi təqvim və bron idarəetmə köməkçisi</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">09:00 AM</span>
                </div>

                {/* MESSAGE 1: MORNING AVAILABILITY PING */}
                <div className="space-y-2">
                  <div className="max-w-[85%] rounded-2xl bg-neutral-800/90 p-3.5 border border-white/10 text-xs text-neutral-200 space-y-2">
                    <p className="font-semibold text-white">
                      Salam hörmətli ev sahibi ({villa.hostContact.name})! ☀️
                    </p>
                    <p>
                      Bu gün üçün <strong>"{villa.title}"</strong> bağ eviniz boşdur, yoxsa müştəriniz var?
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Tək toxunuşla statusu yeniləyin, saytda dərhal əks olunsun:
                    </p>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleMorningResponse('available')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        todayStatus === 'available'
                          ? 'bg-emerald-500 text-neutral-950 ring-2 ring-emerald-400'
                          : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-800'
                      }`}
                    >
                      <span>🟢 Bəli, bu gün boşdur</span>
                      {todayStatus === 'available' && <Check className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMorningResponse('booked')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        todayStatus === 'booked'
                          ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                          : 'bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-800'
                      }`}
                    >
                      <span>🔴 Xeyr, bu gün doludur</span>
                      {todayStatus === 'booked' && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Bot reply upon response */}
                  {todayStatus !== 'pending' && (
                    <div className="max-w-[80%] rounded-2xl bg-emerald-950/50 border border-emerald-500/30 p-3 text-xs text-emerald-200 mt-2 ml-auto">
                      {todayStatus === 'available' ? (
                        <p>
                          ✅ <strong>Təşəkkürlər!</strong> Təqvimdə bu gün <strong>"Boşdur"</strong> olaraq qeyd edildi.
                          Ev axtarış nəticələrində "Bu günə dərhal rezerv" nişanı ilə ən yuxarıda görünəcək.
                        </p>
                      ) : (
                        <p>
                          🔒 <strong>Təşəkkürlər!</strong> Təqvimdə bu gün <strong>"Dolu"</strong> olaraq bağlandı.
                          Müştərilər bu gün üçün narahat etməyəcək.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* MESSAGE 2: INSTANT NEW RESERVATION ALERT SIMULATION */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="max-w-[90%] rounded-2xl bg-neutral-800/90 p-3.5 border border-white/10 text-xs text-neutral-200 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <BellRing className="h-4 w-4" />
                      <span>YENİ BRON TƏLƏBİ (10% Beh Ödənilib)</span>
                    </div>
                    <p className="text-neutral-300">
                      Hörmətli ev sahibi, müştəri sayt üzərindən 10% zəmanətli beh ödəyərək rezervasiya etmək istəyir:
                    </p>
                    <div className="rounded-xl bg-neutral-900/80 p-2.5 space-y-1 font-mono text-[11px] text-neutral-300 border border-white/5">
                      <div>👤 Qonaq: Rəşad Məmmədov (4 böyük, 2 uşaq)</div>
                      <div>📅 Tarix: 14 - 16 Noyabr (2 gecə)</div>
                      <div>💰 Ümumi Məbləğ: 700 ₼</div>
                      <div>
                        🔒 <span className="text-emerald-400 font-bold">10% Onlayn Beh (Escrow): 70 ₼</span> (Ödənilib)
                      </div>
                      <div>💵 Məkanda alacağınız 90%: 630 ₼</div>
                    </div>
                    <p className="text-[11px] text-neutral-400">Bu bron sorğusunu təsdiqləyirsiniz?</p>
                  </div>

                  {/* Actions for booking */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleBookingPrompt('accepted')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        bookingPromptStatus === 'accepted'
                          ? 'bg-emerald-500 text-neutral-950 ring-2 ring-emerald-400'
                          : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-800'
                      }`}
                    >
                      <span>✅ Təsdiqlə və Müştərinin Nömrəsini Al</span>
                      {bookingPromptStatus === 'accepted' && <Check className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBookingPrompt('declined')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        bookingPromptStatus === 'declined'
                          ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                          : 'bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-800'
                      }`}
                    >
                      <span>❌ İmtina et və Behi Geri Qaytar</span>
                      {bookingPromptStatus === 'declined' && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {bookingPromptStatus === 'accepted' && (
                    <div className="max-w-[85%] rounded-2xl bg-emerald-950/50 border border-emerald-500/30 p-3 text-xs text-emerald-200 mt-2 ml-auto space-y-1">
                      <p className="font-bold">🎉 Bron uğurla təsdiqləndi!</p>
                      <p>
                        Müştərinin telefonu: <strong>+994 50 200 11 22 (Rəşad M.)</strong>. Təqvimdə 14-16 Noyabr
                        tarixləri dolu qeyd olundu.
                      </p>
                    </div>
                  )}

                  {bookingPromptStatus === 'declined' && (
                    <div className="max-w-[85%] rounded-2xl bg-rose-950/50 border border-rose-500/30 p-3 text-xs text-rose-200 mt-2 ml-auto">
                      <p>
                        ⚠️ Bron rədd edildi. Müştəriyə bildiriş göndərildi və 70 ₼ beh məbləği 100% geri qaytarıldı.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informative strip */}
              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-amber-400" />
                  <span>Ev sahibi qeydiyyatdan keçdikdə avtomatik olaraq bu bota qoşulur.</span>
                </span>
                <span className="font-semibold text-emerald-400">Status: Aktiv Sinxron</span>
              </div>
            </div>
          ) : (
            /* BOT SETTINGS TAB */
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-neutral-950 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Bot və Webhook Parametrləri
                </h4>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Səhər Avtomatik Bildiriş Saatı:
                  </label>
                  <select
                    value={notificationTime}
                    onChange={(e) => setNotificationTime(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="08:30">Hər gün saat 08:30 (Erkən xəbərdarlıq)</option>
                    <option value="09:00">Hər gün saat 09:00 (Tövsiyə olunan standart)</option>
                    <option value="10:00">Hər gün saat 10:00 (Gecikməyən bildiriş)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Telegram Bot Token (@BotFather):
                  </label>
                  <input
                    type="text"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Ev Sahibinin Telegram Chat ID / WhatsApp Nömrəsi:
                  </label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Webhook Endpoint (API URL):
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="https://bagevim.az/api/webhooks/bot-calendar"
                    className="w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-400"
                  />
                </div>
              </div>

              {savedSettings && (
                <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Bot konfiqurasiyası uğurla yadda saxlanıldı və sinxronlaşdırıldı!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-amber-400 py-3 text-xs font-bold text-neutral-950 hover:brightness-110 cursor-pointer"
              >
                Parametrləri Yadda Saxla
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
