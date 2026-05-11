import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-e328d4de4bf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-6 w-fit backdrop-blur-sm">
          #1 Trusted Real Estate Agency
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-3xl">
          Find affordable, neat & <br/>
          <span className="text-emerald-400">genuine deals</span> for your home.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Welcome to Pama Realtor. We understand your needs and have worked hard to bring you the best available properties.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button className="bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30">
            Browse Properties
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3.5 rounded-lg font-semibold hover:bg-white/20 transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;