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
    price: 9,
    priceLabel: '$9/month',
    checkoutUrl: 'https://postcraftstudioapp.lemonsqueezy.com/checkout/buy/3f9e9567-7d66-47bb-9d17-35fe5f23b10f',
  },

  lifetimeFounder: {
    price: 29,
    priceLabel: '$29 one-time',
    checkoutUrl: 'https://postcraftstudioapp.lemonsqueezy.com/checkout/buy/3f9e9567-7d66-47bb-9d17-35fe5f23b10f', // Update once second link is created
  },
};
