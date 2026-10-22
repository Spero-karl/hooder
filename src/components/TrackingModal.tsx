import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  X,
  Phone,
  ShieldCheck,
  Package,
  Calendar,
} from 'lucide-react';

export const TrackingModal: React.FC = () => {
  const { activeTrackingOrder, setActiveTrackingOrder, setActiveInvoiceOrder } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTrackingOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTrackingOrder]);

  if (!activeTrackingOrder) return null;
  const order = activeTrackingOrder;

  const orderNum = order.id.replace(/^HD-/, '');

  // Step indices
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmee':
        return 0;
      case 'en_preparation':
        return 1;
      case 'en_livraison':
        return 2;
      case 'livree':
        return 3;
      default:
        return 2;
    }
  };

  const currentStep = getStepIndex(order.status);

  const steps = [
    {
      title: 'Commande validée',
      subtitle: 'Enregistrée en scierie',
      date: order.orderDate,
      desc: 'Paiement confirmé et stères réservés sous abri ventilé.',
    },
    {
      title: 'Préparation & Contrôle',
      subtitle: 'Taux humidité < 18%',
      date: 'Veille de livraison',
      desc: 'Contrôle hygrométrique au cœur du bois certifié sec. Palettes filmées et cerclées.',
    },
    {
      title: 'En cours d\'acheminement',
      subtitle: 'Porteur 19T & Chariot',
      date: order.deliverySlot?.date || 'Jour de livraison',
      desc: 'Pris en charge par notre transporteur. Chauffeur en approche avec chariot tout-terrain.',
    },
    {
      title: 'Dépose sous abri',
      subtitle: 'Réception terminée',
      date: order.status === 'livree' ? 'Effectuée' : 'À réception',
      desc: 'Dépose au sol exacte dans votre cour, garage ou allée sans manutention de votre part.',
    },
  ];

  const driver = order.driverInfo || {
    name: 'Jean-Marc Tardieu',
    phone: '06 98 12 34 56',
    truckType: 'Porteur Mercedes Actros 18T avec chariot tout-terrain embarqué',
    plateNumber: 'GF-482-TX',
    currentStep: 'Tournée en cours',
  };

  return (
    <div
      onClick={() => setActiveTrackingOrder(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-neutral-200/90 rounded-2xl max-w-2xl w-full text-neutral-900 shadow-2xl relative my-auto overflow-hidden cursor-default transition-all"
      >
        {/* Top Header - Major site standard */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-900 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono-hooden">
                Suivi d'expédition
              </div>
              <div className="text-sm font-bold font-serif-hooden text-neutral-900">
                Commande n° {orderNum}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTrackingOrder(null);
                setActiveInvoiceOrder(order);
              }}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Consulter la facture"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Facture</span>
            </button>

            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Status Hero Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-700/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-bold uppercase tracking-wider font-mono-hooden text-emerald-400">
                  {order.status === 'livree'
                    ? 'Commande livrée'
                    : order.status === 'en_livraison'
                    ? 'En cours de livraison'
                    : 'En préparation'}
                </span>
              </div>
              <div className="text-xs text-neutral-400 font-mono-hooden">
                Réf : HD-{orderNum}
              </div>
            </div>

            <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] text-neutral-400 uppercase font-mono-hooden flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Date de livraison prévue</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-1 font-serif-hooden">
                  {order.deliverySlot?.date || 'À déterminer'}
                </div>
                <div className="text-xs text-amber-300 font-mono-hooden mt-0.5">
                  Créneau : {order.deliverySlot?.timeWindow || '08h00 - 12h00'}
                </div>
              </div>

              <div className="sm:border-l sm:border-neutral-700/80 sm:pl-4">
                <div className="text-[11px] text-neutral-400 uppercase font-mono-hooden flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lieu de dépose</span>
                </div>
                <div className="text-xs font-semibold text-white mt-1 truncate">
                  {order.customer.address}
                </div>
                <div className="text-xs text-neutral-300 font-mono-hooden">
                  {order.customer.postalCode} {order.customer.city}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  Dépose au sol soignée par chariot embarqué
                </div>
              </div>
            </div>
          </div>

          {/* Stepper (Grand Site Standard) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono-hooden">
              Progression de votre commande
            </h4>

            <div className="relative">
              {/* Stepper items */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {steps.map((st, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;
                  const isPending = idx > currentStep;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'border-amber-700 bg-amber-50/60 ring-1 ring-amber-300 shadow-xs'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-neutral-200 bg-neutral-50/50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-amber-800 text-white'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className="text-[10px] font-mono-hooden text-neutral-500 truncate">
                          {st.date}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-neutral-900 leading-snug">
                        {st.title}
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5 leading-tight">
                        {st.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chronological Event History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono-hooden">
              Historique des événements
            </h4>

            <div className="rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100 text-xs">
              <div className="p-3 bg-neutral-50/70 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Camion en approche dans votre secteur</span>
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    Le chauffeur actionnera le chariot tout-terrain pour accéder à votre zone de stockage.
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono-hooden text-neutral-500 shrink-0">
                  {order.deliverySlot?.date || 'Aujourd\'hui'} · 08:45
                </div>
              </div>

              <div className="p-3 bg-white flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-neutral-900">
                    Départ en tournée de livraison
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    Plateforme logistique régionale — Port de Gennevilliers (92230)
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono-hooden text-neutral-500 shrink-0">
                  {order.deliverySlot?.date || 'Aujourd\'hui'} · 07:15
                </div>
              </div>

              <div className="p-3 bg-white flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-neutral-900">
                    Contrôle hygrométrique certifié (&lt; 18% H₂O) & Palettisation
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    Étuve scierie Hooden — Taux mesuré : 16.4%. Cerclage haute résistance et filmage étanche.
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono-hooden text-neutral-500 shrink-0">
                  Veille · 16:30
                </div>
              </div>

              <div className="p-3 bg-white flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-neutral-900">
                    Commande validée & Réservation de vos stères
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    Maison Forestière Hooden — Lot réservé sous abri sec.
                  </div>
                </div>
                <div className="text-right text-[11px] font-mono-hooden text-neutral-500 shrink-0">
                  {order.orderDate} · 14:10
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Carrier Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carrier Card */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
              <div className="font-bold text-neutral-900 font-mono-hooden uppercase text-[11px] flex items-center justify-between">
                <span>Transporteur & Chauffeur</span>
                <span className="text-emerald-700 font-semibold lowercase">dédié</span>
              </div>
              <div className="font-semibold text-neutral-900 text-sm">
                {driver.name}
              </div>
              <div className="text-neutral-600 text-[11px] font-mono-hooden">
                {driver.truckType}
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">Coordination accès :</span>
                <a
                  href={`tel:${driver.phone}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-mono-hooden text-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>{driver.phone}</span>
                </a>
              </div>
            </div>

            {/* Recipient & Access Card */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
              <div className="font-bold text-neutral-900 font-mono-hooden uppercase text-[11px]">
                Adresse de livraison
              </div>
              <div className="font-semibold text-neutral-900">
                {order.customer.fullName}
              </div>
              <div className="text-neutral-600 text-[11px]">
                {order.customer.address}
              </div>
              <div className="text-neutral-600 text-[11px] font-mono-hooden">
                {order.customer.postalCode} {order.customer.city}
              </div>
              <div className="text-neutral-500 text-[11px] pt-1 border-t border-neutral-200">
                Tél client : <span className="font-mono-hooden">{order.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <div className="font-bold text-neutral-900 font-mono-hooden uppercase text-[11px] flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-800" />
              <span>Contenu de l'expédition</span>
            </div>
            <div className="space-y-1.5 divide-y divide-neutral-200">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between pt-1.5 first:pt-0">
                  <span className="text-neutral-800">
                    <strong>{it.quantity}x</strong> {it.product.name}
                  </span>
                  <span className="text-neutral-500 font-mono-hooden">
                    {(it.product.volumeSteres * it.quantity).toFixed(1)} stères
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3 text-xs">
          <div className="text-neutral-500 font-mono-hooden text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Livraison garantie sous abri</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTrackingOrder(null);
                setActiveInvoiceOrder(order);
              }}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-white text-neutral-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              Voir la facture
            </button>
            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
