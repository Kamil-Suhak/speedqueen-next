'use client';

import { useState, useEffect } from 'react';
import AutoOpenModal from '@/components/modals/AutoOpenModal';
import DiscountClaim from '@/components/modals/DiscountClaim';

type DiscountContent = typeof import('@/config/en/discount').default;
type CommonContent = typeof import('@/config/en/common').default;

interface PromoModalProps {
  content: {
    discount: DiscountContent;
    common: CommonContent;
  };
}

export default function PromoModal({ content }: PromoModalProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // 1. First, check if promo matches the date criteria client-side
    const promoStartDate = new Date(2026, 2, 30); // Note: Month 2 is March
    const isPromoActive = new Date() >= promoStartDate;

    if (!isPromoActive) return;

    // 2. Query the counter API
    let isMounted = true;
    const checkPromo = async () => {
      try {
        const res = await fetch('/api/promo-check', { method: 'POST' });
        const data = await res.json();
        if (isMounted && data.showModal) {
          setShouldShow(true);
        }
      } catch (error) {
        // Silently fail - don't show the modal if check fails to prevent breaking UX
        console.error('Failed to check promo eligibility');
      }
    };
    
    checkPromo();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <AutoOpenModal
      uniqueId="discount-promo-march-2026"
      delayMs={1500}
      closeLabel={content.common.modal.close}
    >
      {(closeModal) => (
        <DiscountClaim content={content.discount} onSuccess={closeModal} />
      )}
    </AutoOpenModal>
  );
}
