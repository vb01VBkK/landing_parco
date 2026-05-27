/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InquiryForm {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  message: string;
  bookVisit: boolean;
  requestBrochure: boolean;
  privacyAccepted: boolean;
}

export interface FeatureHeader {
  iconName: string;
  label: string;
  highlight?: boolean;
}

export interface BenefitItem {
  iconName: string;
  title: string;
  description: string;
}

export interface PositionFeature {
  iconName: string;
  title: string;
  subtitle: string;
}

export interface PropertyUnit {
  id: string;
  name: string;
  size: string;
  rooms: number;
  bathrooms: number;
  balconySize: string;
  description: string;
  features: string[];
  energyClass: string;
}
