import React, { useState } from 'react';
import { CategoryType } from '../types';
import { X, Send, CheckCircle2, FileText } from 'lucide-react';

interface DevisModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedItem?: string;
}

export const DevisModal: React.FC<DevisModalProps> = ({
  isOpen,
  onClose,
  preselectedItem
}) => {
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [moduleType, setModuleType] = useState<CategoryType>('Marketing Digital');
  const [budgetRange, setBudgetRange] = useState('1 000 000 FCFA - 3 000 000 FCFA');
  const [targetDate, setTargetDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [description, setDescription] = useState(preselectedItem ? `Demande concernant : ${preselectedItem}\n` : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          company,
          email,
          phone,
          moduleType,
          budgetRange,
          targetDate,
          eventLocation,
          description,
          selectedItems: preselectedItem ? [preselectedItem] : []
        })
      });

      if (res.ok) {
        setSubmittedSuccess(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Erreur lors de la soumission de la demande.');
      }
    } catch (e) {
      alert('Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#141446] border border-[#6C68F4]/40 p-6 sm:p-8 space-y-6 text-white shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#6C68F4]/20 text-[#6C68F4]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Formulaire de Devis Sur-Mesure</h3>
              <p className="text-xs text-[#00C2C2] font-medium">Forward One — Marketing Digital & Logistique</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-white">Demande Transmise avec Succès !</h4>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Merci <strong className="text-white">{clientName}</strong>. Notre équipe étudie votre projet et vous transmettra votre devis personnalisé sous 24h ouvrées.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#6C68F4] hover:bg-[#5b57e0] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {preselectedItem && (
              <div className="p-3 rounded-xl bg-[#6C68F4]/15 border border-[#6C68F4]/30 text-xs text-[#00C2C2] flex items-center justify-between">
                <span>Élément pré-sélectionné : <strong>{preselectedItem}</strong></span>
              </div>
            )}

            {/* Module Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Module concerné *</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Marketing Digital', 'Logistique Événementielle', 'Les Deux'] as const).map((mod) => (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setModuleType(mod)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      moduleType === mod
                        ? 'bg-[#6C68F4] text-white border border-[#6C68F4]'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom Complet / Incomplet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alexandre Martin"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Société / Organisation</label>
                <input
                  type="text"
                  placeholder="Ex: Groupe Horizon SA"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Email *</label>
                <input
                  type="email"
                  required
                  placeholder="alexandre@societe.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Numéro de Téléphone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+237 6 90 00 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>
            </div>

            {/* Budget & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Budget Estimé</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0d2e] border border-white/15 text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                >
                  <option value="Moins de 1 000 000 FCFA">Moins de 1 000 000 FCFA</option>
                  <option value="1 000 000 FCFA - 3 000 000 FCFA">1 000 000 FCFA - 3 000 000 FCFA</option>
                  <option value="3 000 000 FCFA - 10 000 000 FCFA">3 000 000 FCFA - 10 000 000 FCFA</option>
                  <option value="Plus de 10 000 000 FCFA">Plus de 10 000 000 FCFA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date Souhaitée / Événement</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lieu de Prestation</label>
                <input
                  type="text"
                  placeholder="Ex: Douala, Yaoundé, Kribi..."
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description détaillée du Projet *</label>
              <textarea
                required
                rows={4}
                placeholder="Précisez vos besoins : objectifs marketing, nombre d'invités, besoins en sonorisation/éclairage..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
              ></textarea>
            </div>

            {/* Form Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                ⚡ Réponse sous 24 heures ouvrées.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] shadow-lg shadow-[#6C68F4]/30 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmission...' : 'Envoyer ma Demande de Devis'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
