import { getRequestContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  try {
    const { env } = getRequestContext();
    const object = await env.DISCOUNT_QR_CODES.get(key);

    if (!object) {
      return new NextResponse("QR code not found", { status: 404 });
    }

    const buffer = await object.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/bmp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching R2 object:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
