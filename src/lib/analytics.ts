// Lightweight analytics utility for PostHog
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

class Analytics {
  private posthogKey: string | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || null;
    }
  }

  private async initPostHog() {
    if (this.isInitialized || !this.posthogKey || typeof window === 'undefined') {
      return;
    }

    try {
      const { PostHog } = await import('posthog-js');
      PostHog.init(this.posthogKey, {
        api_host: 'https://app.posthog.com',
        loaded: (posthog) => {
          if (posthog) {
            this.isInitialized = true;
          }
        }
      });
    } catch (error) {
      console.warn('PostHog not available:', error);
    }
  }

  async track(event: string, properties?: Record<string, any>) {
    if (!this.posthogKey) {
      // No-op if no PostHog key
      return;
    }

    await this.initPostHog();

    if (typeof window !== 'undefined' && (window as any).posthog) {
      try {
        (window as any).posthog.capture(event, properties);
      } catch (error) {
        console.warn('Failed to track event:', error);
      }
    }
  }

  // Specific tracking methods
  async trackDemoView(utmParams?: Record<string, string>) {
    await this.track('view_demo', {
      ...utmParams,
      timestamp: new Date().toISOString()
    });
  }

  async trackLeadSubmit(token?: string, tenant?: string) {
    await this.track('submit_lead', {
      token: token || null,
      tenant: tenant || null,
      timestamp: new Date().toISOString()
    });
  }

  async trackCheckoutStarted(plan: string, tenant?: string) {
    await this.track('checkout_started', {
      plan,
      tenant: tenant || null,
      timestamp: new Date().toISOString()
    });
  }

  async trackSubscriptionActive(plan: string, tenant?: string) {
    await this.track('subscription_active', {
      plan,
      tenant: tenant || null,
      timestamp: new Date().toISOString()
    });
  }

  // UTM parameter extraction
  getUTMParams(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }

    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });

    return utmParams;
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export individual tracking functions for convenience
export const trackDemoView = (utmParams?: Record<string, string>) => analytics.trackDemoView(utmParams);
export const trackLeadSubmit = (token?: string, tenant?: string) => analytics.trackLeadSubmit(token, tenant);
export const trackCheckoutStarted = (plan: string, tenant?: string) => analytics.trackCheckoutStarted(plan, tenant);
export const trackSubscriptionActive = (plan: string, tenant?: string) => analytics.trackSubscriptionActive(plan, tenant);
export const getUTMParams = () => analytics.getUTMParams();


