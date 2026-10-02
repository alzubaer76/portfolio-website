import {
  BarChart3,
  Camera,
  ClipboardList,
  LayoutTemplate,
  Megaphone,
  Music2,
  Phone,
  Rocket,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Palette,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/content/site";

const ICONS: Record<IconName, LucideIcon> = {
  megaphone: Megaphone,
  music: Music2,
  search: Search,
  "trending-up": TrendingUp,
  camera: Camera,
  palette: Palette,
  layout: LayoutTemplate,
  target: Target,
  phone: Phone,
  clipboard: ClipboardList,
  rocket: Rocket,
  chart: BarChart3,
  sparkles: Sparkles,
  settings: Settings,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = ICONS[name];
  return <Cmp aria-hidden="true" {...props} />;
}
