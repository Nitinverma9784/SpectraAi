"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Target, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAIPanelStore } from "@/stores/aiPanelStore";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/decisions", label: "Decisions", icon: Target },
  { href: "/specs", label: "Specs", icon: FileText },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

export function MobileNav() {
  const pathname = usePathname();
  const { setOpen, isOpen } = useAIPanelStore();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{
        height: 56,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 16px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              minWidth: 44,
              minHeight: 44,
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              transition: "color var(--transition-fast)",
              textDecoration: "none",
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, fontFamily: "var(--font-geist)" }}>
              {tab.label}
            </span>
          </Link>
        );
      })}

      {/* AI button */}
      <button
        onClick={() => setOpen(!isOpen)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          minWidth: 44,
          minHeight: 44,
          color: isOpen ? "var(--accent)" : "var(--text-muted)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          transition: "color var(--transition-fast)",
        }}
      >
        <Sparkles size={20} strokeWidth={isOpen ? 2 : 1.5} />
        <span style={{ fontSize: 10, fontWeight: isOpen ? 600 : 400, fontFamily: "var(--font-geist)" }}>AI</span>
      </button>
    </nav>
  );
}
