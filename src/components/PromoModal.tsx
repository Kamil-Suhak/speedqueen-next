'use client';

import AutoOpenModal from '@/components/AutoOpenModal';
import DiscountClaim from '@/components/DiscountClaim';

interface PromoModalProps {
  content: {
    discount: any; // discountPl or discountEn
    common: any;   // commonPl or commonEn
  };
}

export default function PromoModal({ content }: PromoModalProps) {
  return (
    <AutoOpenModal 
      uniqueId="discount-promo-march-2026" 
      delayMs={1500} 
      closeLabel={content.common.modal.close}
    >
      <DiscountClaim content={content.discount} />
    </AutoOpenModal>
  );
}
