
import React from 'react';
import { features } from '../constants';

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#243949] to-[#517fa4] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Track your run</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-light">
            Launch the app and start moving. After a minute or so, your cadence will be displayed. This is usually a good initial setting for your tempo, which you can adjust at any time. Save your favorite presets for jogging, walking, running, whatever.
          </p>
        </div>
        <div className="flex flex-wrap -mx-4">
          {features.map((feature, index) => (
            <div key={index} className="w-full md:w-1/3 px-4 mb-8">
              <div className="text-center">
                <div className="mb-4 inline-block">
                    <img src={feature.iconUrl} alt={feature.title} className="h-24 w-24 rounded-full" />
                </div>
                <h5 className="text-xl font-semibold mb-2 text-white">{feature.title}</h5>
                <p className="font-light leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
