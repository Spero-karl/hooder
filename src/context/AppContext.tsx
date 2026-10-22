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
  loginUser: (email: string, password?: string) => { success: boolean; error?: string };
  registerUser: (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    isPro?: boolean;
    companyName?: string;
  }) => { success: boolean; error?: string };
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
    try {
      const stored = localStorage.getItem('hooden_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('hooden_orders');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('hooden_active_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem('hooden_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('hooden_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('hooden_active_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('hooden_active_user');
      }
    } catch {}
  }, [user]);
  
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

  const loginUser = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Veuillez saisir votre adresse e-mail.' };
    }

    let usersList: any[] = [];
    try {
      const stored = localStorage.getItem('hooden_registered_users');
      if (stored) usersList = JSON.parse(stored);
    } catch {}

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (password && existing.password && existing.password !== password) {
        return { success: false, error: 'Mot de passe incorrect.' };
      }
      setUser(existing);
      showToast(`Bienvenue, ${existing.fullName.split(' ')[0]} !`);
      setIsAuthOpen(false);
      return { success: true };
    }

    // Direct registration on first login if not registered
    const inferredName = cleanEmail
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: inferredName || 'Client Hooden',
      email: cleanEmail,
      phone: '',
      isPro: cleanEmail.includes('pro') || cleanEmail.includes('sas') || cleanEmail.includes('sarl'),
      loyaltyPoints: 50,
    };

    usersList.push({ ...newUser, password });
    try {
      localStorage.setItem('hooden_registered_users', JSON.stringify(usersList));
    } catch {}

    setUser(newUser);
    showToast(`Bienvenue, ${newUser.fullName.split(' ')[0]} !`);
    setIsAuthOpen(false);
    return { success: true };
  };

  const registerUser = (data: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    isPro?: boolean;
    companyName?: string;
  }): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail || !data.fullName.trim()) {
      return { success: false, error: 'Veuillez renseigner votre nom et une adresse e-mail valide.' };
    }

    let usersList: any[] = [];
    try {
      const stored = localStorage.getItem('hooden_registered_users');
      if (stored) usersList = JSON.parse(stored);
    } catch {}

    const existing = usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'Un compte existe déjà avec cette adresse e-mail. Veuillez vous connecter.' };
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      isPro: !!data.isPro,
      loyaltyPoints: 100,
    };

    usersList.push({ ...newUser, password: data.password });
    try {
      localStorage.setItem('hooden_registered_users', JSON.stringify(usersList));
    } catch {}

    setUser(newUser);
    showToast('Votre compte client a été créé avec succès. Bienvenue chez Hooden !');
    setIsAuthOpen(false);
    return { success: true };
  };

  const loginDemoUser = (asPro = false) => {
    loginUser(asPro ? 'professionnel@bois-energie.fr' : 'client@hooden.fr');
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
    const orderNumber = `HD-${Math.floor(1000 + Math.random() * 9000)}`;
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

    // If a user is logged in, associate this address to their profile
    if (user && !user.savedAddress) {
      setUser((u) => (u ? { ...u, savedAddress: customer } : u));
    }

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
        loginUser,
        registerUser,
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
