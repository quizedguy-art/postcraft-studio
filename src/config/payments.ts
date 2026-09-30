/**
 * PAYMENT & MONETIZATION CONFIGURATION
 */

export interface PaymentConfig {
  provider: 'lemonsqueezy' | 'stripe' | 'demo';
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
  };
}

export const PAYMENT_CONFIG: PaymentConfig = {
  provider: 'lemonsqueezy', 
  currency: '$',
  
  monthlyPro: {
    price: 5.99,
    priceLabel: '$5.99/month (₹499)',
    checkoutUrl: 'https://postcraftstudioapp.lemonsqueezy.com/checkout/buy/3f9e9567-7d66-47bb-9d17-35fe5f23b10f',
  },

  lifetimeFounder: {
    price: 29,
    priceLabel: '$29 one-time',
    checkoutUrl: 'https://postcraftstudioapp.lemonsqueezy.com/checkout/buy/7884e779-8f58-4949-a22e-020183c33918',
  },
};
