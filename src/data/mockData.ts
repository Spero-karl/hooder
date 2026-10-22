import { Order, UserProfile } from '../types';
import { PRODUCTS, DELIVERY_OPTIONS } from './products';

export const HOODEN_COMPANY = {
  name: 'HOODEN SAS',
  tagline: 'Exploitation Forestière & Combustibles Biomasse Haute Performance',
  capital: '250 000 €',
  addressLine1: '18 Rue de la Boétie',
  postalCode: '75008',
  city: 'Paris',
  country: 'France',
  depotParis: 'Plateforme Logistique Fluviale & Poids Lourds : Port de Gennevilliers - Quai de Clichy, 92230 Gennevilliers',
  depotHubEst: 'Hub National Séchage & Stockage : Forêt domaniale de Morvan / Sens (89)',
  phone: '01 89 71 42 00',
  hotlineEmergency: '01 89 71 42 09 (Assistance Chauffeurs en direct)',
  email: 'contact@hooden.fr',
  facturationEmail: 'facturation@hooden.fr',
  siren: '912 345 678',
  siret: '912 345 678 00018',
  rcs: 'R.C.S. Paris B 912 345 678',
  tvaIntracom: 'FR 45 912345678',
  nafCode: '4671Z - Commerce de gros de combustibles solides',
  certifications: [
    'NF Biocombustibles Solides NF 334',
    'PEFC / 10-31-1492 (Forêts gérées durablement)',
    'Bois de France Éco-Responsable',
    'Charte Qualité Flamme Verte 7*'
  ],
  rib: {
    bank: 'BNF Paribas Élysées',
    iban: 'FR76 3000 4001 2300 0123 4567 890',
    bic: 'BNPAFR21XXX'
  }
};

export const INITIAL_USER: UserProfile = {
  id: 'usr-karl-paris',
  fullName: 'Karl Freaton',
  email: 'karlfreaton@gmail.com',
  phone: '06 12 45 78 90',
  isPro: false,
  savedAddress: {
    fullName: 'Karl Freaton',
    email: 'karlfreaton@gmail.com',
    phone: '06 12 45 78 90',
    address: '42 Avenue Victor Hugo',
    addressDetails: 'Portail noir, sonnerie interphone Freaton, accès cour gravillonnée',
    postalCode: '75116',
    city: 'Paris',
    accessConstraints: {
      hasNarrowStreet: false,
      hasGravelOrGrass: true,
      hasGateOverTwoMeters: false,
      hasSteps: false,
      weightRestrictionUnder35T: false,
      notes: 'Déposer la palette au fond à droite sous le porche à l\'abri de la pluie'
    }
  },
  loyaltyPoints: 340
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'HD-4891',
    orderDate: '2026-10-12',
    status: 'en_livraison',
    customer: INITIAL_USER.savedAddress!,
    items: [
      {
        product: PRODUCTS[0], // Palette Chêne 33cm (2 stères - 140€ TTC)
        quantity: 1
      },
      {
        product: PRODUCTS[5], // Demi-palette Chêne 33cm (1 stère - 78€ TTC)
        quantity: 1
      }
    ],
    subtotalHT: 198.18,
    tva10Amount: 19.82,
    tva20Amount: 0.00,
    totalHT: 198.18,
    shippingFeeTTC: 0.00,
    totalTTC: 218.00,
    deliveryMethod: DELIVERY_OPTIONS[0],
    deliverySlot: {
      date: '2026-10-14',
      timeWindow: '10h00 - 12h00'
    },
    paymentMethod: 'card',
    paymentStatus: 'paye',
    driverInfo: {
      name: 'Jean-Marc Tardieu',
      phone: '06 98 12 34 56',
      truckType: 'Mercedes-Benz Actros 18T équipé chariot embarqué',
      plateNumber: 'GF-482-TX',
      etaMinutes: 24,
      currentStep: 'Camion en approche (à 4,2 km de votre adresse - Porte Maillot)'
    }
  },
  {
    id: 'HD-2180',
    orderDate: '2026-09-28',
    status: 'livree',
    customer: INITIAL_USER.savedAddress!,
    items: [
      {
        product: PRODUCTS[1], // Pur Charme 25cm (2 stères - 148€ TTC)
        quantity: 2
      }
    ],
    subtotalHT: 269.09,
    tva10Amount: 26.91,
    tva20Amount: 0.00,
    totalHT: 269.09,
    shippingFeeTTC: 0.00,
    totalTTC: 296.00,
    deliveryMethod: DELIVERY_OPTIONS[0],
    deliverySlot: {
      date: '2026-09-30',
      timeWindow: '14h00 - 16h00'
    },
    paymentMethod: 'card',
    paymentStatus: 'paye'
  }
];

export const UPCOMING_DELIVERY_DATES = [
  { date: 'Demain (14 Octobre)', fullDate: '2026-10-14', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] },
  { date: 'Jeudi 15 Octobre', fullDate: '2026-10-15', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] },
  { date: 'Vendredi 16 Octobre', fullDate: '2026-10-16', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] },
  { date: 'Samedi 17 Octobre (Matin)', fullDate: '2026-10-17', slots: ['08h00 - 10h00', '10h00 - 12h00'] },
  { date: 'Lundi 19 Octobre', fullDate: '2026-10-19', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] }
];
