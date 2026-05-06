import React from 'react';

const Welcome: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <div className="inline-block bg-secondary/20 text-secondary-dark px-3 py-1 rounded-full text-sm font-bold mb-4">
                Office of the Vice-Chancellor
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6 relative">
                Welcome Message
                <span className="block h-1 w-20 bg-secondary mt-2"></span>
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg font-medium text-gray-900">
                    Welcome to C. K. Tedam University of Technology and Applied Sciences (CKT-UTAS), the premier public university of the Upper East Region of Ghana established at Navrongo.
                </p>
                <p>
                    We are dedicated to the well-being and success of our students, providing them with extraordinary experiences and networks that allow them to grow and develop into responsible global citizens. Our academic programmes are designed to combine theoretical foundations with practical applications.
                </p>
                <p>
                    At CKT-UTAS, we believe in the transformative power of education and research. We invite you to join our vibrant community of scholars and change-makers.
                </p>
            </div>
            <div className="mt-8">
                <a href="#top" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded hover:bg-primary-light transition-colors shadow-md">
                    Read Full Message
                </a>
            </div>
          </div>

          {/* Image Carousel Placeholder (representing the HA Slider in HTML) */}
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
                 <img 
                    src="https://picsum.photos/800/600?random=10" 
                    alt="University Activities" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                     <span className="text-secondary font-bold mb-1">Latest Highlights</span>
                     <h3 className="text-white text-xl md:text-2xl font-bold">Enactus CKT-UTAS Secures Victory</h3>
                 </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Welcome;