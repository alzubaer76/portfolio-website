import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type ContainerProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = "div">({ as, className, ...props }: ContainerProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return <Tag className={cn("mx-auto w-full max-w-site px-5 md:px-8", className)} {...props} />;
}
