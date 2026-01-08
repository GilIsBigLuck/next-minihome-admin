"use client";

import { ReactNode, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const overlay = cva(
  "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
);

const modal = cva(
  "bg-white border-2 border-black shadow-sharp w-full max-h-[90vh] overflow-y-auto",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const modalHeader = cva(
  "flex items-center justify-between px-6 py-4 border-b border-gray-200"
);

const modalTitle = cva("text-xl font-black tracking-tight text-black");

const modalBody = cva("px-6 py-6");

const modalFooter = cva(
  "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50"
);

const closeButton = cva(
  "p-2 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-black"
);

export interface ModalProps extends VariantProps<typeof modal> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size,
  className,
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={overlay()} onClick={onClose}>
      <div
        className={clsx(modal({ size }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={modalHeader()}>
            <h2 className={modalTitle()}>{title}</h2>
            <button className={closeButton()} onClick={onClose}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "24px" }}
              >
                close
              </span>
            </button>
          </div>
        )}
        <div className={modalBody()}>{children}</div>
        {footer && <div className={modalFooter()}>{footer}</div>}
      </div>
    </div>
  );
}
