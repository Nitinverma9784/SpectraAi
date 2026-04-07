"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  Brain,
  FileText,
  Shield,
} from "lucide-react";
import { signout } from "@/actions/auth";

export function Sidebar() {
  const pathname = usePathname();

  const projectMatch = pathname.match(/\/projects\/([^\/]+)/);
  const projectId = projectMatch ? projectMatch[1] : null;

  const navGroups = [
    {
      label: "Workspace",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/projects", label: "Projects", icon: FolderKanban },
      ],
    },
    {
      label: "AI Modules",
      items: projectId
        ? [
            { href: `/projects/${projectId}/decisions`, label: "Decision Engine", icon: Brain, badge: "Logic" },
            { href: `/projects/${projectId}/specs`, label: "Specifications", icon: FileText, badge: "Adaptive" },
            { href: `/projects/${projectId}/conflicts`, label: "Conflict Scanner", icon: Shield, badge: "Sync" },
          ]
        : [
            { href: "#", label: "Decision Engine", icon: Brain, disabled: true, badge: "Logic" },
            { href: "#", label: "Specifications", icon: FileText, disabled: true, badge: "Adaptive" },
            { href: "#", label: "Conflict Scanner", icon: Shield, disabled: true, badge: "Sync" },
          ],
    },
  ];

  return (
    <aside
      className="hidden md:flex flex-col"
      style={{
        width: 232,
        minWidth: 232,
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(124, 108, 242, 0.10)",
        boxShadow: "2px 0 20px rgba(124, 108, 242, 0.05)",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4"
        style={{
          height: 56,
          flexShrink: 0,
          borderBottom: "1px solid rgba(124, 108, 242, 0.07)",
        }}
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-[6px]"
            style={{ background: "rgba(124, 108, 242, 0.10)" }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            className="relative z-10"
          >
            <path
              d="M9 1L17 9L9 17L1 9L9 1Z"
              fill="#7C6CF2"
              opacity="0.45"
            />
            <path d="M9 4L14 9L9 14L4 9L9 4Z" fill="#7C6CF2" />
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em", color: "#1E293B" }}>
            Spectra<span style={{ color: "#7C6CF2" }}>AI</span>
          </div>
          <div style={{ fontSize: 9, color: "#94A3B8", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Product Intelligence
          </div>
        </div>
      </div>

      {/* AI Status Pill */}
      <div
        className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl flex items-center gap-2"
        style={{
          background: "rgba(124, 108, 242, 0.07)",
          border: "1px solid rgba(124, 108, 242, 0.12)",
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "#22C55E" }}
        />
        <Zap className="h-3 w-3" style={{ color: "#7C6CF2" }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: "#7C6CF2", letterSpacing: "0.04em" }}>
          AI Engine Active
        </span>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94A3B8", padding: "6px 12px 4px" }}>
              {group.label}
            </p>
            {group.items.map((item: any) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "#" && pathname.startsWith(item.href));
              const Icon = item.icon;

              if (item.disabled) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs cursor-not-allowed mb-0.5"
                    style={{ opacity: 0.35 }}
                    title="Select a project first"
                  >
                    <Icon size={14} strokeWidth={1.5} style={{ color: "#64748B" }} />
                    <span className="flex-1" style={{ color: "#64748B" }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="text-[8px] px-1 py-0.5 rounded font-mono tracking-wider"
                        style={{
                          background: "rgba(226, 232, 240, 0.6)",
                          border: "1px solid rgba(203, 213, 224, 0.8)",
                          color: "#94A3B8",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer mb-0.5 group"
                  style={{
                    background: isActive ? "rgba(124, 108, 242, 0.10)" : "transparent",
                    color: isActive ? "#7C6CF2" : "#475569",
                    borderLeft: isActive ? "2px solid rgba(124, 108, 242, 0.6)" : "2px solid transparent",
                    paddingLeft: "10px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(124, 108, 242, 0.05)";
                      e.currentTarget.style.color = "#1E293B";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  <Icon
                    size={14}
                    strokeWidth={isActive ? 2 : 1.5}
                    style={{ color: isActive ? "#7C6CF2" : "#64748B", flexShrink: 0 }}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[8px] px-1 py-0.5 rounded font-mono tracking-wider transition-all"
                      style={{
                        background: isActive ? "rgba(124, 108, 242, 0.12)" : "rgba(241, 245, 249, 0.8)",
                        border: isActive ? "1px solid rgba(124, 108, 242, 0.25)" : "1px solid rgba(203, 213, 224, 0.8)",
                        color: isActive ? "#7C6CF2" : "#94A3B8",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight size={10} style={{ marginLeft: 2, opacity: 0.5, color: "#7C6CF2" }} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Project hint */}
        {!projectId && (
          <div
            className="mx-1 mt-2 p-3 rounded-xl"
            style={{
              background: "rgba(241, 245, 249, 0.7)",
              border: "1px dashed rgba(203, 213, 224, 0.8)",
            }}
          >
            <p style={{ fontSize: 10, color: "#94A3B8", lineHeight: 1.6 }}>
              Open a project to activate Decision Engine and Spec modules.
            </p>
            <Link
              href="/projects"
              style={{ fontSize: 10, color: "#7C6CF2", marginTop: 4, display: "block" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Browse Projects →
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div
        className="p-2 space-y-0.5"
        style={{ borderTop: "1px solid rgba(124, 108, 242, 0.08)" }}
      >
        <button
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs transition-all"
          style={{ color: "#64748B", background: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(241, 245, 249, 0.8)";
            e.currentTarget.style.color = "#1E293B";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          <Settings size={13} strokeWidth={1.5} />
          Settings
        </button>
        <button
          onClick={() => signout()}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs transition-all"
          style={{ color: "#64748B", background: "transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(254, 226, 226, 0.6)";
            e.currentTarget.style.color = "#EF4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          <LogOut size={13} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
