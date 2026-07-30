import React, { useState } from 'react';
import { ProductItem } from '../types';
import { Search, Calendar, SlidersHorizontal, CheckCircle2, AlertCircle, Wrench, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface CatalogSectionProps {
  products: ProductItem[];
  onOpenPreReservationWithItems: (product: ProductItem) => void;
  theme?: 'light' | 'dark';
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  onOpenPreReservationWithItems,
  theme = 'light'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);

  const isLight = theme === 'light';

  const categories = ['Toutes', 'Sonorisation', 'Éclairage', 'Audiovisuel', 'Structure & Scène', 'Mobilier & Déco'];

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStatusBadge = (status: ProductItem['availabilityStatus']) => {
    switch (status) {
      case 'disponible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Disponible</span>
          </span>
        );
      case 'reserve':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Sur réservation</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 whitespace-nowrap">
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">En maintenance</span>
          </span>
        );
    }
  };

  return (
    <section id="catalog" className={`py-20 transition-colors duration-200 relative overflow-hidden border-t border-b ${
      isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#141446] text-white border-[#6C68F4]/20'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b ${
            isLight ? 'border-slate-200' : 'border-white/10'
          }`}
        >
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 ${
              isLight ? 'bg-slate-100 text-[#102A6B] border border-slate-200' : 'bg-[#00C2C2]/20 text-[#00C2C2]'
            }`}>
              <span>Logistique Événementielle</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
              Catalogue de Matériel Professionnel
            </h2>
            <p className={`text-sm mt-2 max-w-xl ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Équipements son, lumière, vidéo, structures et mobilier haute technologie disponibles à la location avec option pré-réservation instantanée.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm sm:text-xs focus:outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:border-[#5362DC]'
                    : 'bg-white/5 border-white/15 text-white placeholder-slate-400 focus:border-[#00C2C2]'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Categories Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none max-w-full -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <SlidersHorizontal className={`w-4 h-4 shrink-0 mr-1 ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`} />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#5362DC] text-white font-bold shadow-md'
                  : isLight
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-black'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 active:bg-white/15 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {filteredProducts.map((prod, index) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
              className={`group rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-[#5362DC] shadow-xs hover:shadow-md'
                  : 'bg-white/5 border-white/10 backdrop-blur-sm hover:border-[#00C2C2]/50'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    {renderStatusBadge(prod.availabilityStatus)}
                  </div>
                  {prod.isFeatured && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#5362DC] text-white uppercase tracking-wider">
                      Top Équipement
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>
                    {prod.category}
                  </div>
                  <h3 className={`font-extrabold text-[#102A6B] dark:text-white text-base leading-snug break-words transition-colors ${
                    isLight ? 'text-black group-hover:text-[#5362DC]' : 'text-white group-hover:text-[#00C2C2]'
                  }`}>
                    {prod.name}
                  </h3>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${isLight ? 'text-black font-normal' : 'text-[#738591]'}`}>
                    {prod.description}
                  </p>

                  {/* Stock counter */}
                  <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-[#738591]'}`}>
                    Stock parc : <span className={`font-semibold ${isLight ? 'text-black' : 'text-slate-200'}`}>{prod.stockQuantity} unités</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 space-y-3">
                <div className={`flex flex-wrap items-baseline justify-between gap-1 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                  <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-[#738591]'}`}>Tarif / jour :</div>
                  <div className={`text-base sm:text-lg font-black break-words ${isLight ? 'text-[#5362DC]' : 'text-[#FFAD5B]'}`}>
                    {prod.dailyRate.toLocaleString()} FCFA <span className="text-xs font-normal opacity-75">HT</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedProductDetail(prod)}
                    className={`flex items-center justify-center gap-1 py-2 px-2 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap ${
                      isLight ? 'text-slate-700 bg-slate-100 hover:bg-slate-200' : 'text-slate-300 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Fiche</span>
                  </button>

                  <button
                    onClick={() => onOpenPreReservationWithItems(prod)}
                    disabled={prod.availabilityStatus === 'maintenance'}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-full text-xs font-bold text-slate-950 bg-[#00C2C2] hover:bg-[#00a3a3] disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Réserver</span>
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-base">Aucun équipement trouvé pour cette recherche.</p>
          </div>
        )}

      </div>

      {/* Product Specification Modal */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-xl rounded-2xl border p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-[#0d0d2e] border-[#00C2C2]/40 text-white'
          }`}>
            
            <div className={`flex items-start justify-between border-b pb-4 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#5362DC]' : 'text-[#00C2C2]'}`}>
                  {selectedProductDetail.category}
                </span>
                <h3 className={`text-xl font-bold mt-1 ${isLight ? 'text-black' : 'text-white'}`}>
                  {selectedProductDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className={`p-1 hover:text-red-500 text-xl font-bold cursor-pointer ${isLight ? 'text-slate-500' : 'text-slate-400'}`}
              >
                ✕
              </button>
            </div>

            <div className="h-48 rounded-xl overflow-hidden">
              <img
                src={selectedProductDetail.image}
                alt={selectedProductDetail.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {selectedProductDetail.description}
            </p>

            {/* Specifications Table */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[#5362DC]' : 'text-[#FFAD5B]'}`}>Spécifications Techniques :</h4>
              <div className={`rounded-xl border p-3 space-y-1.5 text-xs ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                {Object.entries(selectedProductDetail.specifications).map(([key, val]) => (
                  <div key={key} className={`flex justify-between py-1 border-b last:border-0 ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                    <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400 font-medium'}>{key} :</span>
                    <span className={isLight ? 'text-black font-semibold' : 'text-slate-100 font-semibold'}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex items-center justify-between pt-2 border-t ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div>
                <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Tarif journalier :</div>
                <div className={`text-xl font-black ${isLight ? 'text-[#5362DC]' : 'text-[#FFAD5B]'}`}>
                  {selectedProductDetail.dailyRate.toLocaleString()} FCFA HT / jour
                </div>
              </div>

              <button
                onClick={() => {
                  const prod = selectedProductDetail;
                  setSelectedProductDetail(null);
                  onOpenPreReservationWithItems(prod);
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#5362DC] hover:bg-[#4351c4] cursor-pointer"
              >
                Pré-réserver cet équipement
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
