import React from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141446] border border-white/10 p-6 shadow-2xl text-white space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-3">
          {type === 'success' ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          ) : (
            <XCircle className="w-12 h-12 text-red-400" />
          )}
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-slate-300">{message}</p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] cursor-pointer"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};
