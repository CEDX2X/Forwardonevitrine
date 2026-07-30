import React, { useState, useEffect } from 'react';
import { ArticleItem, CommentItem } from '../types';
import { Clock, Eye, Send, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { getComments, createComment } from '../lib/firebaseStore';

interface BlogSectionProps {
  articles: ArticleItem[];
  theme?: 'light' | 'dark';
}

export const BlogSection: React.FC<BlogSectionProps> = ({ articles, theme = 'light' }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLight = theme === 'light';

  // Fetch comments for selected article
  useEffect(() => {
    if (selectedArticle) {
      const loadComments = async () => {
        try {
          const res = await fetch(`/api/comments?articleId=${selectedArticle.id}`);
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setComments(data);
              return;
            }
          }
        } catch (err) {}
        try {
          const allComments = await getComments();
          const filtered = allComments.filter(c => c.articleId === selectedArticle.id && c.status === 'approved');
          setComments(filtered);
        } catch (e) {
          console.error('Failed to load comments from Firestore:', e);
        }
      };
      loadComments();
    }
  }, [selectedArticle]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim() || !selectedArticle) return;

    setIsSubmitting(true);
    setSubmitSuccessMsg('');

    try {
      let sent = false;
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

        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          sent = true;
        }
      } catch (e) {}

      if (!sent) {
        await createComment({
          id: 'com_' + Date.now(),
          articleId: selectedArticle.id,
          articleTitle: selectedArticle.title,
          authorName: commentName,
          content: commentText,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }

      setSubmitSuccessMsg('Votre commentaire a été envoyé et est en attente de modération.');
      setCommentName('');
      setCommentText('');
    } catch (e) {
      alert('Erreur lors de l\'envoi du commentaire.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="blog" className={`pt-8 pb-16 transition-colors duration-200 relative overflow-hidden ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#141446] text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* If an article is selected, show full Article Detail View */}
        {selectedArticle ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            <button
              onClick={() => setSelectedArticle(null)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la liste des articles</span>
            </button>

            {/* Article Banner & Title Header */}
            <div className="space-y-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isLight ? 'bg-slate-100 text-[#102A6B] border border-slate-200' : 'bg-[#6C68F4]/20 text-[#00C2C2] border border-[#6C68F4]/40'
              }`}>
                {selectedArticle.category}
              </span>
              
              <h1 className={`text-3xl sm:text-4xl font-extrabold leading-tight ${isLight ? 'text-black' : 'text-white'}`}>
                {selectedArticle.title}
              </h1>

              <div className={`flex flex-wrap items-center gap-4 text-xs border-b pb-4 ${
                isLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-white/10'
              }`}>
                <span className="whitespace-nowrap">Par <strong className={isLight ? 'text-black' : 'text-slate-200'}>{selectedArticle.author}</strong> ({selectedArticle.authorRole})</span>
                <span>•</span>
                <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-3.5 h-3.5 text-[#5362DC] shrink-0" /> {selectedArticle.readTime}</span>
                <span>•</span>
                <span className="whitespace-nowrap">Publié le {selectedArticle.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1 whitespace-nowrap"><Eye className="w-3.5 h-3.5 text-[#5362DC] shrink-0" /> {selectedArticle.views} vues</span>
              </div>
            </div>

            {/* Article Image */}
            <div className="h-80 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Body */}
            <div className={`prose max-w-none text-base leading-relaxed space-y-4 whitespace-pre-line p-6 sm:p-8 rounded-2xl border ${
              isLight ? 'bg-slate-50 text-black border-slate-200' : 'bg-white/5 text-slate-200 border-white/10'
            }`}>
              {selectedArticle.content}
            </div>

            {/* Public Comments Section */}
            <div className={`pt-10 border-t space-y-8 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-[#5362DC]" />
                <h3 className={`text-2xl font-extrabold ${isLight ? 'text-black' : 'text-white'}`}>Commentaires publics</h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className={`p-6 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d0d2e] border-white/10'
              }`}>
                <h4 className="text-sm font-extrabold text-[#5362DC]">Laissez un commentaire (sans inscription)</h4>
                
                {submitSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{submitSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Votre Nom / Pseudo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Thomas D."
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isLight
                          ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]'
                          : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>Votre Message *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Partagez vos impressions ou vos questions sur cet article..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]'
                        : 'bg-white/5 border-white/15 text-white placeholder-slate-500 focus:border-[#00C2C2]'
                    }`}
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    🔒 Modération préalable par l'administrateur Forward One.
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs text-white bg-[#5362DC] hover:bg-[#4351c4] cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publier mon commentaire</span>
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-4">
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Commentaires validés ({comments.length})
                </h4>

                {comments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Aucun commentaire publié pour le moment. Soyez le premier !</p>
                ) : (
                  comments.map((com) => (
                    <div key={com.id} className={`p-4 rounded-xl border space-y-2 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#5362DC]">{com.authorName}</span>
                        <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(com.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isLight ? 'text-black' : 'text-slate-200'}`}>{com.content}</p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        ) : (
          /* List View of Blog Articles */
          <div className="space-y-12">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto space-y-4"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isLight ? 'bg-slate-100 text-[#102A6B] border border-slate-200' : 'bg-[#6C68F4]/20 text-[#00C2C2]'
              }`}>
                <span>Blog & Actualités Forward One</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
                Analyses, Tendances et Coulisses Technique
              </h2>
              <p className={`text-base ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Découvrez nos articles éditoriaux sur les stratégies marketing d'avant-garde et les secrets d'une régie événementielle réussie.
              </p>
            </motion.div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((art, index) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedArticle(art)}
                  className={`group rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-[#5362DC]'
                      : 'bg-[#0d0d2e] border-white/10 hover:border-[#6C68F4]/60'
                  }`}
                >
                  <div>
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border ${
                        isLight
                          ? 'bg-white/90 text-slate-800 border-slate-200'
                          : 'bg-[#141446]/90 text-[#00C2C2] border-white/10'
                      }`}>
                        {art.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className={`flex items-center gap-3 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#5362DC]" /> {art.readTime}</span>
                        <span>•</span>
                        <span>{art.date}</span>
                      </div>

                      <h3 className={`font-extrabold text-lg transition-colors leading-snug ${
                        isLight ? 'text-black group-hover:text-[#5362DC]' : 'text-white group-hover:text-[#00C2C2]'
                      }`}>
                        {art.title}
                      </h3>

                      <p className={`text-xs line-clamp-3 leading-relaxed ${isLight ? 'text-black font-normal' : 'text-slate-300'}`}>
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className={`p-6 pt-0 flex items-center justify-between text-xs font-bold ${
                    isLight ? 'text-[#5362DC]' : 'text-[#6C68F4] group-hover:text-[#00C2C2]'
                  }`}>
                    <span>Lire l'article complet →</span>
                    <span className={`text-[11px] font-normal ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{art.author}</span>
                  </div>

                </motion.div>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
