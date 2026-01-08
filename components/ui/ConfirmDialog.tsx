"use client";

import Modal from "./Modal";
import Button from "./Button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const iconMap = {
    danger: "warning",
    warning: "error",
    info: "info",
  };

  const iconColorMap = {
    danger: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="material-symbols-outlined animate-spin"
                  style={{ fontSize: "20px" }}
                >
                  refresh
                </span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        <div
          className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 ${iconColorMap[variant]}`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "32px" }}
          >
            {iconMap[variant]}
          </span>
        </div>
        <h3 className="text-xl font-black text-black mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </Modal>
  );
}
