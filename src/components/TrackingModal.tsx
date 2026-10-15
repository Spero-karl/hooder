import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  FileText,
  X,
  RefreshCw,
  Phone,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

export const TrackingModal: React.FC = () => {
  const { activeTrackingOrder, setActiveTrackingOrder, setActiveInvoiceOrder } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('À l\'instant');
  const [activeStepTab, setActiveStepTab] = useState<number | null>(null);

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

  // Determine current active step index (0, 1, 2, 3)
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
        return 2; // default to active delivery for visual dynamism
    }
  };

  const currentStepIdx = getStepIndex(order.status);
  const displayedStep = activeStepTab !== null ? activeStepTab : currentStepIdx;

  const steps = [
    {
      title: 'Commande validée',
      desc: 'Enregistrée en scierie & stock de stères réservé',
      time: order.orderDate,
      icon: CheckCircle2,
      details: 'Paiement confirmé. Préparation de vos palettes en entrepôt régional.',
    },
    {
      title: 'Contrôle & Séchage certifié',
      desc: 'Taux d\'humidité contrôlé < 20% & cerclage de protection',
      time: 'Jour J-1',
      icon: ShieldCheck,
      details: 'Contrôle hygrométrique rigoureux par nos opérateurs forestiers. Emballage soigné pour le transport.',
    },
    {
      title: 'En cours d\'acheminement',
      desc: 'Camion porteur 19T avec chariot tout-terrain embarqué',
      time: `${order.deliverySlot?.date || 'Jour J'} · ${order.deliverySlot?.timeWindow || 'Matinée'}`,
      icon: Truck,
      details: 'Le chauffeur-livreur est en tournée. Votre palette sera dépose directe au plus près de votre zone de stockage sans effort.',
    },
    {
      title: 'Livrée & Réceptionnée',
      desc: 'Dépose au sol terminée avec le chariot embarqué',
      time: order.status === 'livree' ? 'Effectuée' : 'Prévue sous peu',
      icon: MapPin,
      details: 'Dépose validée avec accusé de réception numérique sans encombre.',
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 600);
  };

  const driver = order.driverInfo || {
    name: 'Jean-Marc Tardieu',
    phone: '06 98 12 34 56',
    truckType: 'Mercedes-Benz Actros 18T · Chariot tout-terrain embarqué Moffett M4',
    plateNumber: 'GF-482-TX',
    etaMinutes: 20,
    currentStep: 'Camion en approche de votre secteur pour dépose directe',
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
        className="bg-white border border-neutral-200/90 rounded-2xl max-w-lg w-full text-neutral-900 shadow-2xl relative my-auto overflow-hidden cursor-default transition-all"
      >
        {/* Dynamic Live Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold text-neutral-900 uppercase font-mono-hooden">
              Suivi en direct
            </span>
            <span className="text-[11px] font-mono-hooden text-neutral-500">
              #{order.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-2 py-1 rounded-lg hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-900 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="Actualiser la position"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-800' : ''}`} />
              <span className="hidden sm:inline">Actualisé ({lastUpdated})</span>
            </button>

            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/70 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Dynamic Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-neutral-900">
                {steps[currentStepIdx].title}
              </span>
              <span className="text-emerald-700 font-mono-hooden font-bold text-[11px]">
                {currentStepIdx === 3 ? '100% · Terminé' : `${((currentStepIdx + 1) / 4) * 100}% de progression`}
              </span>
            </div>

            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-700 to-emerald-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(25, ((currentStepIdx + 1) / 4) * 100)}%` }}
              />
            </div>
          </div>

          {/* Interactive Stepper / Milestones */}
          <div className="space-y-3">
            {steps.map((st, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const Icon = st.icon;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepTab(idx === activeStepTab ? null : idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-200/50 shadow-xs'
                      : isPast
                      ? 'bg-neutral-50/70 border-neutral-200/80'
                      : 'bg-white border-neutral-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-amber-800 text-white shadow-xs'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-semibold text-neutral-900">
                          {st.title}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono-hooden shrink-0">
                          {st.time}
                        </div>
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                        {st.desc}
                      </div>

                      {/* Expandable dynamic step detail */}
                      {(isCurrent || activeStepTab === idx) && (
                        <div className="mt-2 pt-2 border-t border-neutral-200/60 text-[11px] text-neutral-700 bg-white/60 p-2 rounded-lg">
                          {st.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Driver & Logistics Card */}
          {order.status !== 'livree' && (
            <div className="p-3.5 rounded-xl bg-neutral-900 text-white space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono-hooden text-neutral-200">
                    Logistique directe en approche
                  </span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono-hooden px-2 py-0.5 rounded font-semibold border border-amber-500/30">
                  ETA : ~{driver.etaMinutes} min
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Chauffeur :</span>
                  <span className="font-semibold text-neutral-100">{driver.name}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-neutral-400">Véhicule & Chariot :</span>
                  <span className="text-neutral-300 font-mono-hooden">{driver.plateNumber}</span>
                </div>
                <p className="text-[11px] text-neutral-300 pt-1 border-t border-neutral-800">
                  {driver.currentStep}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Chariot embarqué opérationnel
                </span>
                <a
                  href={`tel:${driver.phone}`}
                  className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium"
                >
                  <Phone className="w-3 h-3" />
                  <span>Contacter chauffeur</span>
                </a>
              </div>
            </div>
          )}

          {/* Destination & Ordered items summary */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-neutral-700">
              <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-neutral-900 block">
                  Adresse de dépose
                </span>
                <span className="text-neutral-600">
                  {order.customer.address}, {order.customer.postalCode} {order.customer.city}
                </span>
                {order.customer.accessConstraints?.notes && (
                  <p className="text-[11px] text-neutral-500 mt-0.5 italic">
                    « {order.customer.accessConstraints.notes} »
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 font-mono-hooden">
                {order.items.length} article{order.items.length > 1 ? 's' : ''} ({order.totalTTC.toFixed(2)} €)
              </span>
              <span className="text-emerald-700 font-medium font-mono-hooden">
                Livraison offerte incluse
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer px-2 py-1"
            >
              Fermer
            </button>

            <button
              onClick={() => {
                const currentOrder = order;
                setActiveTrackingOrder(null);
                setActiveInvoiceOrder(currentOrder);
              }}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Voir la facture</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
