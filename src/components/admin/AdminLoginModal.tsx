import React, { useState } from 'react';
import { ForwardOneLogo } from '../ForwardOneLogo';
import { Lock, KeyRound, ShieldCheck, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (err) {
        console.error("Non-JSON response received from server", err);
      }

      if (res.ok && data.token) {
        onLoginSuccess(data.token);
        setPassword('');
      } else {
        setErrorMsg(data.error || 'Mot de passe administrateur incorrect.');
      }
    } catch (e) {
      setErrorMsg('Impossible de joindre le serveur de sécurité. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#141446] border border-[#6C68F4] p-6 sm:p-8 space-y-6 text-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#6C68F4]/20 text-[#6C68F4]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Back-Office Administrateur</h3>
              <p className="text-[11px] text-[#00C2C2]">Espace d'Administration Sécurisé Forward One</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Preview */}
        <div className="text-center py-2">
          <ForwardOneLogo variant="light" size="sm" showTagline={true} />
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mot de passe d'Accès Sécurisé
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Entrez votre mot de passe..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 italic">
              Accès réservé aux administrateurs.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] shadow-lg shadow-[#6C68F4]/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Vérification...' : 'Se Connecter au Back-Office'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
