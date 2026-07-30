import React, { useState, useEffect } from 'react';
import { ForwardOneLogo } from '../ForwardOneLogo';
import { Lock, KeyRound, ShieldCheck, X, UserPlus, AlertCircle, RefreshCw } from 'lucide-react';
import { getAdminPassword, updateAdminPassword } from '../../lib/firebaseStore';

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
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Standard Login State
  const [password, setPassword] = useState('');

  // Initial Setup State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsCheckingStatus(true);
    setErrorMsg('');

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/status');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setIsConfigured(data.isConfigured);
        } else {
          // Direct Firestore Fallback
          const pass = await getAdminPassword();
          if (isMounted) setIsConfigured(!!pass);
        }
      } catch (e) {
        // Direct Firestore Fallback
        try {
          const pass = await getAdminPassword();
          if (isMounted) setIsConfigured(!!pass);
        } catch (err) {
          if (isMounted) setIsConfigured(false);
        }
      } finally {
        if (isMounted) setIsCheckingStatus(false);
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handler for Standard Login
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

      const data = await res.json();
      if (res.ok && data.token) {
        onLoginSuccess(data.token);
        setPassword('');
      } else if (data.isConfigured === false) {
        setIsConfigured(false);
        setErrorMsg('Aucun mot de passe configuré. Veuillez en définir un ci-dessous.');
      } else {
        setErrorMsg(data.error || 'Mot de passe administrateur incorrect.');
      }
    } catch (e) {
      // Direct Firestore check fallback
      try {
        const dbPass = await getAdminPassword();
        if (dbPass && password === dbPass) {
          onLoginSuccess(dbPass);
          setPassword('');
        } else if (!dbPass) {
          setIsConfigured(false);
          setErrorMsg('Aucun mot de passe configuré. Veuillez en définir un ci-dessous.');
        } else {
          setErrorMsg('Mot de passe administrateur incorrect.');
        }
      } catch (dbErr) {
        setErrorMsg('Impossible de vérifier l\'authentification.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for First-Time Setup
  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();
      if (res.ok && data.token) {
        // Automatically save in Firestore if needed and log in
        await updateAdminPassword(newPassword);
        onLoginSuccess(data.token);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Direct Firestore fallback
        await updateAdminPassword(newPassword);
        onLoginSuccess(newPassword);
      }
    } catch (e) {
      // Direct Firestore Fallback
      try {
        await updateAdminPassword(newPassword);
        onLoginSuccess(newPassword);
      } catch (dbErr: any) {
        setErrorMsg('Erreur lors de l\'enregistrement du mot de passe dans Firestore.');
      }
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
              {isConfigured === false ? <UserPlus className="w-5 h-5 text-amber-400" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isConfigured === false ? 'Premier Accès Administrateur' : 'Back-Office Administrateur'}
              </h3>
              <p className="text-[11px] text-[#00C2C2]">
                {isConfigured === false ? 'Configuration Initiale du Mot de Passe' : 'Espace d\'Administration Sécurisé Forward One'}
              </p>
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
        <div className="text-center py-1">
          <ForwardOneLogo variant="light" size="sm" showTagline={true} />
        </div>

        {isCheckingStatus ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-[#6C68F4]" />
            <span className="text-xs">Vérification du statut administrateur...</span>
          </div>
        ) : isConfigured === false ? (
          /* FIRST TIME SETUP FORM */
          <form onSubmit={handleSetupPassword} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Premier accès après déploiement</span>
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Aucun mot de passe administrateur n'est encore enregistré dans la base de données. Définissez votre mot de passe ci-dessous. Il sera automatiquement enregistré dans Firestore.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Choisissez votre Mot de Passe Administrateur
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  autoFocus
                  minLength={6}
                  placeholder="Minimum 6 caractères..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirmez le Mot de Passe
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Répétez le mot de passe..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Enregistrement dans Firestore...' : 'Créer le Mot de Passe & Se Connecter'}</span>
            </button>
          </form>
        ) : (
          /* STANDARD LOGIN FORM */
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
        )}

      </div>
    </div>
  );
};
