import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Printer, Download, X, CheckCircle2, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveInvoiceOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveInvoiceOrder]);

  if (!activeInvoiceOrder) return null;
  const order = activeInvoiceOrder;

  const paymentLabel =
    order.paymentMethod === 'card'
      ? 'Carte bancaire'
      : order.paymentMethod === 'transcash'
      ? 'Transcash'
      : 'PCS';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Refined color palette
      const colDark: [number, number, number] = [24, 24, 27];       // zinc-900
      const colMuted: [number, number, number] = [113, 113, 122];   // zinc-500
      const colAmber: [number, number, number] = [146, 64, 14];     // amber-800
      const colEmerald: [number, number, number] = [4, 120, 87];    // emerald-700
      const colLine: [number, number, number] = [228, 228, 231];    // zinc-200
      const colCardBg: [number, number, number] = [250, 250, 250];  // zinc-50

      // Page Margins
      const marginX = 20;
      const contentWidth = 170;
      const rightX = marginX + contentWidth;

      // 1. BRAND & HEADER
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(...colDark);
      doc.text('HOODEN', marginX, 24);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...colMuted);
      doc.text('Maison Forestière · Bois de chauffage & Énergie verte', marginX, 29);
      doc.text('Dépôts régionaux France · contact@hooden.fr', marginX, 33.5);

      // Invoice metadata (Right aligned)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...colDark);
      doc.text(`FACTURE N° ${order.id.replace(/^HD-/, '')}`, rightX, 23, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...colMuted);
      doc.text(`Date d'émission : ${order.orderDate}`, rightX, 28, { align: 'right' });

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colEmerald);
      doc.text(`Acquittée · ${paymentLabel}`, rightX, 33.5, { align: 'right' });

      // Clean separator
      doc.setDrawColor(...colLine);
      doc.setLineWidth(0.3);
      doc.line(marginX, 38, rightX, 38);

      // 2. RECIPIENT & DELIVERY BOXES (Side-by-side smart cards)
      const boxY = 44;
      const boxW = 81;
      const boxH = 28;

      // Left Box: Destinataire
      doc.setFillColor(...colCardBg);
      doc.roundedRect(marginX, boxY, boxW, boxH, 2, 2, 'F');
      doc.setDrawColor(...colLine);
      doc.roundedRect(marginX, boxY, boxW, boxH, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...colMuted);
      doc.text('DESTINATAIRE / FACTURÉ À', marginX + 4, boxY + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...colDark);
      doc.text(order.customer.fullName || 'Client Hooden', marginX + 4, boxY + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(order.customer.address || '', marginX + 4, boxY + 16.5);
      doc.text(`${order.customer.postalCode || ''} ${order.customer.city || ''}`.trim(), marginX + 4, boxY + 21);
      if (order.customer.phone) {
        doc.text(`Tél : ${order.customer.phone}`, marginX + 4, boxY + 25.5);
      }

      // Right Box: Livraison & Logistique
      const rightBoxX = marginX + boxW + 8;
      doc.setFillColor(...colCardBg);
      doc.roundedRect(rightBoxX, boxY, boxW, boxH, 2, 2, 'F');
      doc.setDrawColor(...colLine);
      doc.roundedRect(rightBoxX, boxY, boxW, boxH, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...colMuted);
      doc.text('DÉTAILS DE LIVRAISON', rightBoxX + 4, boxY + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...colDark);
      doc.text(`Date prévue : ${order.deliverySlot?.date || 'À convenir'}`, rightBoxX + 4, boxY + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text('Dépose directe au sol avec chariot tout-terrain', rightBoxX + 4, boxY + 16.5);
      doc.text(`Statut : ${order.status === 'livree' ? 'Livrée' : 'En acheminement'}`, rightBoxX + 4, boxY + 21);
      doc.text(`Règlement : ${paymentLabel}`, rightBoxX + 4, boxY + 25.5);

      // 3. TABLE HEADER
      let tableY = 78;
      doc.setFillColor(244, 244, 245);
      doc.rect(marginX, tableY, contentWidth, 7, 'F');
      doc.setDrawColor(...colLine);
      doc.setLineWidth(0.3);
      doc.line(marginX, tableY + 7, rightX, tableY + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(90, 90, 95);
      doc.text('DÉSIGNATION DU PRODUIT', marginX + 4, tableY + 4.8);
      doc.text('QTÉ', 115, tableY + 4.8, { align: 'center' });
      doc.text('PRIX UNIT.', 146, tableY + 4.8, { align: 'right' });
      doc.text('TOTAL TTC', rightX - 4, tableY + 4.8, { align: 'right' });

      tableY += 7;

      // 4. TABLE ROWS
      order.items.forEach((item) => {
        const rowHeight = 11;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...colDark);
        doc.text(item.product.name, marginX + 4, tableY + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...colMuted);
        doc.text(`Format : ${item.product.length} · Humidité contrôlée < 20%`, marginX + 4, tableY + 8.8);

        // Qty
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...colDark);
        doc.text(String(item.quantity), 115, tableY + 5.5, { align: 'center' });

        // Unit Price
        doc.text(`${item.product.priceTTC.toFixed(2)} €`, 146, tableY + 5.5, { align: 'right' });

        // Total
        doc.setFont('helvetica', 'bold');
        doc.text(`${(item.product.priceTTC * item.quantity).toFixed(2)} €`, rightX - 4, tableY + 5.5, {
          align: 'right',
        });

        tableY += rowHeight;
        doc.setDrawColor(241, 241, 244);
        doc.line(marginX, tableY, rightX, tableY);
      });

      // Delivery row
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...colDark);
      doc.text('Livraison directe à domicile (chariot embarqué)', marginX + 4, tableY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...colMuted);
      doc.text('Dépose soignée à l\'endroit désigné', marginX + 4, tableY + 8.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('1', 115, tableY + 5.5, { align: 'center' });
      doc.text('0,00 €', 146, tableY + 5.5, { align: 'right' });

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colEmerald);
      doc.text('Incluse', rightX - 4, tableY + 5.5, { align: 'right' });

      tableY += 11;
      doc.setDrawColor(...colLine);
      doc.line(marginX, tableY, rightX, tableY);

      // 5. SUMMARY / TOTALS (Smart right-aligned card)
      tableY += 5;
      const totalsW = 68;
      const totalsX = rightX - totalsW;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...colMuted);
      doc.text('Frais de port & dépose :', totalsX, tableY + 4);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colEmerald);
      doc.text('Inclus (0,00 €)', rightX - 4, tableY + 4, { align: 'right' });

      tableY += 6.5;
      doc.setDrawColor(...colLine);
      doc.line(totalsX, tableY, rightX, tableY);

      tableY += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...colDark);
      doc.text('Total réglé :', totalsX, tableY + 5);

      doc.setFontSize(12);
      doc.setTextColor(...colAmber);
      doc.text(`${order.totalTTC.toFixed(2)} €`, rightX - 4, tableY + 5, { align: 'right' });

      // 6. FOOTER
      const footerY = 270;
      doc.setDrawColor(...colLine);
      doc.setLineWidth(0.3);
      doc.line(marginX, footerY, rightX, footerY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...colMuted);
      doc.text('HOODEN · Bois de chauffage haute performance prêt à brûler · www.hooden.fr', 105, footerY + 6, {
        align: 'center',
      });
      doc.text('Document tenant lieu de reçu de paiement et de facture certifiée pour votre commande.', 105, footerY + 10.5, {
        align: 'center',
      });

      // Save PDF
      doc.save(`Facture-HOODEN-${order.id.replace(/^HD-/, '')}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div
      onClick={() => setActiveInvoiceOrder(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      {/* Smart, Crisp Invoice Card - Click inside won't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-neutral-200/90 rounded-2xl max-w-lg w-full text-neutral-900 shadow-2xl relative my-auto overflow-hidden cursor-default transition-all"
      >
        {/* Smart Integrated Action Header */}
        <div className="no-print px-5 pt-4 pb-3 flex items-center justify-between border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 font-mono-hooden bg-amber-100/80 px-2 py-0.5 rounded">
              Facture acquittée
            </span>
            <span className="text-xs font-mono-hooden text-neutral-500 font-medium">
              n° {order.id.replace(/^HD-/, '')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Télécharger la facture au format PDF"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : downloadSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{downloadSuccess ? 'Téléchargé' : 'PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors cursor-pointer"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveInvoiceOrder(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/70 rounded-lg transition-colors cursor-pointer ml-0.5"
              aria-label="Fermer"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Crisp Document Body */}
        <div id="invoice-print-area" className="p-5 sm:p-6 space-y-5 text-neutral-900">
          {/* Brand & Reference */}
          <div className="flex justify-between items-start gap-4 pb-4 border-b border-neutral-100">
            <div>
              <div className="text-xl font-bold tracking-tight font-serif-hooden text-neutral-950">
                HOODEN
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Maison Forestière · Bois de Chauffage
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div className="text-xs font-bold font-mono-hooden text-neutral-950">
                FACTURE N° {order.id.replace(/^HD-/, '')}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono-hooden">
                Date : {order.orderDate}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700 font-mono-hooden">
                Réglée par {paymentLabel}
              </div>
            </div>
          </div>

          {/* Destinataire & Livraison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
              <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono-hooden block mb-1">
                Destinataire
              </span>
              <div className="font-semibold text-neutral-900">{order.customer.fullName}</div>
              <div className="text-neutral-600 text-[11px] mt-0.5">{order.customer.address}</div>
              <div className="text-neutral-600 text-[11px] font-mono-hooden">
                {order.customer.postalCode} {order.customer.city}
              </div>
              {order.customer.phone && (
                <div className="text-neutral-500 font-mono-hooden text-[11px] mt-0.5">
                  {order.customer.phone}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
              <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono-hooden block mb-1">
                Livraison
              </span>
              <div className="font-semibold text-neutral-900">
                Date prévue : {order.deliverySlot?.date || 'À convenir'}
              </div>
              <div className="text-neutral-600 text-[11px] mt-0.5">
                Dépose soignée par chariot embarqué
              </div>
              <div className="text-neutral-500 text-[11px] font-mono-hooden mt-0.5">
                Statut : {order.status === 'livree' ? 'Livrée' : 'En acheminement'}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] uppercase font-mono-hooden">
                  <th className="pb-1.5 font-medium">Article</th>
                  <th className="pb-1.5 font-medium text-center">Qté</th>
                  <th className="pb-1.5 font-medium text-right">Prix</th>
                  <th className="pb-1.5 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono-hooden text-[11px]">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-sans">
                      <div className="font-semibold text-neutral-900">{item.product.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono-hooden">
                        {item.product.length}
                      </div>
                    </td>
                    <td className="py-2.5 text-center text-neutral-700">{item.quantity}</td>
                    <td className="py-2.5 text-right text-neutral-700">
                      {item.product.priceTTC.toFixed(2)} €
                    </td>
                    <td className="py-2.5 text-right font-semibold text-neutral-900">
                      {(item.product.priceTTC * item.quantity).toFixed(2)} €
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2.5 font-sans text-neutral-700">
                    <div>Livraison directe à domicile</div>
                    <div className="text-[10px] text-neutral-500">Chariot tout-terrain embarqué</div>
                  </td>
                  <td className="py-2.5 text-center text-neutral-700">1</td>
                  <td className="py-2.5 text-right text-neutral-700">0,00 €</td>
                  <td className="py-2.5 text-right font-semibold text-emerald-700">Incluse</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-neutral-200 flex justify-end font-mono-hooden">
            <div className="w-48 space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>Livraison :</span>
                <span className="text-emerald-700 font-medium">Incluse</span>
              </div>
              <div className="pt-1.5 border-t border-neutral-200 flex justify-between items-baseline font-bold text-neutral-950">
                <span className="text-xs">Total réglé :</span>
                <span className="text-amber-900 text-base font-black">
                  {order.totalTTC.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
