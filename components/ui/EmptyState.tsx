"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const emptyState = cva(
  "group relative flex flex-col justify-center items-center bg-white border-2 border-dashed border-gray-300 hover:border-black transition-all duration-300 min-h-[120px] cursor-pointer py-8 max-w-sm mx-auto w-full"
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyState> {
  icon?: string;
  label: string;
  onClick?: () => void;
}

export default function EmptyState({
  icon = "add",
  label,
  onClick,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(emptyState(), className)}
      {...props}
    >
      <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform group-hover:border-black group-hover:bg-black group-hover:text-white">
        <span
          className="material-symbols-outlined text-gray-400 group-hover:text-white"
          style={{ fontSize: "20px" }}
        >
          {icon}
        </span>
      </div>
      <span className="text-xs font-bold text-gray-500 group-hover:text-black">
        {label}
      </span>
    </div>
  );
}

