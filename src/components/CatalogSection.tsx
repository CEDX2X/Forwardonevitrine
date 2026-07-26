import React, { useState } from 'react';
import { ProductItem } from '../types';
import { Search, Calendar, SlidersHorizontal, CheckCircle2, AlertCircle, Wrench, Eye } from 'lucide-react';

interface CatalogSectionProps {
  products: ProductItem[];
  onOpenPreReservationWithItems: (product: ProductItem) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  onOpenPreReservationWithItems
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disponible</span>
          </span>
        );
      case 'reserve':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Sur réservation</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Wrench className="w-3.5 h-3.5" />
            <span>En maintenance</span>
          </span>
        );
    }
  };

  return (
    <section id="catalog" className="py-20 bg-[#141446] text-white relative border-t border-b border-[#6C68F4]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2C2]/20 text-[#00C2C2] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Logistique Événementielle</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Catalogue de Matériel Professionnel
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-xl">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm sm:text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00C2C2]"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar - Horizontally Scrollable on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none max-w-full -mx-4 px-4 sm:mx-0 sm:px-0">
          <SlidersHorizontal className="w-4 h-4 text-[#00C2C2] shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00C2C2] text-slate-950 font-bold shadow-md shadow-[#00C2C2]/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 active:bg-white/15 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-[#00C2C2]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    {renderStatusBadge(prod.availabilityStatus)}
                  </div>
                  {prod.isFeatured && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFAD5B] text-slate-950 uppercase tracking-wider">
                      Top Équipement
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div className="text-[10px] font-bold text-[#00C2C2] uppercase tracking-widest">
                    {prod.category}
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-[#00C2C2] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-[#738591] line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Stock counter */}
                  <div className="text-[11px] text-[#738591]">
                    Stock parc : <span className="text-slate-200 font-semibold">{prod.stockQuantity} unités</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-baseline justify-between pt-3 border-t border-white/10">
                  <div className="text-xs text-[#738591]">Tarif / jour :</div>
                  <div className="text-lg font-black text-[#FFAD5B]">
                    {prod.dailyRate.toLocaleString()} FCFA <span className="text-xs font-normal text-[#738591]">HT</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedProductDetail(prod)}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-full text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Fiche</span>
                  </button>

                  <button
                    onClick={() => onOpenPreReservationWithItems(prod)}
                    disabled={prod.availabilityStatus === 'maintenance'}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-full text-xs font-bold text-slate-950 bg-[#00C2C2] hover:bg-[#00a3a3] disabled:opacity-50 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Réserver</span>
                  </button>
                </div>
              </div>

            </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0d0d2e] border border-[#00C2C2]/40 p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#00C2C2] uppercase tracking-wider">
                  {selectedProductDetail.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedProductDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="p-1 text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
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

            <p className="text-xs sm:text-sm text-slate-300">
              {selectedProductDetail.description}
            </p>

            {/* Specifications Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFAD5B]">Spécifications Techniques :</h4>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-1.5 text-xs">
                {Object.entries(selectedProductDetail.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 font-medium">{key} :</span>
                    <span className="text-slate-100 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <div className="text-xs text-slate-400">Tarif journalier :</div>
                <div className="text-xl font-black text-[#FFAD5B]">
                  {selectedProductDetail.dailyRate.toLocaleString()} FCFA HT / jour
                </div>
              </div>

              <button
                onClick={() => {
                  const prod = selectedProductDetail;
                  setSelectedProductDetail(null);
                  onOpenPreReservationWithItems(prod);
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-[#00C2C2] hover:bg-[#00a3a3] cursor-pointer"
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
