import React from 'react';

interface Tier {
  name: string;
  price: string;
  priceDetails: string;
  targetUser: string;
  features: string[];
  isFeatured?: boolean;
}

const CheckIcon = () => (
    <svg className="h-6 w-6 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const pricingTiers: Tier[] = [
  {
    name: 'FREE / Starter',
    price: '$0',
    priceDetails: 'Annually',
    targetUser: 'Individual just getting started.',
    features: [
      '1 Connected Social Channel',
      '1 Email Connection',
      '15 AI Content Generations/Month',
      'Basic Scheduling',
      'Simplified Dashboard',
    ],
  },
  {
    name: 'Solo-Preneur',
    price: '$29',
    priceDetails: '/month (Billed Annually)',
    targetUser: 'Small Business Owner, Freelancer.',
    features: [
      '1 User Seat, 5 Connected Channels',
      '100 AI Content Generations/Month',
      'Full Brand Voice AI Setup (FR-102)',
      'Optimal Scheduling (FR-302)',
      'Simplified Reporting (FR-403)',
    ],
    isFeatured: true,
  },
  {
    name: 'Small Team',
    price: '$79',
    priceDetails: '/month (Billed Annually)',
    targetUser: 'Small business with 2-5 employees.',
    features: [
      '3 User Seats, 10 Connected Channels',
      'Unlimited AI Content Generations',
      'A/B Test Variant Generation (FR-204)',
      'Full Access to Actionable Insights (FR-402)',
      'Basic E-commerce Link (FR-503)',
    ],
  },
  {
    name: 'Growth Pro',
    price: '$199',
    priceDetails: '/month (Billed Annually)',
    targetUser: 'High-growth SMBs, Agency Lite.',
    features: [
      'Unlimited User Seats, 20 Connected Channels',
      'Unlimited AI Content Generations',
      'Priority Support',
      'Automated Campaign Creation',
      'Dedicated Account Manager',
    ],
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-xl text-secondary">
          Choose the plan that's right for your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-2xl p-8 shadow-lg transition-transform transform hover:-translate-y-2 border ${
              tier.isFeatured ? 'bg-secondary text-white ring-4 ring-accent-primary border-accent-primary' : 'bg-secondary border-default'
            }`}
          >
            <h3 className={`text-lg font-semibold ${tier.isFeatured ? 'text-white' : 'text-primary'}`}>{tier.name}</h3>
            <p className={`mt-1 text-sm ${tier.isFeatured ? 'text-gray-300' : 'text-secondary'}`}>{tier.targetUser}</p>
            <div className="mt-6">
              <span className={`text-4xl font-extrabold ${tier.isFeatured ? 'text-white' : 'text-primary'}`}>{tier.price}</span>
              <span className={`text-base font-medium ${tier.isFeatured ? 'text-gray-400' : 'text-secondary'}`}>{tier.priceDetails}</span>
            </div>
            
            <button
              type="button"
              aria-label={`Choose ${tier.name} plan`}
              className={`mt-8 block w-full text-center rounded-lg px-6 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-accent-primary transition ${tier.isFeatured ? 'bg-accent-primary text-white hover:bg-accent-primary/90' : 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'}`}
            >
              Choose {tier.name}
            </button>

            <ul className="mt-8 space-y-4 text-sm flex-grow">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckIcon />
                  <span className={`ml-3 ${tier.isFeatured ? 'text-gray-300' : 'text-secondary'}`}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;