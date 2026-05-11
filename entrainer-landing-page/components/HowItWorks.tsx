
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How does enTrainer work?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            enTrainer leverages advanced motion sensors and audio processing to perfectly sync the tempo of your favorite music with your real-time running or walking cadence, creating an immersive and motivating workout experience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
