import { SelectHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const select = cva(
  "appearance-none w-full bg-white border text-black py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none cursor-pointer hover:bg-gray-50",
  {
    variants: {
      error: {
        true: "border-red-500",
        false: "border-gray-200 focus:border-black",
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof select> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative max-w-xs">
        <select
          className={clsx(select({ error: !!error }), className)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            expand_more
          </span>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

