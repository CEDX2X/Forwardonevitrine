import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Lock, Unlock, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

interface AdminPasswordFormProps {
  adminToken: string;
}

export const AdminPasswordForm: React.FC<AdminPasswordFormProps> = ({ adminToken }) => {
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/status');
      if (res.ok) {
        const data = await res.json();
        setIsLocked(data.isLocked);
      }
    } catch (e) {
      console.error('Failed to fetch admin status:', e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Mot de passe mis à jour avec succès. Le Back-Office est désormais verrouillé.'
        });
        setNewPassword('');
        setConfirmPassword('');
        setIsLocked(true);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePassword = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer le mot de passe ? L'accès au Back-Office deviendra totalement libre (sans mot de passe).")) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/password', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: 'success',
          text: 'Le mot de passe a été supprimé. L\'accès au Back-Office est désormais libre.'
        });
        setIsLocked(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erreur serveur lors de la suppression.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-[#141446] border border-white/10 space-y-5 max-w-2xl text-white">
      {/* Header Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isLocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold">Sécurité & Accès Back-Office</h3>
            <p className="text-xs text-slate-400">
              {isLocked === null
                ? 'Vérification du statut...'
                : isLocked
                ? 'Accès Protégé (Verrouillé par Mot de Passe)'
                : 'Accès Libre (Non Verrouillé par Mot de Passe)'}
            </p>
          </div>
        </div>

        {isLocked !== null && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
            isLocked
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
          }`}>
            {isLocked ? 'Verrouillé' : 'Accès Direct'}
          </span>
        )}
      </div>

      {/* Info Banner */}
      {isLocked === false && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong>Accès Libre par défaut :</strong> Le Back-Office est actuellement accessible à tout utilisateur cliquant sur "Admin". Vous pouvez le verrouiller ci-dessous en choisissant un mot de passe.
          </div>
        </div>
      )}

      {isLocked === true && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2.5 leading-relaxed">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <strong>Back-Office Sécurisé :</strong> L'accès est protégé par un mot de passe. Vous pouvez le modifier ou le supprimer à tout moment.
          </div>
        </div>
      )}

      {/* Alert Messages */}
      {message && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
            : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
        }`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Password Form */}
      <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
        <h4 className="text-xs font-bold text-[#00C2C2] uppercase tracking-wider">
          {isLocked ? 'Modifier le Mot de Passe' : 'Définir un Mot de Passe de Verrouillage'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isLocked ? 'Nouveau Mot de Passe' : 'Mot de Passe Administrateur'}
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min. 6 caractères..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Confirmer le Mot de Passe
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Confirmer..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Enregistrement...' : isLocked ? 'Mettre à jour le Mot de Passe' : 'Verrouiller le Back-Office'}</span>
          </button>

          {isLocked && (
            <button
              type="button"
              onClick={handleRemovePassword}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer le Mot de Passe (Déverrouiller)</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
