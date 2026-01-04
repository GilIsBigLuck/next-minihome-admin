import { InputHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const checkbox = cva(
  "h-5 w-5 text-black border-2 border-black rounded-none focus:ring-0 cursor-pointer"
);

export interface CheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Checkbox({
  label,
  className,
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        className={clsx(checkbox(), className)}
        {...props}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}

