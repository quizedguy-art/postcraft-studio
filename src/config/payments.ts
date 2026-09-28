/**
 * PAYMENT & MONETIZATION CONFIGURATION
 * 
 * You can choose between:
 * 1. 'lemonsqueezy' - Recommended for indie creators (Handles global VAT/tax automatically)
 * 2. 'stripe' - Standard Stripe Payment Links
 * 3. 'demo' - Simulated instant checkout for local testing
 */

export interface PaymentConfig {
  provider: 'lemonsqueezy' | 'stripe' | 'demo';
  currency: string;
  monthlyPro: {
    price: number;
    priceLabel: string;
    // Replace with your actual Stripe Payment Link or Lemon Squeezy checkout URL
    checkoutUrl: string;
  };
  lifetimeFounder: {
    price: number;
    priceLabel: string;
    // Replace with your actual Stripe Payment Link or Lemon Squeezy checkout URL
    checkoutUrl: string;
  };
}

export const PAYMENT_CONFIG: PaymentConfig = {
  // Change to 'lemonsqueezy' or 'stripe' when you create your payment links!
  provider: 'demo', 
  currency: '$',
  
  monthlyPro: {
    price: 9,
    priceLabel: '$9/month',
    // Example Lemon Squeezy: 'https://yourstore.lemonsqueezy.com/buy/monthly-pro'
    // Example Stripe: 'https://buy.stripe.com/test_...'
    checkoutUrl: 'https://buy.stripe.com/test_monthly_pro',
  },

  lifetimeFounder: {
    price: 29,
    priceLabel: '$29 one-time',
    // Example Lemon Squeezy: 'https://yourstore.lemonsqueezy.com/buy/founder-pass'
    // Example Stripe: 'https://buy.stripe.com/test_...'
    checkoutUrl: 'https://buy.stripe.com/test_lifetime_founder',
  },
};
