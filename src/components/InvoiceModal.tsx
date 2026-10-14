import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HOODEN_COMPANY } from '../data/mockData';
import { Printer, Mail, X } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder, showNotification } = useApp();
  const [emailSent, setEmailSent] = useState(false);

  if (!activeInvoiceOrder) return null;
  const order = activeInvoiceOrder;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    showNotification({
      id: String(Date.now()),
      title: 'Facture envoyée',
      message: `La facture #${order.id} a été envoyée à ${order.customer.email}.`,
      type: 'info'
    });
    setTimeout(() => setEmailSent(false), 3000);
  };

  const paymentLabel = order.paymentMethod === 'card'
    ? 'Carte Bancaire'
    : order.paymentMethod === 'transcash'
    ? 'Ticket Transcash'
    : 'PayPal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-neutral-300 rounded-2xl max-w-2xl w-full text-neutral-900 shadow-2xl relative my-6 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Action Bar (hidden when printing) */}
        <div className="no-print px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono-hooden text-neutral-200 font-semibold">
              Facture #{order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>

            <button
              onClick={handleSendEmail}
              disabled={emailSent}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{emailSent ? 'Envoyée' : 'Email'}</span>
            </button>

            <button
              onClick={() => setActiveInvoiceOrder(null)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer ml-1"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean HD Invoice Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-neutral-900 font-sans print-card space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-neutral-200">
            <div>
              <h1 className="text-xl font-bold tracking-tight font-serif-hooden text-neutral-950">
                HOODEN PARIS
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Bois de chauffage & combustibles
              </p>
              <div className="text-[11px] text-neutral-400 font-mono-hooden mt-2 space-y-0.5">
                <div>18 Rue de la Boétie, 75008 Paris</div>
                <div>SIRET : {HOODEN_COMPANY.siret} • TVA : {HOODEN_COMPANY.tvaIntracom}</div>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-sm font-bold font-mono-hooden text-neutral-900">
                FACTURE N° {order.id}
              </div>
              <div className="text-xs text-neutral-500 font-mono-hooden">
                Date : {order.orderDate}
              </div>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs font-mono-hooden">
                ACQUITTÉE ({paymentLabel})
              </div>
            </div>
          </div>

          {/* Client & Delivery Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-hooden">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Destinataire :</span>
              <div className="font-bold text-neutral-900 font-sans text-sm">{order.customer.fullName}</div>
              <div className="text-neutral-600">{order.customer.address}</div>
              <div className="text-neutral-600">{order.customer.postalCode} {order.customer.city}</div>
              <div className="text-neutral-500 text-[11px]">{order.customer.phone}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Détails livraison :</span>
              <div className="font-semibold text-neutral-800">Livraison directe à domicile</div>
              <div className="text-neutral-600">Date : {order.deliverySlot.date}</div>
              <div className="text-neutral-600">Créneau : {order.deliverySlot.timeWindow}</div>
              {order.customer.accessConstraints.notes && (
                <div className="text-[11px] text-neutral-500 mt-1">
                  Note : {order.customer.accessConstraints.notes}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-300 text-neutral-500 text-[11px] uppercase font-mono-hooden">
                  <th className="pb-2 font-semibold">Article</th>
                  <th className="pb-2 font-semibold text-center">Qté</th>
                  <th className="pb-2 font-semibold text-right">P.U. HT</th>
                  <th className="pb-2 font-semibold text-center">TVA</th>
                  <th className="pb-2 font-semibold text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-mono-hooden">
                {order.items.map((item, idx) => {
                  const unitPriceHT = item.product.priceTTC / 1.10;
                  const totalLineHT = unitPriceHT * item.quantity;
                  return (
                    <tr key={idx}>
                      <td className="py-2.5 font-sans">
                        <div className="font-semibold text-neutral-900">{item.product.name}</div>
                        <div className="text-[11px] text-neutral-500 font-mono-hooden">{item.product.length}</div>
                      </td>
                      <td className="py-2.5 text-center font-bold text-neutral-800">{item.quantity}</td>
                      <td className="py-2.5 text-right">{unitPriceHT.toFixed(2)} €</td>
                      <td className="py-2.5 text-center">10%</td>
                      <td className="py-2.5 text-right font-bold text-neutral-900">{totalLineHT.toFixed(2)} €</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="py-2.5 font-sans">
                    <div className="font-semibold text-neutral-900">Livraison directe & dépose chariot</div>
                  </td>
                  <td className="py-2.5 text-center font-bold text-neutral-800">1</td>
                  <td className="py-2.5 text-right">0,00 €</td>
                  <td className="py-2.5 text-center">-</td>
                  <td className="py-2.5 text-right font-bold text-emerald-700">Offert</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-neutral-300 flex justify-end font-mono-hooden">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Total HT :</span>
                <span className="font-semibold text-neutral-900">{(order.totalTTC / 1.10).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>TVA (10%) :</span>
                <span className="font-semibold text-neutral-900">{(order.totalTTC - order.totalTTC / 1.10).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Livraison :</span>
                <span className="font-semibold text-emerald-700">0,00 €</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm font-bold">
                <span className="text-neutral-900">Total TTC :</span>
                <span className="text-amber-900 text-base font-black">{order.totalTTC.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
