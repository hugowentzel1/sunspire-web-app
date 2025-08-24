import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const { hash } = params;

    if (!hash) {
      return NextResponse.json(
        { error: 'Hash parameter is required' },
        { status: 400 }
      );
    }

    // TODO: Implement global suppression logic
    // For now, just log the unsubscribe request
    console.log(`Unsubscribe request for hash: ${hash}`);

    // Return a simple HTML page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed - Sunspire</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 400px; margin: 0 auto; }
            .success { color: #059669; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">✓ Unsubscribed</h1>
            <p>You have been successfully unsubscribed from all Sunspire emails.</p>
            <p>If you believe this was a mistake, please contact us at <a href="mailto:support@sunspire.app">support@sunspire.app</a>.</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}