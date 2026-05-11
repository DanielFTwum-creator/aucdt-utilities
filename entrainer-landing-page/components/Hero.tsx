
import React from 'react';

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.339 12.015c.34-.997.433-2.02.227-3.023a.627.627 0 00-.638-.528c-1.05.15-2.062.03-3.06-.339-.99-.365-1.92-.89-2.65-1.633-.767-.78-1.33-1.745-1.63-2.834-.14-.51-.55-.85-1.07-.85-.52 0-.93.34-1.07.85-.3 1.09-.86 2.05-1.63 2.83-.73.74-1.66 1.27-2.65 1.63-.99.37-2.01.49-3.06.34a.627.627 0 00-.64.53c-.2 1.002-.11 2.025.23 3.022.68 1.99 1.99 3.52 3.69 4.46.2.1.32.33.32.56v.01c-.02.23-.16.44-.37.55-1.55.79-2.82 2.1-3.64 3.71-.17.33-.03.75.3 1.02.32.27.75.35 1.13.21 1.2-.44 2.45-.55 3.68-.31 1.21.23 2.37.8 3.32 1.61.18.15.4.24.64.24.24 0 .46-.09.64-.24.95-.81 2.1-1.38 3.32-1.61 1.23-.24 2.48-.13 3.68.31.38.14.81.06 1.13-.21.33-.27.47-.69.3-1.02-.82-1.61-2.09-2.92-3.64-3.71-.21-.11-.35-.32-.37-.55v-.01c0-.23.12-.46.32-.56 1.7-0.94 3.01-2.47 3.69-4.46zM15.41 6.64c.26-1.06.84-2.04 1.62-2.81.3-.29.74-.29.98 0 .28.28.28.71 0 .98-.6.59-1.05 1.34-1.25 2.18-.16.65-.63.92-1.12.63-.44-.26-.59-.76-.23-1z" />
    </svg>
);


const Hero: React.FC = () => {
  return (
    <section id="home" className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center" style={{ backgroundImage: "url('https://picsum.photos/seed/entrainerbg/1920/1080')" }}>
      <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-7/12 lg:w-8/12 text-white">
            <div className="py-12 md:py-24">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">Move to the beat</h1>
              <h4 className="text-xl md:text-2xl font-light mb-6">Got your run groove?</h4>
              <p className="text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
                Designed with moving in mind, <strong>enTrainer</strong> uses your iPhone’s advanced motion and audio processing to match your cadence, whatever your favorite activity. The song’s tempo, its beats per minute (BPM), matches your target cadence, your steps per minute.
              </p>
              <div className="welcome-btn">
                <a href="#top" className="inline-flex items-center bg-[#325766] text-white py-3 px-6 rounded-lg shadow-lg hover:bg-[#243f4d] transition duration-300">
                  <AppleIcon />
                  <div>
                    <span className="block text-xs">Available on the</span>
                    <span className="block text-lg font-semibold">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-5/12 lg:w-4/12 flex justify-center items-center">
            <img 
              src="https://www.entrainme.com/wp-content/uploads/2024/12/redMainScreen.png" 
              alt="enTrainer App on iPhone" 
              className="max-w-xs md:max-w-sm lg:max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
