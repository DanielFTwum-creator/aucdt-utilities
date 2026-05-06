import React from 'react';

const WhatToExpect: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 bg-aucdt-secondary rounded-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 bg-aucdt-secondary rounded-full opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <div className="w-full h-96 rounded-lg overflow-hidden shadow-2xl order-last lg:order-first">
                    <img 
                        src="https://storage.googleapis.com/aistudio-hosting/aucdt-assets/what-to-expect-product.png"
                        alt="Hands-on design work with wooden pieces"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="order-first lg:order-last">
                    <h2 className="text-4xl font-extrabold text-aucdt-primary mb-6">What to Expect</h2>
                    <div className="space-y-4 text-aucdt-dark-text text-lg">
                        <p>
                            Your studies will combine theory and practice, exploring cultural, historical, technical, and ecological issues related to your field of design. This knowledge, combined with your hands-on studio courses, will equip you to develop stunning, creative, and engaging design pieces and practices.
                        </p>
                        <p>
                            You'll have the opportunity to enhance your studies by undertaking student internships. Upon graduation, you'll have a strong body of original work and the skills you need to launch your design career.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default WhatToExpect;
