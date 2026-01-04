"use client";

import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const button = cva(
  "font-bold py-2.5 px-6 transition-all flex items-center gap-2 text-sm w-fit",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white hover:bg-gray-900 shadow-sharp-gray hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(200,200,200,1)] active:shadow-none",
        secondary:
          "bg-white border-2 border-black text-black hover:bg-gray-50 shadow-sharp hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-sharp-sm active:shadow-none",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  children: ReactNode;
  icon?: string;
}

export default function Button({
  children,
  variant,
  icon,
  onClick,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(button({ variant }), className)}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

