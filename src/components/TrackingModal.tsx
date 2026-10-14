import React from 'react';
import { useApp } from '../context/AppContext';
import { Truck, Phone, CheckCircle2, User, FileText, X } from 'lucide-react';

export const TrackingModal: React.FC = () => {
  const { activeTrackingOrder, setActiveTrackingOrder, setActiveInvoiceOrder } = useApp();

  if (!activeTrackingOrder) return null;
  const order = activeTrackingOrder;
  const driver = order.driverInfo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 text-neutral-900 shadow-2xl relative my-6 space-y-5">
        <button
          onClick={() => setActiveTrackingOrder(null)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="text-xs font-mono-hooden text-amber-800 font-bold uppercase tracking-wider mb-1">
            Commande #{order.id}
          </div>
          <h3 className="text-xl font-bold font-serif-hooden text-neutral-900">
            Suivi de votre livraison
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Date prévue : <strong className="text-neutral-800">{order.deliverySlot.date} ({order.deliverySlot.timeWindow})</strong>
          </p>
        </div>

        {/* Current status card */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-neutral-900 uppercase font-mono-hooden">
                {order.status === 'livree' ? 'Livraison effectuée' : 'Livraison en cours'}
              </span>
            </div>
            <span className="text-xs font-mono-hooden text-neutral-500">
              Dépose chariot tout-terrain
            </span>
          </div>

          <div className="text-xs text-neutral-600 font-mono-hooden">
            Adresse : {order.customer.address}, {order.customer.postalCode} {order.customer.city}
          </div>
        </div>

        {/* Driver Contact */}
        {driver && (
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-mono-hooden uppercase">Chauffeur livreur</div>
                <h4 className="text-sm font-bold text-neutral-900">{driver.name}</h4>
                <div className="text-xs text-neutral-500 font-mono-hooden">
                  {driver.truckType}
                </div>
              </div>
            </div>

            <a
              href={`tel:${driver.phone}`}
              className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{driver.phone}</span>
            </a>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-2 pt-1 font-mono-hooden text-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>1. Commande préparée et palettes contrôlées</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-amber-900">
            <Truck className="w-4 h-4 shrink-0 text-amber-800" />
            <span>2. En tournée de livraison</span>
          </div>

          <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center gap-2.5 text-neutral-400">
            <div className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center text-[10px]">3</div>
            <span>3. Dépose dans votre abri ou allée</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-200 flex justify-end">
          <button
            onClick={() => {
              const o = order;
              setActiveTrackingOrder(null);
              setActiveInvoiceOrder(o);
            }}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Consulter la Facture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
