'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, StarIcon } from '@heroicons/react/24/solid';
import { SimpleCheckoutButton } from '@/components/StripeCheckoutButton';

const plans = [
  {
    name: 'Starter',
    price: '$99',
    description: 'Perfect for small solar companies getting started',
    features: [
      'Up to 100 leads per month',
      'Basic solar calculations',
      'Email support',
      'Custom branding',
      'API access',
      'Lead export to CSV'
    ],
    popular: false
  },
  {
    name: 'Growth',
    price: '$199',
    description: 'Ideal for growing solar businesses',
    features: [
      'Up to 500 leads per month',
      'Advanced solar analytics',
      'Priority support',
      'Custom branding',
      'API access',
      'CRM integrations',
      'Campaign tracking',
      'Performance analytics'
    ],
    popular: true
  },
  {
    name: 'Scale',
    price: '$499',
    description: 'For established solar companies',
    features: [
      'Unlimited leads',
      'Enterprise solar analytics',
      'Dedicated support',
      'Custom branding',
      'Full API access',
      'Advanced CRM integrations',
      'Multi-campaign tracking',
      'ROI analytics',
      'White-label options',
      'Custom integrations'
    ],
    popular: false
  }
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('Growth');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your solar business. All plans include our core 
            lead generation platform with no hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                plan.popular ? 'ring-2 ring-orange-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <SimpleCheckoutButton
                  plan={plan.name}
                  className="w-full"
                >
                  Get Started with {plan.name}
                </SimpleCheckoutButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600">
                No setup fees! You only pay the monthly subscription price. Get started immediately.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards through Stripe. Secure, encrypted payments.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely! Cancel your subscription anytime with no penalties or hidden fees.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Generate More Solar Leads?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of solar companies already using Sunspire to grow their business.
          </p>
          <SimpleCheckoutButton
            plan="Starter"
            className="px-8 py-4 text-lg"
          >
            Start Your Free Trial
          </SimpleCheckoutButton>
        </motion.div>
      </div>
    </div>
  );
}
