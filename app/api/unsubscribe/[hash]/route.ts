import { NextResponse } from "next/server";
import { suppressByHash } from "@/src/lib/airtable";

export async function GET(_: Request, { params }: { params: { hash: string } }) {
  try {
    await suppressByHash(params.hash);
  } catch (e) {
    // swallow errors for UX; still show confirmation page
    console.error(e);
  }
  const html = `
    <!doctype html><html><body style="font-family: system-ui; padding: 24px;">
      <h1>You're unsubscribed</h1>
      <p>We've recorded your request. You won't receive further emails from us.</p>
    </body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html" } });
}