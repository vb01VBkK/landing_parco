/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Award, 
  Sun, 
  Cpu, 
  ShieldCheck, 
  Leaf, 
  Lightbulb, 
  Home, 
  Shield, 
  MapPin, 
  Car, 
  Train, 
  Calendar,
  User,
  Phone,
  Mail,
  ChevronRight,
  MessageSquare,
  Check,
  Send,
  X,
  Sparkles,
  Building,
  ArrowRight
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = '', size = 20 }) => {
  switch (name) {
    case 'Award':
      return <Award className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Sun':
      return <Sun className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Cpu':
      return <Cpu className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Leaf':
      return <Leaf className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Lightbulb':
      return <Lightbulb className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Home':
      return <Home className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Shield':
      return <Shield className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'MapPin':
      return <MapPin className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Car':
      return <Car className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Train':
      return <Train className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Calendar':
      return <Calendar className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'User':
      return <User className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Phone':
      return <Phone className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Mail':
      return <Mail className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'ChevronRight':
      return <ChevronRight className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'MessageSquare':
      return <MessageSquare className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Check':
      return <Check className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Send':
      return <Send className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'X':
      return <X className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Sparkles':
      return <Sparkles className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'Building':
      return <Building className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    case 'ArrowRight':
      return <ArrowRight className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
    default:
      return <Building className={className} size={size} id={`icon-${name.toLowerCase()}`} />;
  }
};
