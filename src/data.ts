/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FeatureHeader, BenefitItem, PositionFeature, PropertyUnit } from './types';

export const HEADER_FEATURES: FeatureHeader[] = [
  { iconName: 'Award', label: 'Classe energetica A' },
  { iconName: 'Sun', label: 'Pannelli solari' },
  { iconName: 'Cpu', label: 'Domotica integrata' },
  { iconName: 'ShieldCheck', label: 'Sicurezza e comfort' },
  { iconName: 'Leaf', label: 'Aree verdi attrezzate' },
];

export const CORE_BENEFITS: BenefitItem[] = [
  {
    iconName: 'Leaf',
    title: 'Verde e relax',
    description: 'Aree verdi curate per il tuo benessere quotidiano',
  },
  {
    iconName: 'Lightbulb',
    title: 'Risparmio energetico',
    description: 'Tecnologie avanzate per ridurre i consumi e rispettare l\'ambiente',
  },
  {
    iconName: 'Home',
    title: 'Comfort moderno',
    description: 'Spazi funzionali e finiture di alta qualità',
  },
  {
    iconName: 'Shield',
    title: 'Sicurezza',
    description: 'Sistemi di sicurezza e videosorveglianza h24',
  },
];

export const POSITION_FEATURES: PositionFeature[] = [
  {
    iconName: 'MapPin',
    title: 'Nola (NA)',
    subtitle: 'Posizione strategica',
  },
  {
    iconName: 'Car',
    title: 'A pochi minuti da',
    subtitle: 'autostrade e servizi',
  },
  {
    iconName: 'Train',
    title: 'Vicino a scuole,',
    subtitle: 'negozi e centri sportivi',
  },
  {
    iconName: 'Calendar',
    title: 'Consegna prevista',
    subtitle: 'Dicembre 2026',
  },
];

export const PROPERTY_UNITS: PropertyUnit[] = [
  {
    id: 'bilocale',
    name: 'Bilocale Smart',
    size: '65 mq coperti',
    rooms: 2,
    bathrooms: 1,
    balconySize: '20 mq terrazzo',
    description: 'Accogliente e moderno, pensato per massimizzare la vivibilità con impianto di domotica smart integrato e grandi infissi scorrevoli.',
    features: ['Ingresso living con angolo cottura', 'Camera da letto matrimoniale', 'Bagno di design', 'Ampio balcone terrazzato'],
    energyClass: 'A4',
  },
  {
    id: 'trilocale',
    name: 'Trilocale Comfort',
    size: '95 mq coperti',
    rooms: 3,
    bathrooms: 2,
    balconySize: '35 mq terrazzo angolare',
    description: 'Perfetto equilibrio tra tecnologia e comfort abitativo. Dispone di doppia esposizione e di una splendida zona giorno living affacciata sul verde.',
    features: ['Salone openspace con cucina a vista', 'Cameretta spaziosa', 'Camera matrimoniale con cabina armadio', 'Doppi servizi finestrati'],
    energyClass: 'A4',
  },
  {
    id: 'quadrilocale',
    name: 'Quadrilocale Prestigio',
    size: '125 mq coperti',
    rooms: 4,
    bathrooms: 2,
    balconySize: '45 mq terrazzi abitabili',
    description: 'Ideato per accogliere famiglie che amano la modularità degli spazi e la totale indipendenza delle zone giorno e notte. Finiture di lusso di serie.',
    features: ['Salone doppio di rappresentanza', 'Cucina abitabile', 'Tre camere da letto', 'Doppi accessori tecnologici', 'Vano lavanderia'],
    energyClass: 'A4',
  },
  {
    id: 'attico',
    name: 'Super Attico Oleandri',
    size: '160 mq coperti',
    rooms: 5,
    bathrooms: 3,
    balconySize: '80 mq terrazzo panoramico',
    description: 'La dimora definitiva, con soffitti alti e vista mozzafiato a 360° sul territorio nolano. Dotato di ascensore privato con sbarco in casa.',
    features: ['Salone triplo panoramico', 'Suite padronale con bagno privato', 'Predisposizione idromassaggio esterna', 'Impianto fotovoltaico dedicato da 6kW'],
    energyClass: 'A4',
  },
];
