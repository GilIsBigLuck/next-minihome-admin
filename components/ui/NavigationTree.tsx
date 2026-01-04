"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";

interface NavNode {
  label: string;
  icon?: string;
  href?: string;
  children?: NavNode[];
  badge?: number;
  active?: boolean;
}

interface NavigationTreeProps {
  items: NavNode[];
}

function NavItem({ item, level = 0 }: { item: NavNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(item.active || false);
  const hasChildren = item.children && item.children.length > 0;

  const baseClasses = `flex items-center ${
    level === 0
      ? "justify-between w-full px-3 py-2.5 text-sm font-bold text-black bg-white border border-gray-200 shadow-sm rounded group transition-all"
      : level === 1
      ? "justify-between w-full px-3 py-2 text-sm font-bold text-black rounded hover:bg-gray-100 transition-colors group"
      : item.active
      ? "justify-between px-3 py-2 text-xs font-bold text-white bg-black rounded shadow-sharp-sm transform active:translate-y-[1px] active:shadow-none transition-all"
      : "px-3 py-2 text-xs font-medium text-gray-500 hover:text-black rounded hover:bg-gray-50 transition-colors"
  }`;

  const content = (
    <>
      <div className="flex items-center gap-3">
        {item.icon && (
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: level === 0 ? "20px" : "18px",
              fontVariationSettings: level === 0 ? "'FILL' 1" : undefined,
            }}
          >
            {item.icon}
          </span>
        )}
        <span>{item.label}</span>
      </div>
      {hasChildren && (
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      )}
      {item.badge !== undefined && (
        <span className="bg-white text-black text-[10px] px-1.5 rounded-sm">
          {item.badge}
        </span>
      )}
    </>
  );

  return (
    <div className="flex flex-col">
      {item.href ? (
        <Link href={item.href} className={baseClasses}>
          {content}
        </Link>
      ) : (
        <button onClick={() => setIsOpen(!isOpen)} className={baseClasses}>
          {content}
        </button>
      )}
      {hasChildren && isOpen && (
        <div
          className={`flex flex-col pl-3 border-l-2 border-gray-200 gap-1 ${
            level === 0 ? "mt-2 ml-3.5" : "mt-1 ml-3"
          }`}
        >
          {item.children!.map((child, index) => (
            <NavItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavigationTree({ items }: NavigationTreeProps) {
  return (
    <nav className="w-full flex flex-col gap-1">
      {items.map((item, index) => (
        <NavItem key={index} item={item} />
      ))}
    </nav>
  );
}

