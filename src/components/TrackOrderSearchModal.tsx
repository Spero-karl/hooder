import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Search, FileText, X, AlertCircle, ArrowRight } from 'lucide-react';

export const TrackOrderSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { orders, setActiveTrackingOrder, setActiveInvoiceOrder } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const query = searchCode.trim().toLowerCase();
    if (!query) return;

    // Search by numeric ID (e.g., 4891), full ID (e.g., HD-4891), customer name, postal code, or city
    const found = orders.find((o) => {
      const idClean = o.id.replace(/^HD-/, '').toLowerCase();
      const fullId = o.id.toLowerCase();
      const city = o.customer.city?.toLowerCase() || '';
      const postalCode = o.customer.postalCode?.toLowerCase() || '';
      const name = o.customer.fullName?.toLowerCase() || '';
      const email = o.customer.email?.toLowerCase() || '';

      return (
        idClean.includes(query) ||
        fullId.includes(query) ||
        city.includes(query) ||
        postalCode.includes(query) ||
        name.includes(query) ||
        email.includes(query)
      );
    });

    if (found) {
      setSearchedOrder(found);
    } else {
      setErrorMsg(`Aucune commande trouvée pour "${searchCode}". Veuillez vérifier votre numéro.`);
      setSearchedOrder(null);
    }
  };

  const handleSelectOrder = (order: any) => {
    setSearchedOrder(order);
    setErrorMsg(null);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 text-neutral-900 shadow-2xl relative cursor-default transition-all"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono-hooden text-amber-800 font-bold mb-1">
          <Truck className="w-4 h-4 text-amber-800" />
          <span>SUIVI LOGISTIQUE & FACTURATION</span>
        </div>
        <h3 className="text-xl font-bold font-serif-hooden text-neutral-900">
          Suivre votre livraison
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Saisissez votre numéro de commande pour consulter l'avancement de votre camion et vos documents.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ex : 4891 ou HD-4891"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-800 focus:bg-white font-mono-hooden"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Rechercher
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Preview */}
        {searchedOrder && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
              <div>
                <span className="text-sm font-bold text-neutral-900 font-mono-hooden">
                  Commande n° {searchedOrder.id.replace(/^HD-/, '')}
                </span>
                <div className="text-[11px] text-neutral-500 font-mono-hooden mt-0.5">
                  {searchedOrder.customer.address}, {searchedOrder.customer.postalCode} {searchedOrder.customer.city}
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-mono-hooden px-2 py-0.5 rounded font-semibold ${
                  searchedOrder.status === 'livree'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {searchedOrder.status === 'livree' ? 'Livrée' : 'En livraison'}
                </span>
                <div className="text-xs font-bold font-mono-hooden text-neutral-900 mt-1">
                  {searchedOrder.totalTTC.toFixed(2)} €
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-600">
              Créneau prévu : <strong className="text-neutral-900">{searchedOrder.deliverySlot.date}</strong> ({searchedOrder.deliverySlot.timeWindow})
            </div>

            {/* Direct CTAs */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-neutral-200">
              <button
                onClick={() => {
                  onClose();
                  setActiveTrackingOrder(searchedOrder);
                }}
                className="flex-1 py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Ouvrir le suivi de livraison</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActiveInvoiceOrder(searchedOrder);
                }}
                className="flex-1 py-2.5 px-3 rounded-lg border border-neutral-300 hover:bg-white text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-neutral-600" />
                <span>Consulter la facture</span>
              </button>
            </div>
          </div>
        )}

        {/* Existing / Sample Orders Quick Access */}
        <div className="mt-5 pt-4 border-t border-neutral-200">
          <div className="text-[11px] font-mono-hooden text-neutral-500 uppercase tracking-wider mb-2">
            Vos commandes récentes :
          </div>
          <div className="space-y-1.5">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => handleSelectOrder(ord)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-left text-xs flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono-hooden font-bold text-neutral-900">
                    Commande n° {ord.id.replace(/^HD-/, '')}
                  </span>
                  <span className="text-neutral-500 text-[11px]">
                    · {ord.customer.city}
                  </span>
                  <span className={`text-[10px] font-mono-hooden px-1.5 py-0.2 rounded ${
                    ord.status === 'livree'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900 font-semibold'
                  }`}>
                    {ord.status === 'livree' ? 'Livrée' : 'En acheminement'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400 group-hover:text-amber-800 transition-colors">
                  <span className="font-mono-hooden font-bold text-neutral-900">{ord.totalTTC.toFixed(2)} €</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
