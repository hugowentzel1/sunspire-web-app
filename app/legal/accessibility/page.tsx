'use client';

import Footer from '@/components/Footer';
import PaidFooter from '@/components/PaidFooter';
import { useIsDemo } from '@/src/lib/isDemo';

export default function AccessibilityPage() {
  const isDemo = useIsDemo();
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Accessibility</h1>
          <p className="text-lg text-gray-600 mb-4">
            We are committed to ensuring our website is accessible to everyone.
          </p>
          <p className="text-gray-600">
            Content coming soon.
          </p>
        </div>
      </main>
      {isDemo ? <Footer /> : <PaidFooter />}
    </div>
  );
}

