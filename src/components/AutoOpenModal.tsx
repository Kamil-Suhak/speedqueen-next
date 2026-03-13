'use client';

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';

interface AutoOpenModalProps {
  children: React.ReactNode;
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
    // Check if the user has already seen THIS specific version of the modal
    // const hasSeenModal = localStorage.getItem(`modal_seen_${uniqueId}`);

    // if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delayMs);

      return () => clearTimeout(timer);
    // }
  }, [uniqueId, delayMs]);

  const handleClose = () => {
    setIsOpen(false);
    // Persist that the user saw it
    // localStorage.setItem(`modal_seen_${uniqueId}`, 'true');
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} closeLabel={closeLabel}>
      {children}
    </BaseModal>
  );
}
