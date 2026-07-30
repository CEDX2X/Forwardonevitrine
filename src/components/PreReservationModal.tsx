import React, { useState, useEffect } from 'react';
import { ProductItem, PreReservationEquipment, PreReservationItem } from '../types';
import { X, Calendar, ShoppingBag, Plus, Minus, Trash2, Send, CheckCircle2, Mail, ShieldAlert } from 'lucide-react';
import { createPreReservation } from '../lib/firebaseStore';

interface PreReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableProducts: ProductItem[];
  preselectedProduct?: ProductItem | null;
}

export const PreReservationModal: React.FC<PreReservationModalProps> = ({
  isOpen,
  onClose,
  availableProducts,
  preselectedProduct
}) => {
  const [selectedItems, setSelectedItems] = useState<PreReservationEquipment[]>([]);
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 4);
    return next.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState('Douala & Yaoundé, Cameroun');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedData, setCompletedData] = useState<any | null>(null);

  // Sync preselected product if passed
  useEffect(() => {
    if (preselectedProduct) {
      const exists = selectedItems.find((i) => i.id === preselectedProduct.id);
      if (!exists) {
        setSelectedItems([
          {
            id: preselectedProduct.id,
            name: preselectedProduct.name,
            quantity: 1,
            dailyRate: preselectedProduct.dailyRate
          }
        ]);
      }
    } else if (selectedItems.length === 0 && availableProducts.length > 0) {
      // Default to first product
      setSelectedItems([
        {
          id: availableProducts[0].id,
          name: availableProducts[0].name,
          quantity: 1,
          dailyRate: availableProducts[0].dailyRate
        }
      ]);
    }
  }, [preselectedProduct, availableProducts]);

  if (!isOpen) return null;

  // Calculate Duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(end.getTime() - start.getTime(), 86400000);
  const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // Calculate Total Estimate
  const totalDailyRate = selectedItems.reduce((sum, item) => sum + item.dailyRate * item.quantity, 0);
  const grandTotal = totalDailyRate * durationDays;

  const handleAddItem = (productId: string) => {
    const prod = availableProducts.find((p) => p.id === productId);
    if (!prod) return;

    const existingIndex = selectedItems.findIndex((i) => i.id === prod.id);
    if (existingIndex > -1) {
      const updated = [...selectedItems];
      updated[existingIndex].quantity += 1;
      setSelectedItems(updated);
    } else {
      setSelectedItems([
        ...selectedItems,
        { id: prod.id, name: prod.name, quantity: 1, dailyRate: prod.dailyRate }
      ]);
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setSelectedItems(
      selectedItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PreReservationEquipment[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Veuillez ajouter au moins un équipement.');
      return;
    }

    if (grandTotal < 250000) {
      alert('Le montant minimum de budget pour soumettre un devis ou une pré-réservation est de 250 000 FCFA. Veuillez ajouter d\'autres équipements ou ajuster la durée.');
      return;
    }

    setIsSubmitting(true);

    const resObj: PreReservationItem = {
      id: 'res_' + Date.now(),
      clientName,
      company,
      email,
      phone,
      equipmentDetails: selectedItems,
      startDate,
      endDate,
      durationDays,
      totalEstimate: grandTotal,
      location,
      notes,
      status: 'en_attente',
      createdAt: new Date().toISOString()
    };

    try {
      let submitted = false;
      try {
        const res = await fetch('/api/prereservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resObj)
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.reservation) {
            setCompletedData(data.reservation);
            submitted = true;
          }
        }
      } catch (err) {}

      if (!submitted) {
        await createPreReservation(resObj);
        setCompletedData(resObj);
      }
    } catch (err) {
      alert('Erreur lors de la pré-réservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0d0d2e] border border-[#00C2C2]/40 p-4 sm:p-8 space-y-5 sm:space-y-6 text-white shadow-2xl my-4 sm:my-8 max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#00C2C2]/20 text-[#00C2C2] shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">Pré-réservation de Matériel Événementiel</h3>
              <p className="text-[11px] sm:text-xs text-[#FFAD5B] font-medium">Validation instantanée du stock & Envoi d'Emails de notification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {completedData ? (
          /* Confirmation View with Double Email Simulation */
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-base text-white">Pré-réservation enregistrée avec succès !</h4>
                <p className="text-xs mt-1">
                  Deux notifications email automatiques ont été générées : une copie de confirmation envoyée au client et une alerte de sécurité transmise à l'administrateur Forward One.
                </p>
              </div>
            </div>

            {/* Simulated Email Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Email Client */}
              <div className="p-4 rounded-xl bg-[#141446] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00C2C2] pb-2 border-b border-white/10">
                  <Mail className="w-4 h-4" />
                  <span>Email envoyé au Client ({completedData.email})</span>
                </div>
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                  {completedData.emailNotificationSent?.clientEmailContent}
                </pre>
              </div>

              {/* Email Admin */}
              <div className="p-4 rounded-xl bg-[#141446] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFAD5B] pb-2 border-b border-white/10">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Alerte envoyée à l'Admin (Back-Office)</span>
                </div>
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                  {completedData.emailNotificationSent?.adminEmailContent}
                </pre>
              </div>

            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setCompletedData(null);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-[#00C2C2] hover:bg-[#00a3a3] cursor-pointer"
              >
                Terminer & Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            {/* Equipment Cart List */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#00C2C2]" />
                  <span>Équipements Sélectionnés ({selectedItems.length})</span>
                </label>

                {/* Quick Add Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItem(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                >
                  <option value="" className="bg-[#141446]">＋ Ajouter un équipement...</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#141446]">
                      {p.name} ({p.dailyRate.toLocaleString()} FCFA/j)
                    </option>
                  ))}
                </select>
              </div>

              {selectedItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs text-slate-400">
                  Aucun matériel dans votre panier de réservation.
                </div>
              ) : (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 space-y-2.5 max-h-56 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-[#141446] border border-white/10 text-xs">
                      <div className="font-semibold text-white flex-1 min-w-0">
                        <span className="block truncate">{item.name}</span>
                        <span className="text-[11px] text-slate-400 sm:hidden">{item.dailyRate.toLocaleString()} FCFA/j</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <span className="text-slate-400 hidden sm:inline">{item.dailyRate.toLocaleString()} FCFA/j</span>

                        <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-white px-1.5 min-w-[20px] text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-bold text-[#FFAD5B] w-24 text-right">
                          {(item.dailyRate * item.quantity).toLocaleString()} FCFA
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-rose-400 hover:text-rose-300 p-1 ml-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dates & Cost Calculation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#141446] border border-white/10">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date de Début *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date de Fin *</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div className="flex flex-col justify-center text-left sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
                <div className="text-[11px] text-slate-400">Durée : <strong className="text-white">{durationDays} jour(s)</strong></div>
                <div className="text-xs text-slate-400 mt-1">Estimation Totale :</div>
                <div className="text-lg sm:text-xl font-black text-[#00C2C2]">{grandTotal.toLocaleString()} FCFA HT</div>
                {grandTotal < 250000 && (
                  <div className="text-[10px] text-amber-400 font-medium mt-1">
                    ⚠️ Budget min. requis: 250 000 FCFA
                  </div>
                )}
              </div>
            </div>

            {/* Client Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nom Complet / Responsable *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sophie Mercier"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Société / Entité</label>
                <input
                  type="text"
                  placeholder="Ex: Agence Événements X"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse Email *</label>
                <input
                  type="email"
                  required
                  placeholder="sophie@agence.cm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone Direct *</label>
                <input
                  type="tel"
                  required
                  placeholder="+237 6 98 76 54 32"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lieu de livraison / Retrait *</label>
              <input
                type="text"
                required
                placeholder="Ex: Palais des Sports de Yaoundé, Hôtel Sawa Douala..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notes ou contraintes particulières</label>
              <textarea
                rows={2}
                placeholder="Heures d'accès, besoins en régisseur technique sur place..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 text-center sm:text-left whitespace-nowrap">
                📩 Envoi immédiat de l'email de confirmation.
              </span>

              <button
                type="submit"
                disabled={isSubmitting || selectedItems.length === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 rounded-xl font-bold text-xs text-slate-950 bg-[#00C2C2] hover:bg-[#00a3a3] shadow-lg cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{isSubmitting ? 'Pré-réservation en cours...' : 'Valider la Pré-réservation'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
