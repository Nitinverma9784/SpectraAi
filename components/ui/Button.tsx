import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "icon";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(124,108,242,0.35)]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          // Sizes
          size === "sm" && "h-8 px-3 text-xs rounded-full",
          size === "md" && "h-9 px-4 text-sm rounded-full",
          size === "lg" && "h-11 px-6 text-base rounded-full",
          size === "icon" && "h-8 w-8 rounded-[var(--radius-sm)] p-0",
          // Variants
          variant === "primary" && [
            "bg-gradient-to-r from-[#7C6CF2] to-[#818CF8] text-white font-semibold",
            "shadow-[0_4px_16px_rgba(124,108,242,0.35)]",
            "hover:shadow-[0_6px_24px_rgba(124,108,242,0.45)] hover:-translate-y-0.5",
          ],
          (variant === "secondary" || variant === "outline") && [
            "border border-[rgba(124,108,242,0.20)] text-[var(--text-secondary)] bg-white/70 backdrop-blur-sm",
            "hover:border-[rgba(124,108,242,0.35)] hover:text-[var(--accent)] hover:bg-white/90",
          ],
          variant === "ghost" && [
            "text-[var(--text-muted)] bg-transparent border-0",
            "hover:text-[var(--text-secondary)] hover:bg-[rgba(124,108,242,0.06)]",
          ],
          variant === "danger" && [
            "bg-[var(--danger-muted)] text-[var(--danger)] border border-[var(--danger-border)]",
            "hover:bg-[var(--danger)]/15",
          ],
          variant === "icon" && [
            "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(124,108,242,0.08)]",
          ],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            {children}
          </>
        ) : children}
      </button>
    );
  }
);
Button.displayName = "Button";
