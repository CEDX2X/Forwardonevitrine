import React, { useState, useRef } from 'react';
import { Upload, Video, Trash2, Link as LinkIcon, Loader2, Check, Play } from 'lucide-react';

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  adminToken: string;
  label?: string;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  value,
  onChange,
  adminToken,
  label = "Source de la vidéo (Lien ou Fichier)"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (rawUrl: string) => {
    const cleaned = rawUrl.trim().replace(/^["']|["']$/g, '');
    onChange(cleaned);
  };

  const handleFileChange = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      setUploadError("Veuillez sélectionner un fichier vidéo (MP4, WebM, MOV) ou une image.");
      return;
    }

    // Limit to 30MB for browser memory and data url handling
    if (file.size > 30 * 1024 * 1024) {
      setUploadError("Le fichier vidéo est trop lourd (max 30 Mo). Privilégiez un lien YouTube ou MP4 compressé.");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const videoDataUrl = e.target?.result as string;

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-admin-token": adminToken
            },
            body: JSON.stringify({ fileData: videoDataUrl })
          });

          const data = await res.json();
          if (data.success && data.url) {
            onChange(data.url);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
          } else {
            // Fallback to storing raw data url directly
            onChange(videoDataUrl);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
          }
        } catch {
          // Direct client fallback
          onChange(videoDataUrl);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError("Erreur lors de la lecture du fichier vidéo.");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || "Erreur lors du chargement de la vidéo.");
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

  const isEmbed = value.includes('youtube.com') || value.includes('youtu.be') || value.includes('vimeo.com');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-200">
          {label}
        </label>
        {uploadSuccess && (
          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
            <Check className="w-3.5 h-3.5" /> Vidéo importée !
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* URL Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Video className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="Ex: https://www.youtube.com/embed/... ou lien fichier MP4"
            className="w-full pl-9 pr-9 py-2 bg-slate-900/80 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6C68F4]"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-rose-400 cursor-pointer"
              title="Effacer le lien"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Drag and drop upload box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
            isDragging
              ? 'border-[#00C2C2] bg-[#00C2C2]/10 scale-[1.01]'
              : 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileChange(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-2 text-[#00C2C2]">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Traitements et encodage de la vidéo...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1.5 py-1">
              <div className="w-8 h-8 rounded-full bg-[#6C68F4]/20 text-[#00C2C2] flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">
                Glissez un fichier vidéo ici ou cliquez pour parcourir
              </span>
              <span className="text-[10px] text-slate-400">
                Format MP4, WebM, MOV jusqu'à 30 Mo ou lien externe YouTube
              </span>
            </div>
          )}
        </div>

        {uploadError && (
          <p className="text-[11px] text-rose-400 font-medium">{uploadError}</p>
        )}

        {/* Video Preview */}
        {value && !isUploading && (
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 aspect-video max-h-48 flex items-center justify-center">
            {value.startsWith('data:video') || value.endsWith('.mp4') || value.endsWith('.webm') ? (
              <video
                src={value}
                controls
                className="w-full h-full object-contain"
              />
            ) : isEmbed ? (
              <div className="p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#6C68F4]/20 text-[#00C2C2] mx-auto flex items-center justify-center">
                  <Play className="w-5 h-5 fill-[#00C2C2]" />
                </div>
                <p className="text-xs font-bold text-white">Vidéo Externe (YouTube / Embed)</p>
                <p className="text-[10px] text-slate-400 truncate max-w-md mx-auto">{value}</p>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-300">
                Lien vidéo configuré : <span className="font-mono text-[#00C2C2]">{value.substring(0, 40)}...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
