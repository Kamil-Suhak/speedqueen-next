import { getStore } from '@netlify/blobs';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  try {
    const discountStore = getStore('discount-qr-codes');
    const blob = await discountStore.get(key, { type: 'blob' });

    if (!blob) {
      return new NextResponse('QR code not found', { status: 404 });
    }

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/bmp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching blob:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
