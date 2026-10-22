import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, FileText, Truck, MapPin, LogOut, X, Package } from 'lucide-react';

export const UserDashboardModal: React.FC = () => {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    user,
    logoutUser,
    orders,
    setActiveInvoiceOrder,
    setActiveTrackingOrder,
    addToCart,
    setIsCartOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders');

  useEffect(() => {
    if (!isDashboardOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDashboardOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDashboardOpen, setIsDashboardOpen]);

  if (!isDashboardOpen || !user) return null;

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      addToCart(item.product, item.quantity);
    });
    setIsDashboardOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div
      onClick={() => setIsDashboardOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-neutral-200 rounded-2xl max-w-3xl w-full text-neutral-900 shadow-2xl relative my-6 flex flex-col max-h-[92vh] cursor-default"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 font-serif-hooden">
                  {user.fullName}
                </h3>
                {user.isPro ? (
                  <span className="text-[10px] font-mono-hooden bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    PRO
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-hooden bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded">
                    PARTICULIER
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 font-mono-hooden">
                {user.email} • {user.savedAddress?.city || 'Paris'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutUser();
                setIsDashboardOpen(false);
              }}
              className="p-2 text-neutral-500 hover:text-rose-600 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
            <button
              onClick={() => setIsDashboardOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 px-5 pt-3 border-b border-neutral-200 bg-white text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2.5 px-2 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-amber-800 text-amber-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mes Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-2.5 px-2 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'border-amber-800 text-amber-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Factures Téléchargeables</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'orders' && (
            orders.length === 0 ? (
              <div className="text-center py-14 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-neutral-900 font-serif-hooden">
                  Aucune commande enregistrée
                </div>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Vos commandes de bois de chauffage apparaîtront ici dès votre premier achat avec accès au suivi en temps réel.
                </p>
                <button
                  onClick={() => {
                    setIsDashboardOpen(false);
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Découvrir le catalogue
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-hooden font-bold text-neutral-900 text-sm">
                            Commande n° {ord.id.replace(/^HD-/, '')}
                          </span>
                          {ord.status === 'en_livraison' ? (
                            <span className="text-[10px] font-mono-hooden bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
                              🚚 En livraison
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono-hooden bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                              ✓ Livrée
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono-hooden mt-0.5">
                          {ord.orderDate} • Créneau : {ord.deliverySlot.date} ({ord.deliverySlot.timeWindow})
                        </div>
                      </div>

                      <div className="text-right font-mono-hooden font-bold text-neutral-900 text-sm">
                        {ord.totalTTC.toFixed(2)} €
                      </div>
                    </div>

                    {/* Items */}
                    <div className="text-xs text-neutral-700 space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{it.product.name} (x{it.quantity})</span>
                          <span className="font-mono-hooden">{(it.product.priceTTC * it.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200">
                      {ord.status === 'en_livraison' && (
                        <button
                          onClick={() => {
                            setIsDashboardOpen(false);
                            setActiveTrackingOrder(ord);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Suivre la livraison</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsDashboardOpen(false);
                          setActiveInvoiceOrder(ord);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Voir Facture</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'invoices' && (
            orders.length === 0 ? (
              <div className="text-center py-14 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-neutral-900 font-serif-hooden">
                  Aucune facture disponible
                </div>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Vos factures certifiées et téléchargeables au format PDF seront générées automatiquement dès la confirmation de votre commande.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <table className="w-full text-left text-xs font-mono-hooden border border-neutral-200 rounded-lg overflow-hidden">
                  <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-600">
                    <tr>
                      <th className="p-2.5">Facture</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Montant</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 bg-white">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50">
                        <td className="p-2.5 font-bold text-neutral-900">n° {ord.id.replace(/^HD-/, '')}</td>
                        <td className="p-2.5 text-neutral-600">{ord.orderDate}</td>
                        <td className="p-2.5 font-bold text-neutral-900">{ord.totalTTC.toFixed(2)} €</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => {
                              setIsDashboardOpen(false);
                              setActiveInvoiceOrder(ord);
                            }}
                            className="px-2.5 py-1 rounded bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-semibold cursor-pointer"
                          >
                            Télécharger PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
