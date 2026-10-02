import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image src={site.brand.logo} alt="" width={size} height={size} priority className="shrink-0" />
      <span className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-text">{site.brand.name}</span>
    </span>
  );
}
