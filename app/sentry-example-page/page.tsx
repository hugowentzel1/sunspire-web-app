"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  const triggerClientError = () => {
    const isProd = process.env.NODE_ENV === "production";
    const isEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLE === "1";
    
    if (isProd && !isEnabled) {
      alert("Sentry test is disabled in production. Set NEXT_PUBLIC_SENTRY_ENABLE=1 to enable.");
      return;
    }
    
    console.log("[Sentry Test] Triggering client error...", {
      isProd,
      isEnabled,
      hasSentry: typeof Sentry !== "undefined",
    });
    
    // Intentionally throw to verify Sentry wiring (client-side)
    const error = new Error("Sentry test error (intentional - client-side)");
    console.error("[Sentry Test] Throwing error:", error);
    throw error;
  };

  const triggerServerError = async () => {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_ENABLE !== "1") {
      alert("Sentry test is disabled in production. Set NEXT_PUBLIC_SENTRY_ENABLE=1 to enable.");
      return;
    }
    try {
      const res = await fetch("/api/sentry-test");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Sentry Verification</h1>
      <p className="mt-2 text-slate-600">
        Click a button below to trigger an intentional error (dev-only is recommended).
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={triggerClientError}
          className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Trigger client error
        </button>
        <button
          onClick={triggerServerError}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Trigger server error
        </button>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        If Sentry is configured, you should see an event in your Sentry project.
      </p>
    </main>
  );
}

