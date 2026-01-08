"use client";

import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import Badge from "./Badge";

const card = cva(
  "group relative flex flex-col bg-white border border-gray-200 transition-all duration-300 max-w-sm mx-auto w-full",
  {
    variants: {
      hoverable: {
        true: "hover:border-black hover:shadow-xl",
        false: "",
      },
    },
    defaultVariants: {
      hoverable: true,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof card> {
  children?: ReactNode;
  title?: string;
  category?: string;
  badge?: "published" | "draft" | "scheduled";
  image?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  date?: string;
  onSelect?: () => void;
  onMore?: () => void;
}

export default function Card({
  children,
  title,
  category,
  badge,
  image,
  author,
  date,
  onSelect,
  onMore,
  hoverable,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(card({ hoverable }), className)}
      {...props}
    >
      {onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            className="h-5 w-5 text-black border-2 border-black rounded-none focus:ring-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-white"
            onChange={onSelect}
          />
        </div>
      )}
      {onMore && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onMore}
            className="bg-white/90 backdrop-blur border border-gray-200 hover:bg-black hover:text-white p-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined block" style={{ fontSize: "18px" }}>
              more_horiz
            </span>
          </button>
        </div>
      )}
      {image && (
        <div className="aspect-[4/3] overflow-hidden bg-gray-100 border-b border-gray-100 relative">
          {badge && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge variant={badge}>{badge}</Badge>
            </div>
          )}
          <img
            alt={title || "Card image"}
            className="h-full w-full object-cover img-grayscale transform group-hover:scale-105 transition-transform duration-500"
            src={image}
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {title && (
          <div>
            {category && (
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {category}
                </span>
              </div>
            )}
            <h3 className="text-lg font-bold text-black leading-tight group-hover:underline decoration-2 underline-offset-4 cursor-pointer">
              {title}
            </h3>
          </div>
        )}
        {children}
        {(author || date) && (
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            {author && (
              <div className="flex items-center gap-2">
                {author.avatar && (
                  <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden grayscale">
                    <img
                      alt={author.name}
                      className="h-full w-full object-cover"
                      src={author.avatar}
                    />
                  </div>
                )}
                <span className="text-xs font-medium text-gray-600">{author.name}</span>
              </div>
            )}
            {date && <span className="text-xs text-gray-400 font-mono">{date}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

