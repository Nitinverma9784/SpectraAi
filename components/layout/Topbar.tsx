"use client";

import { Bell, Search } from "lucide-react";
import { useAIPanelStore } from "@/stores/aiPanelStore";
import { usePathname } from "next/navigation";

function Breadcrumb() {
  const pathname = usePathname();
  // Build simple breadcrumb from path segments
  const segments = pathname.split("/").filter(Boolean);
  return (
    <nav className="hidden md:flex items-center gap-1.5 text-sm min-w-0">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const label = seg.replace(/-/g, " ").replace(/[a-z0-9]/g, (c, j) => j === 0 ? c.toUpperCase() : c);
        return (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <span style={{ color: "var(--text-muted)" }}>/</span>}
            <span
              className="truncate"
              style={{
                color: isLast ? "var(--text-primary)" : "var(--text-muted)",
                maxWidth: isLast ? "200px" : "120px",
              }}
            >
              {label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}

export function Topbar() {
  const { setOpen, isOpen } = useAIPanelStore();

  return (
    <header
      style={{
        height: 56,
        borderBottom: "1px solid rgba(124, 108, 242, 0.10)",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 1px 0 rgba(124, 108, 242, 0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      <Breadcrumb />

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block">
        <Search
          size={14}
          style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
        />
        <input
          type="search"
          placeholder="Search..."
          style={{
            height: 32,
            width: 200,
            background: "rgba(255,255,255,0.70)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(124,108,242,0.15)",
            borderRadius: 999,
            paddingLeft: 32,
            paddingRight: 12,
            fontSize: 13,
            color: "var(--text-primary)",
            outline: "none",
          }}
          onFocus={e => {
            e.target.style.borderColor = "rgba(124,108,242,0.40)";
            e.target.style.boxShadow = "0 0 0 3px rgba(124,108,242,0.12)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(124,108,242,0.15)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Notification bell */}
      <button
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-sm)",
          color: "var(--text-muted)",
          transition: "color var(--transition-fast), background var(--transition-fast)",
        }}
        className="hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
      >
        <Bell size={16} strokeWidth={1.5} />
      </button>

      {/* AI Panel toggle */}
      <button
        onClick={() => setOpen(!isOpen)}
        style={{
          height: 32,
          padding: "0 14px",
          borderRadius: 999,
          background: isOpen
            ? "linear-gradient(135deg, #7C6CF2, #818CF8)"
            : "rgba(124,108,242,0.08)",
          border: `1px solid ${isOpen ? "transparent" : "rgba(124,108,242,0.15)"}`,
          color: isOpen ? "#fff" : "var(--accent)",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "var(--font-geist)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "all 0.2s",
          whiteSpace: "nowrap",
          boxShadow: isOpen ? "0 4px 14px rgba(124,108,242,0.30)" : "none",
        }}
      >
        <span style={{ fontSize: 12 }}>✦</span>
        AI Panel
      </button>

      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C6CF2 0%, #A78BFA 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(124,108,242,0.30)",
        }}
      >
        U
      </div>
    </header>
  );
}
