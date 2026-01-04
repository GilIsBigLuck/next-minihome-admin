"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const sidebar = cva(
  "w-64 bg-white border-r border-black flex flex-col justify-between h-full flex-shrink-0 z-20"
);

const sidebarHeader = cva(
  "h-20 flex items-center px-6 border-b border-gray-100"
);

const logoContainer = cva(
  "flex items-center gap-3"
);

const logoIcon = cva(
  "w-8 h-8 bg-black rounded-none flex items-center justify-center text-white font-bold text-lg"
);

const logoText = cva(
  "text-lg font-bold tracking-tight"
);

const userSection = cva(
  "px-6 py-6 pb-2"
);

const userInfo = cva(
  "flex items-center gap-3 mb-6"
);

const userAvatar = cva(
  "bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 grayscale bg-gray-200"
);

const userName = cva("text-sm font-bold");

const userEmail = cva("text-xs text-gray-500");

const nav = cva("flex flex-col px-4 gap-1");

const navLink = cva(
  "flex items-center gap-3 px-3 py-2.5 rounded transition-colors group",
  {
    variants: {
      active: {
        true: "bg-black text-white shadow-sharp transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        false: "hover:bg-gray-100 text-gray-600",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const navIcon = cva("material-symbols-outlined", {
  variants: {
    active: {
      true: "text-white",
      false: "text-gray-400 group-hover:text-black",
    },
  },
  defaultVariants: {
    active: false,
  },
});

const navLabel = cva("text-sm font-medium");

const sidebarFooter = cva("p-4 border-t border-gray-100");

const logoutButton = cva(
  "flex w-full items-center gap-3 px-3 py-2 rounded text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
);

interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/" },
  { icon: "article", label: "Content", href: "#" },
  { icon: "group", label: "Users", href: "/users" },
  { icon: "bar_chart", label: "Analytics", href: "#" },
  { icon: "design_services", label: "Design System", href: "#" },
];

export interface SidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sidebar> {}

export default function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={clsx(sidebar(), className)} {...props}>
      <div className="flex flex-col">
        <div className={sidebarHeader()}>
          <Link href="/" className={logoContainer()}>
            <div className={logoIcon()}>A</div>
            <span className={logoText()}>
              Admin<span className="font-normal">Panel</span>
            </span>
          </Link>
        </div>
        <div className={userSection()}>
          <div className={userInfo()}>
            <div className={userAvatar()}></div>
            <div className="flex flex-col">
              <p className={userName()}>Super Admin</p>
              <p className={userEmail()}>workspace@admin.com</p>
            </div>
          </div>
        </div>
        <nav className={nav()}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={navLink({ active: isActive })}
              >
                <span
                  className={navIcon({ active: isActive })}
                  style={{
                    fontSize: "20px",
                    fontVariationSettings: isActive ? "'FILL' 1" : undefined,
                  }}
                >
                  {item.icon}
                </span>
                <span className={navLabel()}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={sidebarFooter()}>
        <button className={logoutButton()}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            logout
          </span>
          <span className={navLabel()}>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

