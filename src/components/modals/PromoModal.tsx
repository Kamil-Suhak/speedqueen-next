'use client';

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
