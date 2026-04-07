import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helper, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border bg-white/60 backdrop-blur-sm px-3 py-2.5",
            "text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            "outline-none transition-all duration-200",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            !error && "border-[rgba(124,108,242,0.18)] focus:border-[rgba(124,108,242,0.40)] focus:ring-2 focus:ring-[rgba(124,108,242,0.15)]",
            error && "border-[var(--danger-border)] focus:ring-2 focus:ring-[var(--danger)]/15",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          {...props}
        />
        {helper && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{helper}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
