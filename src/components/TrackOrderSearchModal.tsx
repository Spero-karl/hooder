import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Search, FileText, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const TrackOrderSearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { orders, setActiveTrackingOrder, setActiveInvoiceOrder } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const code = searchCode.trim().toUpperCase();
    if (!code) return;

    const found = orders.find((o) => o.id.toUpperCase().includes(code));
    if (found) {
      setSearchedOrder(found);
    } else {
      setErrorMsg(`Aucune commande trouvée pour "${searchCode}".`);
      setSearchedOrder(null);
    }
  };

  const handleSelectOrder = (order: any) => {
    setSearchedOrder(order);
    setSearchCode(order.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 text-neutral-900 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono-hooden text-amber-800 font-bold mb-1">
          <Truck className="w-4 h-4 text-amber-800" />
          <span>SUIVI DE COMMANDE & FACTURATION</span>
        </div>
        <h3 className="text-xl font-bold font-serif-hooden text-neutral-900">
          Suivre une livraison & Télécharger une facture
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Entrez votre numéro de commande (ex : <strong>HOOD-2026-4891</strong>) ou sélectionnez une commande ci-dessous.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Ex : HOOD-2026-4891"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-800 font-mono-hooden"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Rechercher
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Result view */}
        {searchedOrder && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200">
              <div>
                <span className="text-sm font-bold text-neutral-900 font-mono-hooden">
                  Commande #{searchedOrder.id}
                </span>
                <div className="text-[11px] text-neutral-500 font-mono-hooden">
                  {searchedOrder.customer.address}, {searchedOrder.customer.city}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono-hooden text-neutral-900">
                  {searchedOrder.totalTTC.toFixed(2)} € TTC
                </div>
                <span className="text-[10px] font-mono-hooden bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Payé
                </span>
              </div>
            </div>

            <div className="text-xs text-neutral-700 space-y-1">
              <div>
                <strong>Statut :</strong>{' '}
                <span className="text-amber-800 font-semibold">
                  {searchedOrder.status === 'en_livraison'
                    ? '🚚 En cours de livraison (Chauffeur en route)'
                    : searchedOrder.status === 'livree'
                    ? '✓ Livrée et réceptionnée'
                    : '📦 En préparation'}
                </span>
              </div>
              <div className="text-neutral-500 font-mono-hooden text-[11px]">
                Créneau : {searchedOrder.deliverySlot.date} ({searchedOrder.deliverySlot.timeWindow})
              </div>
            </div>

            {/* Direct CTAs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-200">
              <button
                onClick={() => {
                  onClose();
                  setActiveTrackingOrder(searchedOrder);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Suivre la livraison</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActiveInvoiceOrder(searchedOrder);
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ouvrir la Facture</span>
              </button>
            </div>
          </div>
        )}

        {/* Recent orders quick list */}
        <div className="mt-5 pt-4 border-t border-neutral-200">
          <div className="text-[11px] font-mono-hooden text-neutral-500 uppercase tracking-wider mb-2">
            Commandes disponibles :
          </div>
          <div className="space-y-1.5">
            {orders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => handleSelectOrder(ord)}
                className="w-full p-2.5 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-left text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono-hooden font-bold text-neutral-900">#{ord.id}</span>
                  <span className="text-neutral-500 font-mono-hooden text-[11px]">• {ord.customer.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-hooden font-bold text-neutral-900">{ord.totalTTC.toFixed(2)} €</span>
                  <span className="text-neutral-400">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
