'use client';

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

interface AutoOpenModalProps {
  children: React.ReactNode | ((closeModal: () => void) => React.ReactNode);
  uniqueId: string; // Used to track if this specific modal was shown (e.g., 'discount-v1')
  delayMs?: number; // Time to wait before opening
  closeLabel: string;
}

export default function AutoOpenModal({ 
  children, 
  uniqueId, 
  delayMs = 1500, 
  closeLabel 
}: AutoOpenModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [uniqueId, delayMs]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} closeLabel={closeLabel}>
      {typeof children === 'function' ? children(handleClose) : children}
    </BaseModal>
  );
}
