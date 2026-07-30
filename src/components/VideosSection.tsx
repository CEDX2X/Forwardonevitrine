import React, { useState } from 'react';
import { SiteContent, VideoCardItem } from '../types';
import { Play, X, Video, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideosSectionProps {
  siteContent: SiteContent;
  theme?: 'light' | 'dark';
}

export const VideosSection: React.FC<VideosSectionProps> = ({ siteContent, theme = 'light' }) => {
  const isLight = theme === 'light';
  const videoCards = siteContent.videoCards || [];
  const [activeVideoModal, setActiveVideoModal] = useState<VideoCardItem | null>(null);

  if (videoCards.length === 0) return null;

  // Helper to convert standard YouTube links into embed URLs if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    }
    return url;
  };

  return (
    <section id="videos" className={`pt-16 pb-8 transition-colors duration-200 relative overflow-hidden ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#141446] text-white'
    }`}>
      {/* Subtle geometric grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#6C68F4_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            isLight ? 'bg-slate-100 text-[#102A6B] border border-slate-200 shadow-xs' : 'bg-[#6C68F4]/20 text-[#00C2C2] border border-[#6C68F4]/30'
          }`}>
            <Video className="w-3.5 h-3.5 text-[#5362DC]" />
            <span>Réalisations & Média</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
            {siteContent.videoSectionTitle || "Forward One en Action"}
          </h2>

          <p className={`text-base leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {siteContent.videoSectionSubtitle || "Découvrez nos réalisations en vidéos : régies événements, tournages, shows lumière et créations web."}
          </p>
        </motion.div>

        {/* Grid de vidéos élégamment dimensionnées et aérées avec espaces clairs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
          {videoCards.map((video, idx) => (
            <motion.div
              key={video.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setActiveVideoModal(video)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.015] w-full aspect-[16/10] min-h-[230px] sm:min-h-[250px] ${
                isLight 
                  ? 'bg-slate-900 border border-slate-200 ring-1 ring-slate-900/5' 
                  : 'bg-slate-900 border border-white/20 ring-1 ring-white/10'
              }`}
            >
              {/* Card Thumbnail Image */}
              <img
                src={video.thumbnailImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/95 group-hover:via-black/50 transition-all" />

              {/* Top Badge */}
              {video.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#00C2C2] border border-white/20 shadow-sm">
                    {video.badge}
                  </span>
                </div>
              )}

              {/* Top Right Play Button - Modéré & Elégant */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-9.5 h-9.5 rounded-full bg-black/70 text-white flex items-center justify-center shadow-md border border-white/25 backdrop-blur-md group-hover:bg-[#6C68F4] group-hover:scale-110 group-hover:border-[#6C68F4] transition-all duration-300">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Title & Subtitle ON Top of the Video Card */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 space-y-1.5 text-left">
                <h3 className="font-bold text-white text-base sm:text-lg leading-snug drop-shadow-md group-hover:text-[#00C2C2] transition-colors line-clamp-2">
                  {video.title}
                </h3>
                {video.subtitle && (
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed drop-shadow-sm font-normal">
                    {video.subtitle}
                  </p>
                )}
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* Video Modal Player Popup */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-white/20 overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-950/90 border-b border-white/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-[#00C2C2] uppercase tracking-wider block">
                    {activeVideoModal.badge || "Vidéo Forward One"}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {activeVideoModal.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  title="Fermer la vidéo"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Container */}
              <div className="relative aspect-video w-full bg-black">
                {activeVideoModal.videoUrl.endsWith('.mp4') || activeVideoModal.videoUrl.endsWith('.webm') ? (
                  <video
                    src={activeVideoModal.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(activeVideoModal.videoUrl)}
                    title={activeVideoModal.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              {/* Video Description Footer */}
              {activeVideoModal.subtitle && (
                <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-white/10 text-xs text-slate-300">
                  <p>{activeVideoModal.subtitle}</p>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
