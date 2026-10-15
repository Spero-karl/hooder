import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, UserProfile, DeliveryOption, DeliverySlot, DeliveryAddress, PaymentMethod, AppNotification } from '../types';
import { PRODUCTS, DELIVERY_OPTIONS } from '../data/products';
import { INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartTotalSteres: number;
  cartTotalWeightKg: number;
  cartSubtotalTTC: number;
  
  // Checkout & Orders
  orders: Order[];
  createOrder: (orderData: {
    customer: DeliveryAddress;
    deliveryMethod: DeliveryOption;
    deliverySlot: DeliverySlot;
    paymentMethod: PaymentMethod;
  }) => Order;
  
  // Modals & Active Views
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  
  // User Authentication
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loginDemoUser: (asPro?: boolean) => void;
  logoutUser: () => void;
  
  // Notifications
  notification: AppNotification | null;
  dismissNotification: () => void;
  showNotification: (data: AppNotification | string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initial friendly pre-fill so user can test checkout & invoice instantly
    return [
      { product: PRODUCTS[0], quantity: 1 }
    ];
  });
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  
  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  
  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dismissNotification = useCallback(() => {
    setNotification(null);
    setToastMessage(null);
  }, []);

  const showNotification = useCallback((data: AppNotification | string) => {
    if (typeof data === 'string') {
      const newNotif: AppNotification = {
        id: String(Date.now()),
        title: data,
        type: 'info',
      };
      setNotification(newNotif);
      setToastMessage(data);
    } else {
      setNotification(data);
      setToastMessage(data.title);
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    showNotification({
      id: String(Date.now()),
      title: msg,
      type: 'info'
    });
  }, [showNotification]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showNotification({
      id: String(Date.now()),
      title: 'Ajouté au panier',
      message: `${product.name} (x${quantity}) · ${(product.priceTTC * quantity).toFixed(2)} €`,
      thumbnail: product.imageUrl,
      actionLabel: 'Voir le panier',
      onAction: () => setIsCartOpen(true),
      type: 'cart',
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalSteres = cart.reduce((acc, item) => acc + item.product.volumeSteres * item.quantity, 0);
  const cartTotalWeightKg = cart.reduce((acc, item) => acc + item.product.weightKg * item.quantity, 0);
  const cartSubtotalTTC = cart.reduce((acc, item) => acc + item.product.priceTTC * item.quantity, 0);

  const loginDemoUser = (asPro = false) => {
    if (asPro) {
      setUser({
        id: 'usr-pro-idf',
        fullName: 'Boulangerie Tradition & Feu de Bois SAS',
        email: 'direction@feudebois-paris.fr',
        phone: '01 43 28 90 12',
        isPro: true,
        siret: '849 203 118 00024',
        tvaNumber: 'FR 22 849203118',
        savedAddress: {
          fullName: 'M. Laurent Mercier (Directeur d\'exploitation)',
          companyName: 'Fournil des Batignolles',
          email: 'direction@feudebois-paris.fr',
          phone: '01 43 28 90 12',
          address: '77 Rue Legendre',
          postalCode: '75017',
          city: 'Paris',
          accessConstraints: {
            hasNarrowStreet: true,
            hasGravelOrGrass: false,
            hasGateOverTwoMeters: false,
            hasSteps: false,
            weightRestrictionUnder35T: false,
            notes: 'Livraison cour arrière du fournil - Créneau impératif avant 10h'
          }
        },
        loyaltyPoints: 1250
      });
      showToast('Connecté au compte Professionnel (Fournil des Batignolles)');
    } else {
      setUser(INITIAL_USER);
      showToast('Connecté au compte Karl Freaton (Paris 16e)');
    }
    setIsAuthOpen(false);
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Vous avez été déconnecté.');
  };

  const createOrder = ({
    customer,
    deliveryMethod,
    deliverySlot,
    paymentMethod,
  }: {
    customer: DeliveryAddress;
    deliveryMethod: DeliveryOption;
    deliverySlot: DeliverySlot;
    paymentMethod: PaymentMethod;
  }): Order => {
    const orderNumber = `HOOD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toISOString().split('T')[0];

    // Compute VAT breakdown
    let subtotalFirewoodHT = 0;
    let subtotalAccessoriesHT = 0;

    cart.forEach((item) => {
      const lineTTC = item.product.priceTTC * item.quantity;
      if (item.product.tvaRate === 10) {
        subtotalFirewoodHT += lineTTC / 1.10;
      } else {
        subtotalAccessoriesHT += lineTTC / 1.20;
      }
    });

    const shippingHT = deliveryMethod.extraFeeTTC / 1.20; // 20% on shipping
    const tva10Amount = (subtotalFirewoodHT * 0.10);
    const tva20Amount = ((subtotalAccessoriesHT + shippingHT) * 0.20);
    const totalHT = subtotalFirewoodHT + subtotalAccessoriesHT + shippingHT;
    const shippingFeeTTC = deliveryMethod.extraFeeTTC;
    const totalTTC = cartSubtotalTTC + shippingFeeTTC;

    const newOrder: Order = {
      id: orderNumber,
      orderDate: todayStr,
      status: 'confirmee',
      customer,
      items: [...cart],
      subtotalHT: Math.round(subtotalFirewoodHT + subtotalAccessoriesHT * 100) / 100,
      tva10Amount: Math.round(tva10Amount * 100) / 100,
      tva20Amount: Math.round(tva20Amount * 100) / 100,
      totalHT: Math.round(totalHT * 100) / 100,
      shippingFeeTTC,
      totalTTC: Math.round(totalTTC * 100) / 100,
      deliveryMethod,
      deliverySlot,
      paymentMethod,
      paymentStatus: 'paye',
      driverInfo: {
        name: 'Sébastien Vasseur',
        phone: '06 84 33 21 09',
        truckType: 'Scania 26T Grue Palfinger & Chariot Tout-Terrain',
        plateNumber: 'HP-904-BK',
        etaMinutes: 180,
        currentStep: 'Commande validée par le bureau logistique Paris-Gennevilliers'
      }
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalCount,
        cartTotalSteres,
        cartTotalWeightKg,
        cartSubtotalTTC,
        orders,
        createOrder,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        isDashboardOpen,
        setIsDashboardOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        activeTrackingOrder,
        setActiveTrackingOrder,
        user,
        setUser,
        loginDemoUser,
        logoutUser,
        notification,
        dismissNotification,
        showNotification,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
