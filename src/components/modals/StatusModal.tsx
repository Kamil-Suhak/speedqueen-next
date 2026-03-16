"use client";

import { X, AlertCircle, CheckCircle } from "lucide-react";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error";
  closeButtonText: string;
}

export default function StatusModal({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
  closeButtonText,
}: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {type === "error" ? (
              <AlertCircle className="text-red-500" size={24} />
            ) : (
              <CheckCircle className="text-green-500" size={24} />
            )}
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-6 text-gray-600 leading-relaxed text-center">
          {message}
        </p>

        <button
          onClick={onClose}
          className={`w-full rounded-xl py-3 font-semibold text-white transition-transform active:scale-95 ${
            type === "error"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {closeButtonText}
        </button>
      </div>
    </div>
  );
}
