export const dynamic = "force-dynamic";

export default function SentryExamplePage() {
  const trigger = async () => {
    "use server";
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SENTRY_ENABLE !== "1") {
      return;
    }
    // Intentionally throw to verify Sentry wiring. This should be removed/locked down later.
    throw new Error("Sentry test error (intentional)");
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Sentry Verification</h1>
      <p className="mt-2 text-slate-600">
        Click the button below to trigger an intentional error (dev-only is recommended).
      </p>
      <form action={trigger} className="mt-6">
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Trigger test error
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        If Sentry is configured, you should see an event in your Sentry project.
      </p>
    </main>
  );
}

