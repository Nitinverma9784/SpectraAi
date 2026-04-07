import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, active, clickable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border p-5 text-[var(--text-primary)]",
        "backdrop-blur-md transition-all duration-300",
        "shadow-[0_4px_20px_rgba(124,108,242,0.07)]",
        !active && [
          "bg-white/70 border-white/50",
          "hover:bg-white/85 hover:shadow-[0_8px_30px_rgba(124,108,242,0.13)]",
          "hover:-translate-y-0.5",
        ],
        active && "border-[var(--accent-border)] bg-[var(--accent-muted)]/40",
        clickable && "cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";
