import { InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const input = cva(
  "block w-full pr-3 py-2.5 border-0 border-b-2 bg-transparent text-black placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm transition-colors font-medium",
  {
    variants: {
      hasIcon: {
        true: "pl-8",
        false: "pl-3",
      },
      error: {
        true: "border-red-500",
        false: "border-gray-200 focus:border-black",
      },
    },
    defaultVariants: {
      hasIcon: false,
      error: false,
    },
  }
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {
  label?: string;
  icon?: string;
  error?: string;
}

export default function Input({
  label,
  icon,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative w-full group">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <span
              className="material-symbols-outlined text-gray-400 group-focus-within:text-black transition-colors"
              style={{ fontSize: "20px" }}
            >
              {icon}
            </span>
          </div>
        )}
        <input
          className={clsx(
            input({ hasIcon: !!icon, error: !!error }),
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

