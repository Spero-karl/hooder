import React, { useState, useEffect } from 'react';
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

  // Address fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.savedAddress?.address || '');
  const [postalCode, setPostalCode] = useState(user?.savedAddress?.postalCode || '');
  const [city, setCity] = useState(user?.savedAddress?.city || '');

  // Delivery Date
  const [selectedDate, setSelectedDate] = useState<string>(UPCOMING_DELIVERY_DATES[0].fullDate);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [transcashCode, setTranscashCode] = useState('');
  const [pcsCode, setPcsCode] = useState('');

  // Synchronize fields if user profile changes
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
      if (user.savedAddress?.address) setAddress(user.savedAddress.address);
      if (user.savedAddress?.postalCode) setPostalCode(user.savedAddress.postalCode);
      if (user.savedAddress?.city) setCity(user.savedAddress.city);
    }
  }, [user]);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isCheckoutOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCheckoutOpen(false);
        setCompletedOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, setIsCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
          notes: '',
        },
      };

      const slotData: DeliverySlot = {
        date: selectedDate,
        timeWindow: 'Matin (08h00 - 12h00)',
      };

      const order = createOrder({
        customer: customerData,
        deliveryMethod: DEFAULT_DELIVERY_OPTION,
        deliverySlot: slotData,
        paymentMethod,
      });

      setIsSubmitting(false);
      setCompletedOrder(order);
    }, 600);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-neutral-200 rounded-2xl max-w-3xl w-full text-neutral-900 shadow-2xl relative my-6 overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-base font-bold font-serif-hooden text-neutral-950">
            {completedOrder ? 'Confirmation' : 'Paiement'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {completedOrder ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif-hooden text-neutral-950">
                Commande validée
              </h3>
              <p className="text-xs font-mono-hooden text-neutral-500 mt-1">
                Numéro : <span className="text-neutral-900 font-semibold">Commande n° {completedOrder.id.replace(/^HD-/, '')}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs font-mono-hooden space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Date :</span>
                <span className="text-neutral-900 font-semibold">{completedOrder.deliverySlot.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Adresse :</span>
                <span className="text-neutral-900 font-medium truncate max-w-[200px]">
                  {completedOrder.customer.address}, {completedOrder.customer.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Paiement :</span>
                <span className="text-neutral-900 font-medium">
                  {completedOrder.paymentMethod === 'card'
                    ? 'Carte bancaire'
                    : completedOrder.paymentMethod === 'transcash'
                    ? 'Transcash'
                    : 'PCS'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold">
                <span className="text-neutral-950">Total réglé :</span>
                <span className="text-amber-900">{completedOrder.totalTTC.toFixed(2)} €</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setActiveInvoiceOrder(completedOrder);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Facture</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setActiveTrackingOrder(completedOrder);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Suivi livraison</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Address */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono-hooden">
                  Adresse de livraison
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-neutral-600 block mb-1">Nom et prénom</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-neutral-600 block mb-1">Téléphone</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs text-neutral-900 font-mono-hooden focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-600 block mb-1">E-mail</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-600 block mb-1">Adresse</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Numéro et voie..."
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-neutral-600 block mb-1">Code postal</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs text-neutral-900 font-mono-hooden focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-neutral-600 block mb-1">Ville</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  {/* Delivery Date Selection */}
                  <div className="pt-2">
                    <label className="text-xs text-neutral-600 block mb-1">Date de livraison</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {UPCOMING_DELIVERY_DATES.slice(0, 4).map((d) => (
                        <button
                          key={d.fullDate}
                          type="button"
                          onClick={() => setSelectedDate(d.fullDate)}
                          className={`p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                            selectedDate === d.fullDate
                              ? 'bg-neutral-950 text-white border-neutral-950'
                              : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <div className="font-semibold truncate">{d.fullDate}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono-hooden mb-3">
                    Mode de paiement
                  </h3>

                  {/* Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1" />
                      <span>Carte bancaire</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transcash')}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                        paymentMethod === 'transcash'
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono-hooden mb-1">TC</span>
                      <span>Transcash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pcs')}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                        paymentMethod === 'pcs'
                          ? 'border-neutral-950 bg-neutral-950 text-white'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono-hooden mb-1">PCS</span>
                      <span>PCS</span>
                    </button>
                  </div>

                  {/* Payment Inputs */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-2.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                      <div>
                        <label className="text-[11px] text-neutral-500 block mb-1">Numéro de carte</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="•••• •••• •••• ••••"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 font-mono-hooden text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-neutral-500 block mb-1">Expiration</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/AA"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 font-mono-hooden text-xs text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-neutral-500 block mb-1">CVC</label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 font-mono-hooden text-xs text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'transcash' && (
                    <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                      <label className="text-[11px] text-neutral-600 block">
                        Code de recharge Transcash (12 chiffres)
                      </label>
                      <input
                        type="text"
                        required
                        value={transcashCode}
                        onChange={(e) => setTranscashCode(e.target.value)}
                        placeholder="Ex: 4892 1045 7712"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 font-mono-hooden text-xs tracking-wider"
                      />
                      <p className="text-[10px] text-neutral-400">
                        Code figurant sur votre reçu Transcash.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'pcs' && (
                    <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                      <label className="text-[11px] text-neutral-600 block">
                        Code coupon / recharge PCS (10 chiffres)
                      </label>
                      <input
                        type="text"
                        required
                        value={pcsCode}
                        onChange={(e) => setPcsCode(e.target.value)}
                        placeholder="Ex: 9482 1045 77"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 font-mono-hooden text-xs tracking-wider"
                      />
                      <p className="text-[10px] text-neutral-400">
                        Code figurant sur votre ticket ou recharge PCS Mastercard.
                      </p>
                    </div>
                  )}

                  {/* Summary row */}
                  <div className="mt-4 pt-3 border-t border-neutral-200 space-y-1.5 text-xs font-mono-hooden">
                    <div className="flex justify-between text-neutral-600">
                      <span>Articles ({cart.length}) :</span>
                      <span>{cartSubtotalTTC.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Livraison :</span>
                      <span className="text-emerald-700 font-medium">Incluse</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-950">
                      <span>Total :</span>
                      <span className="text-amber-900 text-base font-black">
                        {cartSubtotalTTC.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full mt-4 py-3.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Validation...</span>
                  ) : (
                    <>
                      <span>Payer {cartSubtotalTTC.toFixed(2)} €</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
