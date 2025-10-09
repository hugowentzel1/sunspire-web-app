import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-lg text-gray-600 mb-4">
            This page contains our terms and conditions for using this service.
          </p>
          <p className="text-gray-600">
            Content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

