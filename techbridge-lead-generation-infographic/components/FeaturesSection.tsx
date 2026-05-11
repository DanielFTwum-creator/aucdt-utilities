
import React from 'react';
import type { Feature } from '../types';

const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-extrabold text-red-800">{children}</span>
);

const FeatureItem: React.FC<{ feature: Feature }> = ({ feature }) => (
    <li className="flex items-center p-4 bg-gray-50/50 rounded-xl transition-all duration-300 ease-in-out hover:bg-white hover:translate-x-2 hover:shadow-md">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 text-red-800 flex items-center justify-center font-bold text-sm mr-4">
            {feature.iconText}
        </div>
        <span className="text-gray-700 text-base">{feature.text}</span>
    </li>
);

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    { iconText: '1', text: <><Highlight>Hands-On Training</Highlight> in state-of-the-art labs and studios.</> },
    { iconText: '2', text: <>Learn from <Highlight>Industry Experts</Highlight> and experienced faculty.</> },
    { iconText: '3', text: <>Strong <Highlight>Bursary & Financial</Highlight> Aid opportunities available.</> },
    { iconText: '4', text: <>Join a vibrant community focused on <Highlight>Innovation & Creativity</Highlight>.</> },
  ];

  return (
    <section>
      <h2 className="text-3xl font-bold text-red-800 mb-6 flex items-center">
        <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-400 to-orange-400 mr-4 rounded-full"></span>
        Why Choose TUC?
      </h2>
      <ul className="space-y-4">
        {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
        ))}
      </ul>
    </section>
  );
};

export default FeaturesSection;
