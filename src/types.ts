export type WoodSpecies = 'Chêne' | 'Hêtre' | 'Charme' | 'Frêne' | 'Mélange feuillus durs' | 'Résineux 100%';

export type WoodLength = '25 cm' | '30 cm' | '33 cm' | '50 cm' | 'Pellets 6mm' | 'Bûche densifiée 30cm';

export type PackagingType = 
  | 'Palette rangée main'
  | 'Palette box grillagée'
  | 'Vrac benne basculante'
  | 'Big-Bag respirant'
  | 'Filet aéré'
  | 'Sacs 15kg (Palette)';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'buches-seches' | 'densifiees' | 'pellets' | 'allumage' | 'accessoires';
  species: WoodSpecies;
  length: WoodLength;
  packaging: PackagingType;
  volumeSteres: number;
  apparentM3: number;
  weightKg: number;
  humidityRate: string; // e.g. "14% - 17% garanti"
  calorificPower: string; // e.g. "4.2 kWh/kg (env. 2000 kWh/stère)"
  priceTTC: number;
  pricePerStere?: number;
  bulkDiscountInfo?: string;
  tvaRate: 10 | 20; // 10% for firewood, 20% for accessories/appliances
  unit: string;
  inStock: boolean;
  stockCount: number;
  origin: string;
  badge?: string;
  description: string;
  technicalSpecs: {
    ashRate: string;
    dryingMethod: string;
    recommendedAppliance: string[];
    barkPercentage: string;
    labelNF?: boolean;
    pefc?: boolean;
  };
  imageUrl: string;
  galleryImages?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message?: string;
  thumbnail?: string;
  badge?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'cart' | 'order' | 'info';
}

export type DeliveryMethodId = 'livraison-soignee-domicile' | 'transpalette-tout-terrain' | 'camion-grue' | 'hayon-standard' | 'benne-vrac';

export interface DeliveryOption {
  id: DeliveryMethodId;
  name: string;
  subtitle: string;
  description: string;
  extraFeeTTC: number;
  icon?: string;
  recommendedFor?: string;
}

export interface DeliveryAddress {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  addressDetails?: string;
  postalCode: string;
  city: string;
  accessConstraints: {
    hasNarrowStreet: boolean;
    hasGravelOrGrass: boolean;
    hasGateOverTwoMeters: boolean;
    hasSteps: boolean;
    weightRestrictionUnder35T: boolean;
    notes?: string;
  };
}

export interface DeliverySlot {
  date: string;
  timeWindow: string; // e.g. "08h00 - 10h00"
}

export type PaymentMethod = 'card' | 'transcash' | 'pcs';

export interface Order {
  id: string; // e.g. "HD-4891"
  orderDate: string;
  status: 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree';
  customer: DeliveryAddress;
  items: CartItem[];
  subtotalHT: number;
  tva10Amount: number;
  tva20Amount: number;
  totalHT: number;
  shippingFeeTTC: number;
  totalTTC: number;
  deliveryMethod: DeliveryOption;
  deliverySlot: DeliverySlot;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paye' | 'en_attente_virement' | 'acompte_regle';
  driverInfo?: {
    name: string;
    phone: string;
    truckType: string;
    plateNumber: string;
    etaMinutes: number;
    currentStep: string;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isPro: boolean;
  siret?: string;
  tvaNumber?: string;
  savedAddress?: DeliveryAddress;
  loyaltyPoints: number;
}
