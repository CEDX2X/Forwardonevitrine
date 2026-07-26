import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Link as LinkIcon, Loader2, Check } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  adminToken: string;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  adminToken,
  label = "Illustration / Image"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, etc.).');
      return;
    }

    // Limit size if needed, e.g. 15MB
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("L'image est trop lourde (max 15 Mo).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileData = reader.result as string;

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            fileData,
            fileName: file.name
          })
        });

        const data = await res.json();
        if (res.ok && data.url) {
          onChange(data.url);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        } else {
          setUploadError(data.error || "Échec du téléversement de l'image.");
        }
        setIsUploading(false);
      };

      reader.onerror = () => {
        setUploadError('Erreur de lecture du fichier image.');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Erreur réseau lors du téléversement.');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-200">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#00C2C2] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? "Uploader un fichier" : "Saisir une URL directe"}</span>
        </button>
      </div>

      {/* Image Preview if value exists */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-white/20 bg-black/40 p-2 flex items-center gap-3">
          <img
            src={value}
            alt="Aperçu"
            className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-white/10 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-medium text-white truncate">{value}</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Image active</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Supprimer l'image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* URL Input field if toggled */}
      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
          />
        </div>
      ) : (
        /* Dropzone & Browse Button */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#00C2C2] bg-[#00C2C2]/10'
              : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 text-[#00C2C2] animate-spin" />
                <span className="text-xs font-semibold text-slate-300">Téléversement de l'image en cours...</span>
              </>
            ) : uploadSuccess ? (
              <>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-emerald-400">Image téléchargée avec succès !</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-[#6C68F4]/20 text-[#6C68F4] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Cliquez ou glissez une image ici
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Format JPG, PNG, WEBP — Depuis PC ou Smartphone (iPhone / Android)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-rose-400 font-medium">{uploadError}</p>
      )}
    </div>
  );
};
