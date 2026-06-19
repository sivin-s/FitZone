import { useState } from "react";
import type { LucideIcon } from "lucide-react";

const THEMES = {
  neutral: {
    bg: "bg-neutral-950",
    border: "border-neutral-800",
    text: "text-neutral-400",
    hover: "hover:text-neutral-200 hover:bg-neutral-900",
    label: "text-neutral-500",
    active: "text-white font-semibold",
    activeIcon: "text-white",
    inactiveIcon: "text-neutral-500",
  },
  slate: {
    bg: "bg-slate-950",
    border: "border-slate-800",
    text: "text-slate-400",
    hover: "hover:text-slate-200 hover:bg-slate-900",
    label: "text-slate-500",
    active: "bg-slate-800 text-white font-medium",
    activeIcon: "text-white",
    inactiveIcon: "text-slate-500",
  },
} as const;

type SidebarTheme = keyof typeof THEMES;

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarSection {
  items: SidebarItem[];
  label?: string;
  pinBottom?: boolean;
  divider?: boolean;
}

interface SidebarProps {
  brand: string;
  subtitle?: string;
  sections: SidebarSection[];
  activeId?: string;
  defaultActiveId?: string;
  onNavigate?: (id: string) => void;
  theme?: SidebarTheme;
}

export default function Sidebar({
  brand,
  subtitle,
  sections,
  activeId,
  defaultActiveId,
  onNavigate,
  theme = "neutral",
}: SidebarProps) {
  const [internalActive, setInternalActive] = useState(defaultActiveId);
  const isControlled = activeId !== undefined;
  const current = isControlled ? activeId : internalActive;
  const colors = THEMES[theme] ?? THEMES.neutral;

  const handleClick = (id: string) => {
    if (!isControlled) setInternalActive(id);
    onNavigate?.(id);
  };

  return (
    <aside className={`flex h-screen w-64 flex-col ${colors.bg} border-r ${colors.border} py-5`}>
      <div className="px-5 mb-6">
        <h1 className="text-lg font-bold text-white leading-tight">{brand}</h1>
        {subtitle && (
          <p className={`text-[10px] font-semibold tracking-widest ${colors.label}`}>
            {subtitle}
          </p>
        )}
      </div>

      {sections.map((section, i) => (
        <div key={i} className={section.pinBottom ? "mt-auto px-3" : "px-3"}>
          {section.divider && <div className={`my-3 border-t ${colors.border}`} />}

          {section.label && (
            <div className={`mb-2 px-2 text-[10px] font-semibold tracking-widest ${colors.label}`}>
              {section.label}
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {section.items.map(({ id, label, icon: Icon }) => {
              const isActive = current === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleClick(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    isActive ? colors.active : `${colors.text} ${colors.hover}`
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? colors.activeIcon : colors.inactiveIcon}
                  />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      ))}
    </aside>
  );
}
