import React, { useState, useEffect } from 'react';
import { ArticleItem, CommentItem } from '../types';
import { Clock, Eye, Send, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';

interface BlogSectionProps {
  articles: ArticleItem[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments for selected article
  useEffect(() => {
    if (selectedArticle) {
      fetch(`/api/comments?articleId=${selectedArticle.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setComments(data);
        })
        .catch((err) => console.error('Failed to load comments:', err));
    }
  }, [selectedArticle]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim() || !selectedArticle) return;

    setIsSubmitting(true);
    setSubmitSuccessMsg('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: selectedArticle.id,
          articleTitle: selectedArticle.title,
          authorName: commentName,
          content: commentText
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccessMsg('Votre commentaire a été envoyé et est en attente de modération.');
        setCommentName('');
        setCommentText('');
      } else {
        alert(data.error || 'Erreur lors de l\'envoi du commentaire.');
      }
    } catch (e) {
      alert('Erreur réseau lors de la soumission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="blog" className="py-20 bg-[#141446] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* If an article is selected, show full Article Detail View */}
        {selectedArticle ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la liste des articles</span>
            </button>

            {/* Article Banner & Title Header */}
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#6C68F4]/20 text-[#00C2C2] border border-[#6C68F4]/40">
                {selectedArticle.category}
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-b border-white/10 pb-4">
                <span>Par <strong className="text-slate-200">{selectedArticle.author}</strong> ({selectedArticle.authorRole})</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#00C2C2]" /> {selectedArticle.readTime}</span>
                <span>•</span>
                <span>Publié le {selectedArticle.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-[#FFAD5B]" /> {selectedArticle.views} vues</span>
              </div>
            </div>

            {/* Article Image */}
            <div className="h-80 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed space-y-4 whitespace-pre-line bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10">
              {selectedArticle.content}
            </div>

            {/* Public Comments Section */}
            <div className="pt-10 border-t border-white/10 space-y-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#00C2C2]" />
                <h3 className="text-2xl font-bold text-white">Commentaires publics</h3>
              </div>

              {/* Add Comment Form (No login required) */}
              <form onSubmit={handleSubmitComment} className="p-6 rounded-2xl bg-[#0d0d2e] border border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-[#FFAD5B]">Laissez un commentaire (sans inscription)</h4>
                
                {submitSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{submitSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Votre Nom / Pseudo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Thomas D."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Votre Message *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Partagez vos impressions ou vos questions sur cet article..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2C2]"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    🔒 Modération préalable par l'administrateur Forward One.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#6C68F4] hover:bg-[#5b57e0] cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publier mon commentaire</span>
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300">
                  Commentaires validés ({comments.length})
                </h4>

                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun commentaire publié pour le moment. Soyez le premier !</p>
                ) : (
                  comments.map((com) => (
                    <div key={com.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#00C2C2]">{com.authorName}</span>
                        <span className="text-slate-400 text-[10px]">
                          {new Date(com.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{com.content}</p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        ) : (
          /* List View of Blog Articles */
          <div className="space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C68F4]/20 text-[#00C2C2] text-xs font-semibold uppercase tracking-wider">
                <span>Blog & Actualités Forward One</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Analyses, Tendances et Coulisses Technique
              </h2>
              <p className="text-slate-300 text-base">
                Découvrez nos articles éditoriaux sur les stratégies marketing d'avant-garde et les secrets d'une régie événementielle réussie.
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="group rounded-2xl bg-[#0d0d2e] border border-white/10 hover:border-[#6C68F4]/60 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-[#141446]/90 text-[#00C2C2] border border-white/10">
                        {art.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#00C2C2]" /> {art.readTime}</span>
                        <span>•</span>
                        <span>{art.date}</span>
                      </div>

                      <h3 className="font-bold text-lg text-white group-hover:text-[#00C2C2] transition-colors leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#6C68F4] group-hover:text-[#00C2C2] transition-colors">
                    <span>Lire l'article complet →</span>
                    <span className="text-slate-400 text-[11px] font-normal">{art.author}</span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
