import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Link as LinkIcon, Loader2, Check } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  adminToken: string;
  label?: string;
}

// Helper function to convert uploaded images to ultra-sharp HD Data URLs for permanent storage in Firestore
function compressImageToDataUrl(file: File, maxWidth = 2560, maxHeight = 2560, quality = 0.96): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const originalDataUrl = e.target?.result as string;
      
      // If original image is under 750KB (~768,000 bytes), keep the exact 100% raw original file without re-encoding!
      if (file.size <= 750 * 1024) {
        return resolve(originalDataUrl);
      }

      const img = new Image();
      img.onload = () => {
        const processCanvas = (w: number, h: number, q: number, format: 'image/webp' | 'image/jpeg' = 'image/webp'): string => {
          let width = img.width;
          let height = img.height;

          if (width > w || height > h) {
            if (width / height > w / h) {
              height = Math.round((height * w) / width);
              width = w;
            } else {
              width = Math.round((width * h) / height);
              height = h;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return originalDataUrl;
          }

          // Use highest quality image smoothing algorithms
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);
          
          try {
            return canvas.toDataURL(format, q);
          } catch {
            return canvas.toDataURL('image/jpeg', q);
          }
        };

        // Try Ultra HD 2560px WebP at 0.96 maximum sharpness first
        let dataUrl = processCanvas(maxWidth, maxHeight, quality, 'image/webp');

        // Fallback checks to fit Firestore document limits (~850KB max string length)
        if (dataUrl.length > 850000) {
          dataUrl = processCanvas(2048, 2048, 0.92, 'image/webp');
        }
        if (dataUrl.length > 850000) {
          dataUrl = processCanvas(1800, 1800, 0.88, 'image/jpeg');
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Erreur de décodage de l'image."));
      img.src = originalDataUrl;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (rawUrl: string) => {
    // Sanitize URL by trimming quotes and whitespace
    const cleaned = rawUrl.trim().replace(/^["']|["']$/g, '');
    onChange(cleaned);
  };

  const handleFileChange = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("L'image est trop lourde (max 10 Mo).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // 1. Compress image client-side to lightweight Data URL (~50KB-150KB)
      const compressedDataUrl = await compressImageToDataUrl(file);

      // 2. Also notify backend endpoint (for logging / authorization check)
      let finalUrl = compressedDataUrl;
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            fileData: compressedDataUrl,
            fileName: file.name
          })
        });

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          if (data.url) finalUrl = data.url;
        }
      } catch (uploadErr) {
        // Safe fallback to client compressed image
      }

      // 3. Save persistent base64 Data URL to state (will be saved in Firestore permanently)
      onChange(finalUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      setIsUploading(false);
    } catch (err: any) {
      console.error('Image processing error:', err);
      setUploadError(err.message || 'Erreur lors du traitement de l\'image.');
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
    <div className="space-y-3 p-3.5 rounded-2xl bg-black/20 border border-white/10">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-white flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#00C2C2]" />
          <span>{label}</span>
        </label>
        {value && (
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ✓ Image Définie
          </span>
        )}
      </div>

      {/* Image Preview if value exists */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-emerald-500/30 bg-emerald-950/20 p-2.5 flex items-center gap-3">
          <img
            src={value}
            alt="Aperçu"
            className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-white/20 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex-1 min-w-0 text-xs space-y-0.5">
            <p className="font-bold text-white truncate">{value.startsWith('data:') ? 'Image Fichier Téléversée (Base64)' : value}</p>
            <p className="text-[10px] text-emerald-300 font-semibold">Image enregistrée & prête à être publiée</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Effacer l'image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mode 1: URL Input Field */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
          <span className="flex items-center gap-1">
            <LinkIcon className="w-3 h-3 text-[#00C2C2]" />
            Lien URL d'image web :
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://images.unsplash.com/... ou https://..."
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
        />
      </div>

      {/* Mode 2: Dropzone & File Browse Button */}
      <div className="space-y-1">
        <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
          <Upload className="w-3 h-3 text-[#6C68F4]" />
          Ou importer un fichier image depuis votre appareil :
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
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

          <div className="flex flex-col items-center justify-center gap-1.5">
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 text-[#00C2C2] animate-spin" />
                <span className="text-xs font-semibold text-slate-300">Téléversement et optimisation en cours...</span>
              </>
            ) : uploadSuccess ? (
              <>
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-emerald-400">Image importée avec succès !</span>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold text-slate-200">
                  Cliquez ici pour choisir une photo (JPG, PNG, WEBP)
                </span>
                <span className="text-[10px] text-slate-400">
                  Jusqu'à 10 Mo max — Compatible iPhone, Android, PC et Mac
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {uploadError && (
        <p className="text-[11px] text-rose-400 font-medium">{uploadError}</p>
      )}
    </div>
  );
};
