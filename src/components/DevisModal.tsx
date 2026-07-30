import React, { useState } from 'react';
import { CategoryType, QuoteRequestItem } from '../types';
import { X, Send, CheckCircle2, FileText } from 'lucide-react';
import { createDevis } from '../lib/firebaseStore';

interface DevisModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedItem?: string;
  theme?: 'light' | 'dark';
}

export const DevisModal: React.FC<DevisModalProps> = ({
  isOpen,
  onClose,
  preselectedItem,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [moduleType, setModuleType] = useState<CategoryType>('Marketing Digital');
  const [budgetRange, setBudgetRange] = useState('250 000 FCFA - 1 000 000 FCFA');
  const [targetDate, setTargetDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [description, setDescription] = useState(preselectedItem ? `Demande concernant : ${preselectedItem}\n` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: QuoteRequestItem = {
      id: 'devis_' + Date.now(),
      clientName,
      company,
      email,
      phone,
      moduleType,
      budgetRange,
      targetDate,
      eventLocation,
      description,
      selectedItems: preselectedItem ? [preselectedItem] : [],
      status: 'nouvelle',
      createdAt: new Date().toISOString()
    };

    try {
      let submitted = false;
      try {
        const res = await fetch('/api/devis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          submitted = true;
        }
      } catch (e) {}

      if (!submitted) {
        await createDevis(payload);
      }

      setSubmittedSuccess(true);
    } catch (e) {
      alert('Erreur lors de la soumission de la demande.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border p-4 sm:p-8 space-y-5 shadow-2xl my-4 sm:my-8 max-h-[92vh] overflow-y-auto ${
        isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#141446] text-white border-[#6C68F4]/40'
      }`}>
        
        {/* Header */}
        <div className={`flex items-start justify-between border-b pb-3 sm:pb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`p-2 sm:p-2.5 rounded-xl ${isLight ? 'bg-[#5362DC]/10 text-[#5362DC]' : 'bg-[#6C68F4]/20 text-[#6C68F4]'}`}>
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className={`text-lg sm:text-2xl font-bold ${isLight ? 'text-black' : 'text-white'}`}>Demande d'Offre Personnalisée</h3>
              <p className={`text-[11px] sm:text-xs font-medium ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>Forward One — Marketing Digital & Logistique</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-8 sm:py-12 text-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-black' : 'text-white'}`}>Demande Transmise avec Succès !</h4>
            <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Merci <strong className={isLight ? 'text-black' : 'text-white'}>{clientName}</strong>. Notre équipe étudie votre projet et vous transmettra votre devis personnalisé sous 24h ouvrées.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer ${isLight ? 'bg-[#5362DC] hover:bg-[#4351c4]' : 'bg-[#6C68F4] hover:bg-[#5b57e0]'}`}
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            
            {preselectedItem && (
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${isLight ? 'bg-[#5362DC]/10 border-[#5362DC]/30 text-[#5362DC]' : 'bg-[#6C68F4]/15 border-[#6C68F4]/30 text-[#00C2C2]'}`}>
                <span>Élément pré-sélectionné : <strong className={isLight ? 'text-black' : 'text-white'}>{preselectedItem}</strong></span>
              </div>
            )}

            {/* Module Selection */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Module concerné *</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['Marketing Digital', 'Logistique Événementielle', 'Les Deux'] as const).map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setModuleType(mod)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                      moduleType === mod
                        ? (isLight ? 'bg-[#5362DC] text-white shadow-sm' : 'bg-[#6C68F4] text-white shadow-sm')
                        : (isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10')
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Nom Complet / Incomplet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alexandre Martin"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]' : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Société / Organisation</label>
                <input
                  type="text"
                  placeholder="Ex: Groupe Horizon SA"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]' : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Adresse Email *</label>
                <input
                  type="email"
                  required
                  placeholder="alexandre@societe.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]' : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Numéro de Téléphone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+237 6 90 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]' : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'}`}
                />
              </div>
            </div>

            {/* Budget & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Budget Estimé <span className="text-[10px] font-normal text-amber-500">(Min: 250 000 FCFA)</span>
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-[#5362DC]' : 'bg-[#0d0d2e] border-white/15 text-white focus:border-[#00C2C2]'}`}
                >
                  <option value="250 000 FCFA - 1 000 000 FCFA">250 000 FCFA - 1 000 000 FCFA</option>
                  <option value="1 000 000 FCFA - 3 000 000 FCFA">1 000 000 FCFA - 3 000 000 FCFA</option>
                  <option value="3 000 000 FCFA - 10 000 000 FCFA">3 000 000 FCFA - 10 000 000 FCFA</option>
                  <option value="Plus de 10 000 000 FCFA">Plus de 10 000 000 FCFA</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Date Souhaitée / Événement</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black focus:border-[#5362DC]' : 'bg-white/5 border-white/15 text-white focus:border-[#00C2C2]'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Lieu de Prestation</label>
                <input
                  type="text"
                  placeholder="Ex: Douala, Yaoundé, Kribi..."
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]' : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'}`}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Description détaillée du Projet *</label>
              <textarea
                required
                rows={4}
                placeholder="Précisez vos besoins : objectifs marketing, nombre d'invités, besoins en sonorisation/éclairage..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${isLight ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]' : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'}`}
              ></textarea>
            </div>

            {/* Form Footer */}
            <div className={`pt-3 border-t flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <span className={`text-[11px] whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                ⚡ Réponse sous 24 heures ouvrées.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white cursor-pointer disabled:opacity-50 whitespace-nowrap ${isLight ? 'bg-[#5362DC] hover:bg-[#4351c4]' : 'bg-[#6C68F4] hover:bg-[#5b57e0]'}`}
              >
                <Send className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{isSubmitting ? 'Transmission...' : 'Envoyer ma Demande de Devis'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
