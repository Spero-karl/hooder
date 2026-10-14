import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryAddress, DeliverySlot, PaymentMethod } from '../types';
import { UPCOMING_DELIVERY_DATES } from '../data/mockData';
import { DEFAULT_DELIVERY_OPTION } from '../data/products';
import { X, CreditCard, ArrowRight, FileText, Truck, Check } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalTTC,
    createOrder,
    setActiveInvoiceOrder,
    setActiveTrackingOrder,
    user,
  } = useApp();

  // Contact & Address
  const [fullName, setFullName] = useState(user?.fullName || 'Karl Freaton');
  const [phone, setPhone] = useState(user?.phone || '06 12 45 78 90');
  const [email, setEmail] = useState(user?.email || 'karlfreaton@gmail.com');
  const [address, setAddress] = useState(user?.savedAddress?.address || '42 Avenue Victor Hugo');
  const [postalCode, setPostalCode] = useState(user?.savedAddress?.postalCode || '75116');
  const [city, setCity] = useState(user?.savedAddress?.city || 'Paris');
  const [notes, setNotes] = useState('Dans la cour ou sous le préau');

  // Delivery Date
  const [selectedDate, setSelectedDate] = useState<string>(UPCOMING_DELIVERY_DATES[0].fullDate);

  // Payment: strictly Carte Bancaire, Transcash, PayPal
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('742');
  const [transcashCode, setTranscashCode] = useState('');

  // Submission & Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const customerData: DeliveryAddress = {
        fullName,
        email,
        phone,
        address,
        postalCode,
        city,
        accessConstraints: {
          hasNarrowStreet: false,
          hasGravelOrGrass: false,
          hasGateOverTwoMeters: false,
          hasSteps: false,
          weightRestrictionUnder35T: false,
          notes,
        },
      };

      const slotData: DeliverySlot = {
        date: selectedDate,
        timeWindow: 'Matin (08h00 - 12h00)',
      };

      const created = createOrder({
        customer: customerData,
        deliveryMethod: DEFAULT_DELIVERY_OPTION,
        deliverySlot: slotData,
        paymentMethod,
      });

      setIsSubmitting(false);
      setCompletedOrder(created);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-4xl w-full text-neutral-900 shadow-2xl relative my-6 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-hooden text-amber-300 font-bold uppercase tracking-wider">
              MAISON HOODEN • COMMANDE EN LIGNE
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER CONFIRMATION SCREEN */}
        {completedOrder ? (
          <div className="p-8 sm:p-12 text-center max-w-lg mx-auto space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
              <Check className="w-7 h-7 text-emerald-700 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold font-serif-hooden text-neutral-950">
                Commande confirmée
              </h2>
              <p className="text-xs font-mono-hooden text-neutral-500">
                Numéro de commande : <strong className="text-neutral-900">{completedOrder.id}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs font-mono-hooden space-y-2">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Date de livraison :</span>
                <span className="font-bold text-neutral-900">{completedOrder.deliverySlot.date}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Adresse de dépose :</span>
                <span className="text-neutral-900 font-medium truncate max-w-[220px]">
                  {completedOrder.customer.address}, {completedOrder.customer.city}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Paiement :</span>
                <span className="text-neutral-900 font-semibold uppercase">
                  {completedOrder.paymentMethod === 'card' ? 'Carte Bancaire' : completedOrder.paymentMethod === 'transcash' ? 'Ticket Transcash' : 'PayPal'}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold">
                <span className="text-neutral-900">Total réglé TTC :</span>
                <span className="text-amber-900 font-black">{completedOrder.totalTTC.toFixed(2)} €</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setActiveInvoiceOrder(completedOrder);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Voir la Facture</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setActiveTrackingOrder(completedOrder);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-neutral-400" />
                <span>Suivre la Livraison</span>
              </button>
            </div>
          </div>
        ) : (
          /* SIMPLE 2-COLUMN CHECKOUT */
          <form onSubmit={handleProcessOrder} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: Coordinates & Date */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="text-base font-bold font-serif-hooden text-neutral-950">
                    1. Coordonnées de livraison
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Téléphone portable *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-800 font-mono-hooden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Adresse e-mail (pour la facture) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Adresse de livraison *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Numéro et rue..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Code Postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-mono-hooden focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Précision pour la dépose (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex : Dans l'allée, sous l'abri..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>

                {/* Delivery Date Selection */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-neutral-900 mb-2">
                    Date de livraison souhaitée :
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {UPCOMING_DELIVERY_DATES.slice(0, 4).map((d) => (
                      <button
                        key={d.fullDate}
                        type="button"
                        onClick={() => setSelectedDate(d.fullDate)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedDate === d.fullDate
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className={`text-[10px] font-mono-hooden uppercase ${
                          selectedDate === d.fullDate ? 'text-amber-300 font-bold' : 'text-neutral-500'
                        }`}>
                          {d.date.split('(')[0]}
                        </div>
                        <div className="text-xs font-bold mt-0.5 truncate">
                          {d.fullDate}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 text-[11px] text-neutral-500">
                    Dépose chariot tout-terrain incluse
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Summary & Payment */}
              <div className="lg:col-span-5 bg-neutral-50 rounded-2xl p-5 sm:p-6 border border-neutral-200 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold font-serif-hooden text-neutral-950">
                      2. Paiement & Récapitulatif
                    </h3>
                  </div>

                  {/* Cart Items */}
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-200">
                    {cart.map((item) => (
                      <div key={item.product.id} className="pt-2 flex justify-between items-center text-xs">
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-neutral-900 truncate">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono-hooden">
                            Qté : {item.quantity} • {item.product.length}
                          </div>
                        </div>
                        <div className="font-mono-hooden font-bold text-neutral-900 shrink-0">
                          {(item.product.priceTTC * item.quantity).toFixed(2)} €
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1.5 text-xs font-mono-hooden">
                    <div className="flex justify-between text-neutral-600">
                      <span>Sous-total articles :</span>
                      <span>{cartSubtotalTTC.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Livraison directe :</span>
                      <span className="text-emerald-700 font-bold">Gratuite</span>
                    </div>
                    <div className="flex justify-between text-neutral-500 text-[10px]">
                      <span>Dont TVA légale 10% :</span>
                      <span>{(cartSubtotalTTC - cartSubtotalTTC / 1.10).toFixed(2)} €</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm font-bold">
                      <span className="text-neutral-950 uppercase text-xs">Total TTC :</span>
                      <span className="text-amber-900 text-lg font-black">
                        {cartSubtotalTTC.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {/* Payment Mode Selection: CB, Transcash, PayPal */}
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-2 uppercase tracking-wide">
                      Mode de paiement :
                    </label>

                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="text-[11px]">Carte bancaire</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transcash')}
                        className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'transcash'
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="text-xs font-bold font-mono-hooden text-amber-500">TC</span>
                        <span className="text-[11px]">Transcash</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          paymentMethod === 'paypal'
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="text-xs font-bold font-serif-hooden text-blue-500 italic">P</span>
                        <span className="text-[11px]">PayPal</span>
                      </button>
                    </div>

                    {/* Carte Bancaire Inputs */}
                    {paymentMethod === 'card' && (
                      <div className="p-3 rounded-xl bg-white border border-neutral-200 space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] text-neutral-500 block mb-0.5">Numéro de carte</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono-hooden"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-0.5">Expiration</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono-hooden text-center"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-neutral-500 block mb-0.5">Cryptogramme (CVC)</label>
                            <input
                              type="text"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className="w-full p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-mono-hooden text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Transcash Inputs */}
                    {paymentMethod === 'transcash' && (
                      <div className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-2 text-xs">
                        <label className="text-[11px] font-semibold text-neutral-800 block">
                          Code du coupon / recharge Transcash (12 chiffres)
                        </label>
                        <input
                          type="text"
                          required
                          value={transcashCode}
                          onChange={(e) => setTranscashCode(e.target.value)}
                          placeholder="Ex: 5849 2031 9842"
                          className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs font-mono-hooden tracking-wider"
                        />
                        <p className="text-[10px] text-neutral-500 leading-snug">
                          Entrez le code figurant sur votre ticket Transcash acheté en bureau de tabac ou en ligne.
                        </p>
                      </div>
                    )}

                    {/* PayPal Input */}
                    {paymentMethod === 'paypal' && (
                      <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
                        <div className="text-xs text-neutral-700 font-medium">
                          Vous serez redirigé vers l'interface PayPal pour valider votre paiement en toute simplicité.
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0070ba] text-white rounded-lg text-xs font-bold">
                          <span>Payer avec PayPal</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 mt-4 border-t border-neutral-200 space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Traitement en cours...
                      </span>
                    ) : (
                      <>
                        <span>Payer {cartSubtotalTTC.toFixed(2)} €</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>

                  <div className="text-[10px] text-neutral-400 text-center">
                    Facture émise dès la validation
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
