import React, { useState } from 'react';
import { Villa, VerificationBadgeType } from '../data/villas';
import {
  X,
  ShieldCheck,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Lock,
  Camera,
  AlertCircle,
} from 'lucide-react';

interface HostVerificationModalProps {
  isOpen: boolean;
  villas: Villa[];
  selectedVillaId?: string;
  onClose: () => void;
  onUpdateVerification: (villaId: string, status: VerificationBadgeType, details: Villa['verificationDetails']) => void;
}

export const HostVerificationModal: React.FC<HostVerificationModalProps> = ({
  isOpen,
  villas,
  selectedVillaId,
  onClose,
  onUpdateVerification,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'submit' | 'admin'>('submit');
  const [villaId, setVillaId] = useState<string>(selectedVillaId || villas[0]?.id || '');
  const [finCode, setFinCode] = useState('');
  const [idSeries, setIdSeries] = useState('');
  const [kupchaNumber, setKupchaNumber] = useState('');
  const [videoTourUrl, setVideoTourUrl] = useState('');
  const [requestInPersonInspection, setRequestInPersonInspection] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Admin moderation state
  const [adminSelectedVillaId, setAdminSelectedVillaId] = useState<string>(villas[0]?.id || '');

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedSuccess(true);
    // Mark as pending or document_verified for demo
    onUpdateVerification(villaId, 'document_verified', {
      kupchaNumber: kupchaNumber || 'AZ-DƏDRX-AUTO-9988',
      verifiedAt: new Date().toISOString().split('T')[0],
      notes: 'Mülkiyyətçi tərəfindən Ş/V və çıxarış təqdim edilib.',
      videoTourUrl,
    });
  };

  const handleAdminApprove = (vId: string, status: VerificationBadgeType) => {
    onUpdateVerification(vId, status, {
      kupchaNumber: 'AZ-DƏDRX-VERIFIED-' + Math.floor(100000 + Math.random() * 900000),
      inspectorName: status === 'in_person_verified' ? 'bagevim Ekspert Qrupu (Yerində Çəkiliş)' : 'Hüquq Departamenti',
      verifiedAt: new Date().toISOString().split('T')[0],
      notes: status === 'in_person_verified' ? 'Yerində video və foto çəkiliş aparılıb, isti hovuz təsdiqlənib.' : 'Kupça və Ş/V bazadan yoxlanılıb.',
    });
  };

  const currentAdminVilla = villas.find((v) => v.id === adminSelectedVillaId) || villas[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-modal-title"
    >
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-neutral-900 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 font-bold shadow-lg shadow-amber-500/20">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h3 id="verification-modal-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>"Yoxlanılmış Ev" (Verified) Təhlükəsizlik Sistemi</span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Dələduzluğun qarşısını almaq üçün Çıxarış (Kupça), Ş/V və Yerində Çəkiliş Doğrulaması
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

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-white/10 px-6 py-3 bg-neutral-950/50">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Ev Sahibi üçün Sənəd Təqdimatı</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Admin / Təhlükəsizlik Paneli</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'submit' ? (
            /* HOST SUBMISSION TAB */
            <div>
              {!submittedSuccess ? (
                <form onSubmit={handleSubmitVerification} className="space-y-5">
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200 flex items-start gap-3">
                    <Lock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-bold mb-1">Məxfilik və Təhlükəsizlik Zəmanəti:</strong>
                      Təqdim etdiyiniz Şəxsiyyət vəsiqəsi və Daşınmaz əmlakın çıxarışı (Kupça) heç bir halda saytda və ya müştərilərə göstərilmir. Məlumatlar yalnız daxili admin paneldə komandamız tərəfindən yoxlanılır və "Yoxlanılmış Ev" nişanı verilir.
                    </div>
                  </div>

                  {/* Select Villa */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Doğrulanacaq Bağ Evi / Villa:
                    </label>
                    <select
                      value={villaId}
                      onChange={(e) => setVillaId(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                      {villas.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title} ({v.region} - {v.zone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ID / FIN Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Ş/V FİN Kodu (7 simvol):
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={7}
                        placeholder="Məs: 7AB89CD"
                        value={finCode}
                        onChange={(e) => setFinCode(e.target.value.toUpperCase())}
                        className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs font-mono uppercase text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-neutral-300 block mb-1">
                        Ş/V Seriya və Nömrəsi:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Məs: AZE 12345678"
                        value={idSeries}
                        onChange={(e) => setIdSeries(e.target.value.toUpperCase())}
                        className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs font-mono uppercase text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Kupcha / Extract */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Daşınmaz Əmlakın Çıxarışı (Kupça) Reyestr Nömrəsi:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Məs: AZ-DƏDRX-1029481"
                      value={kupchaNumber}
                      onChange={(e) => setKupchaNumber(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* Video Verification Upload */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1">
                      Evin Real Video-Görüntüsü (Video linki və ya fayl):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={videoTourUrl}
                        onChange={(e) => setVideoTourUrl(e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-neutral-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setVideoTourUrl('https://storage.googleapis.com/bagevim/sample-video-tour.mp4')}
                        className="rounded-xl border border-white/15 bg-neutral-800 px-3 py-2 text-xs text-neutral-300 hover:text-white cursor-pointer"
                      >
                        Nümunə Video
                      </button>
                    </div>
                  </div>

                  {/* Request In-Person Inspection Checkbox */}
                  <label className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestInPersonInspection}
                      onChange={(e) => setRequestInPersonInspection(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-amber-400 text-amber-500 focus:ring-amber-400"
                    />
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Camera className="h-4 w-4 text-amber-400" />
                        <span>bagevim.az Komandası Yerində Çəkiliş və Baxış Etsin</span>
                        <span className="rounded-full bg-amber-400 text-neutral-950 font-extrabold text-[10px] px-2 py-0.5">
                          Tövsiyə olunur
                        </span>
                      </span>
                      <p className="text-[11px] text-neutral-300 mt-1">
                        Komandamız ünvana gələrək peşəkar foto/video çəkir, isti hovuzu və komfortu yoxlayır, evinizə ən yüksək etibar dərəcəsi olan <strong>🛡️ "Yerində Yoxlanılmış Ev"</strong> nişanı verilir (Bu evlər 3 dəfə çox rezervasiya edilir).
                      </p>
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/25 hover:brightness-110 cursor-pointer"
                  >
                    Sənədləri Təsdiqə Göndər
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Sənədlər Təhlükəsizlik Xidmətinə Təqdim Edildi!</h4>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto">
                    Kupça nömrəsi ({kupchaNumber}) və Ş/V məlumatlarınız qəbul edildi. Təhlükəsizlik şöbəmiz sənədləri 2 saat ərzində yoxlayaraq evinizə <strong>"Yoxlanılmış Ev"</strong> nişanını aktiv edəcəkdir.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="rounded-full bg-neutral-800 px-6 py-2.5 text-xs font-bold text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Yeni Müraciət Təqdim Et
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ADMIN MODERATION TAB */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="text-xs text-neutral-400">
                  <span>Yoxlama üçün mülk seçin:</span>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                    Admin İcazəsi: Təsdiqlənib
                  </span>
                </div>
              </div>

              {/* Villa Selector for Admin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {villas.slice(0, 6).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setAdminSelectedVillaId(v.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      v.id === adminSelectedVillaId
                        ? 'border-amber-400 bg-amber-400/10 text-white'
                        : 'border-white/10 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <img src={v.imageUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{v.title}</div>
                      <div className="text-[10px] text-neutral-500">{v.region}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Current Selected Villa Inspection Card */}
              {currentAdminVilla && (
                <div className="rounded-2xl border border-white/15 bg-neutral-950 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{currentAdminVilla.title}</h4>
                      <p className="text-xs text-neutral-400">{currentAdminVilla.location}</p>
                    </div>
                    <div>
                      {currentAdminVilla.verificationStatus === 'in_person_verified' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Yerində Yoxlanılıb
                        </span>
                      )}
                      {currentAdminVilla.verificationStatus === 'document_verified' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 border border-blue-500/40 px-3 py-1 text-xs font-bold text-blue-300">
                          <FileCheck className="h-3.5 w-3.5" />
                          Kupça Təsdiqlənib
                        </span>
                      )}
                      {currentAdminVilla.verificationStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Yoxlama Gözləyir
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Document & Legal Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-neutral-900 p-3 space-y-1">
                      <span className="text-[11px] text-neutral-400 block font-semibold">Çıxarış (Kupça) Qeydiyyatı:</span>
                      <p className="font-mono font-bold text-amber-400">
                        {currentAdminVilla.verificationDetails?.kupchaNumber || 'AZ-DƏDRX-1029481'}
                      </p>
                      <span className="text-[10px] text-neutral-500 block">Dövlət Reyestri ilə tutuşdurulub</span>
                    </div>

                    <div className="rounded-xl bg-neutral-900 p-3 space-y-1">
                      <span className="text-[11px] text-neutral-400 block font-semibold">Mülkiyyətçi / Əlaqə:</span>
                      <p className="font-bold text-white">{currentAdminVilla.hostContact.name}</p>
                      <span className="text-[10px] text-neutral-500 block font-mono">{currentAdminVilla.hostContact.phone}</span>
                    </div>
                  </div>

                  {/* Inspector Notes */}
                  <div className="rounded-xl bg-neutral-900 p-3 text-xs text-neutral-300">
                    <span className="text-[11px] text-neutral-400 block font-semibold mb-1">Müfəttiş Qeydi:</span>
                    <p>{currentAdminVilla.verificationDetails?.notes || 'Yerində çəkiliş tamamlanıb və parametrlər reallığa uyğundur.'}</p>
                  </div>

                  {/* Moderation Actions */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-xs font-bold text-neutral-300 block">Status Təyin Et:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleAdminApprove(currentAdminVilla.id, 'in_person_verified')}
                        className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>🛡️ "Yerində Yoxlanılmış" Nişanı Ver</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminApprove(currentAdminVilla.id, 'document_verified')}
                        className="flex items-center justify-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/60 hover:bg-sky-900 py-3 text-xs font-bold text-sky-200 transition-all cursor-pointer"
                      >
                        <FileCheck className="h-4 w-4" />
                        <span>📄 "Çıxarışlı Mülk" Nişanı Ver</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
