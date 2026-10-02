/**
 * PAYMENT & MONETIZATION CONFIGURATION
 */

export interface PaymentConfig {
  provider: 'gumroad' | 'lemonsqueezy' | 'stripe' | 'demo';
  currency: string;
  monthlyPro: {
    price: number;
    priceLabel: string;
    checkoutUrl: string;
  };
  lifetimeFounder: {
    price: number;
    priceLabel: string;
    checkoutUrl: string;
    permalink: string;
  };
}

export const PAYMENT_CONFIG: PaymentConfig = {
  provider: 'gumroad', 
  currency: '$',
  
  monthlyPro: {
    price: 4.99,
    priceLabel: '$4.99/month (₹399)',
    checkoutUrl: 'https://quizzical16.gumroad.com/l/slideforge-monthly?wanted=true',
  },

  lifetimeFounder: {
    price: 29,
    priceLabel: '$29 one-time (Lifetime)',
    checkoutUrl: 'https://quizzical16.gumroad.com/l/slideforge-pro?wanted=true',
    permalink: 'slideforge-pro',
  },
};
