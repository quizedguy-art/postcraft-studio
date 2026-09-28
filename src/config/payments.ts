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
  provider: 'stripe', 
  currency: '$',
  
  monthlyPro: {
    price: 9,
    priceLabel: '$9/month',
    checkoutUrl: 'https://buy.stripe.com/test_dRm3cx9wk8o15G23N8aBk00',
  },

  lifetimeFounder: {
    price: 29,
    priceLabel: '$29 one-time',
    checkoutUrl: 'https://buy.stripe.com/test_fZu0wR5g4eMG1TQ6ZkabK01',
  },
};
