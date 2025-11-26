// src/components/Toast.tsx

"use client";

import { useUIStore } from "@/store/uiStore";
import { useEffect, useState } from "react";

export default function Toast() {
  const { toast, hideToast } = useUIStore();
  const [isVisible, setIsVisible] = useState(false);

  // Efek animasi sederhana
  useEffect(() => {
    if (toast.isOpen) {
      setIsVisible(true);
    } else {
      // Tunggu animasi selesai baru sembunyikan dari DOM
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [toast.isOpen]);

  if (!isVisible && !toast.isOpen) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 transform ${
        toast.isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white font-medium ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {/* Ikon Berdasarkan Tipe */}
        {toast.type === "success" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        )}

        <span>{toast.message}</span>

        <button
          onClick={hideToast}
          className="ml-4 opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
