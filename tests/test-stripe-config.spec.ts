import { test, expect } from '@playwright/test';

test('Test Stripe Configuration', async ({ page }) => {
  console.log('🔍 Testing Stripe configuration...');
  
  // Test the health endpoint
  const healthResponse = await page.request.get('https://sunspire-web-app.vercel.app/api/health');
  const healthData = await healthResponse.json();
  console.log('📊 Health check response:', healthData);
  
  // Test the Stripe checkout endpoint directly
  const stripeResponse = await page.request.post('https://sunspire-web-app.vercel.app/api/stripe/create-checkout-session', {
    data: {
      plan: 'starter',
      company: 'Netflix',
      email: 'test@example.com'
    }
  });
  
  const stripeData = await stripeResponse.json();
  console.log('📊 Stripe response status:', stripeResponse.status());
  console.log('📊 Stripe response data:', stripeData);
  
  if (stripeResponse.status() === 200) {
    console.log('✅ Stripe checkout is working!');
    expect(stripeData.url).toContain('checkout.stripe.com');
  } else {
    console.log('❌ Stripe checkout failed:', stripeData.error);
    
    // Check if it's an API key issue
    if (stripeData.error && stripeData.error.includes('Invalid API Key')) {
      console.log('🔑 API Key issue detected');
      console.log('📊 Error details:', stripeData.error);
    }
  }
});
