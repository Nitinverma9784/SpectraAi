import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--bg-hover)] text-[var(--text-secondary)]",
  accent: "bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent-border)]",
  success: "bg-[var(--success-muted)] text-[var(--success)] border border-[var(--success-border)]",
  warning: "bg-[var(--warning-muted)] text-[var(--warning)] border border-[var(--warning-border)]",
  danger: "bg-[var(--danger-muted)] text-[var(--danger)] border border-[var(--danger-border)]",
  info: "bg-[var(--info-muted)] text-[var(--info)] border border-[var(--info-border)]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-full)] px-2.5 py-0.5",
        "text-[11px] font-semibold uppercase tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/* Status badge — maps decision/spec status strings to variants automatically */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    open: "warning",
    decided: "success",
    revisiting: "accent",
    closed: "default",
    draft: "default",
    review: "accent",
    approved: "success",
    outdated: "warning",
    deprecated: "danger",
    active: "success",
    archived: "default",
    completed: "info",
    critical: "danger",
    high: "warning",
    medium: "accent",
    low: "default",
    resolved: "success",
    ignored: "default",
    wont_fix: "default",
  };
  return <Badge variant={map[status] ?? "default"}>{status.replace("_", " ")}</Badge>;
}
