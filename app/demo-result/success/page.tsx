"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useBrandTakeover } from "@/src/brand/useBrandTakeover";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const b = useBrandTakeover();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="text-center space-y-8"
        >
          {/* Success Icon */}
          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center"
          >
            <span className="text-4xl">✅</span>
          </motion.div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              Your branded tool is provisioning for {domain || b.domain || "your domain"}.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're setting up your white-label solar quote tool. You'll receive an email when it's ready to embed.
            </p>
          </div>

          {/* Setup Guide */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-white rounded-3xl p-8 border border-gray-200/50 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Setup Guide</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Wait for provisioning email</h3>
                  <p className="text-gray-600 text-sm">Usually takes 2-5 minutes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Copy the embed snippet</h3>
                  <p className="text-gray-600 text-sm">One line of code to add to your site</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Start collecting leads</h3>
                  <p className="text-gray-600 text-sm">Your tool will be live and converting traffic</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Embed Snippet Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gray-900 rounded-2xl p-6 text-left"
          >
            <h3 className="text-white font-semibold mb-3">Embed Snippet (will be provided in email)</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <code className="text-green-400 text-sm">
                &lt;script src="https://{b.domain || "your-domain"}.sunspire.app/embed.js"&gt;&lt;/script&gt;
              </code>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Add this to your website's &lt;head&gt; section or before the closing &lt;/body&gt; tag
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => window.open("https://docs.sunspire.app", "_blank")}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
            >
              View Setup Guide
            </button>
            <button 
              onClick={() => navigator.clipboard.writeText(`<script src="https://${b.domain || "your-domain"}.sunspire.app/embed.js"></script>`)}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Copy Embed Snippet
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
