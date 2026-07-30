import React, { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

interface AdminPasswordFormProps {
  adminToken: string;
}

export const AdminPasswordForm: React.FC<AdminPasswordFormProps> = ({ adminToken }) => {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (res.ok) {
        alert('Mot de passe mis à jour avec succès.');
        setNewPassword('');
      } else {
        const err = await res.json();
        alert(err.error || 'Erreur lors de la mise à jour.');
      }
    } catch (e) {
      alert('Erreur serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="p-6 rounded-2xl bg-[#141446] border border-white/10 space-y-4 max-w-lg">
      <h3 className="text-lg font-bold text-white">Changer le mot de passe</h3>
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Nouveau mot de passe</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            placeholder="Min 6 caractères"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 w-full"
      >
        <ShieldCheck className="w-4 h-4" />
        {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
      </button>
    </form>
  );
};
