'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeLabel?: string;
}

export default function BaseModal({ isOpen, onClose, children, closeLabel }: BaseModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Close Button Top Right (Outside of container for desktop, inside for mobile) */}
          <button
            onClick={onClose}
            className="fixed right-6 top-6 z-[60] rounded-full p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white hidden md:block"
            aria-label={closeLabel}
          >
            <X size={32} />
          </button>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[480px] overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            {/* Mobile Close Button (Inside) */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 md:hidden"
              aria-label={closeLabel}
            >
              <X size={24} />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
