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

// Clean initial state - No preloaded user or mock orders
export const INITIAL_USER: UserProfile | null = null;
export const INITIAL_ORDERS: Order[] = [];

export const UPCOMING_DELIVERY_DATES = [
  { date: 'Demain (14 Octobre)', fullDate: '2026-10-14', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] },
  { date: 'Jeudi 15 Octobre', fullDate: '2026-10-15', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] },
  { date: 'Vendredi 16 Octobre', fullDate: '2026-10-16', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] },
  { date: 'Samedi 17 Octobre (Matin)', fullDate: '2026-10-17', slots: ['08h00 - 10h00', '10h00 - 12h00'] },
  { date: 'Lundi 19 Octobre', fullDate: '2026-10-19', slots: ['08h00 - 10h00', '10h00 - 12h00', '14h00 - 16h00', '16h00 - 18h00'] }
];
