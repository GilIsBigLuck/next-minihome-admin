import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const badge = cva(
  "text-[10px] font-bold px-2 py-1 uppercase tracking-wider",
  {
    variants: {
      variant: {
        published: "bg-black text-white",
        draft: "bg-white border border-black text-black",
        scheduled: "bg-gray-200 text-black",
      },
    },
    defaultVariants: {
      variant: "published",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {
  children: React.ReactNode;
}

export default function Badge({
  children,
  variant,
  className,
  ...props
}: BadgeProps) {
  return (
    <span className={clsx(badge({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

