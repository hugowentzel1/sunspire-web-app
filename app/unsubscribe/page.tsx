"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      handleUnsubscribe();
    } else {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Please contact support.');
    }
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from marketing communications.');
      } else {
        setStatus('error');
        setMessage('Failed to unsubscribe. Please contact support.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please contact support.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your unsubscribe request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {status === 'success' ? (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Successfully Unsubscribed</h1>
              <p className="text-xl text-gray-600 mb-8">{message}</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-green-900 mb-3">What happens next?</h2>
                <ul className="text-green-800 text-left space-y-2">
                  <li>• You'll no longer receive marketing emails</li>
                  <li>• Transactional emails (billing, support) will continue</li>
                  <li>• You can resubscribe anytime from your account settings</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">Unsubscribe Failed</h1>
              <p className="text-xl text-gray-600 mb-8">{message}</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-red-900 mb-3">Need help?</h2>
                <p className="text-red-800 mb-4">
                  If you're having trouble unsubscribing, please contact our support team.
                </p>
                <a 
                  href="mailto:support@sunspire.app?subject=Unsubscribe%20Help"
                  className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </>
          )}

          <div className="space-y-4">
            <a 
              href="/"
              className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </a>
            
            {status === 'success' && (
              <a 
                href="/preferences"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ml-4"
              >
                Manage Preferences
              </a>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
