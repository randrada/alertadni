import {
  Landmark,
  Phone,
  Shield,
  FileText,
  Lock,
  Building2,
  Gamepad2,
  CreditCard,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  landmark: Landmark,
  phone: Phone,
  shield: Shield,
  'file-text': FileText,
  lock: Lock,
  building2: Building2,
  'gamepad-2': Gamepad2,
  'credit-card': CreditCard,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? HelpCircle;
}
