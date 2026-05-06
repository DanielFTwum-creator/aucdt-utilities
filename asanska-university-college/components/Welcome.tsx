import React from 'react';

const Welcome: React.FC = () => {
  return (
    <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="space-y-2 mb-6">
                        <div className="bg-aucdt-secondary p-4 inline-block">
                            <h2 className="text-3xl font-bold text-aucdt-primary">WELCOME</h2>
                        </div>
                        <div className="bg-aucdt-secondary p-4 inline-block ml-4">
                            <h2 className="text-3xl font-bold text-aucdt-primary">TO OUR</h2>
                        </div>
                        <div className="bg-aucdt-secondary p-4 inline-block ml-8">
                            <h2 className="text-3xl font-bold text-aucdt-primary">DEPARTMENTS</h2>
                        </div>
                    </div>
                    <div className="space-y-4 text-aucdt-dark-text text-lg">
                        <p>
                            The Departments at AsanSka University College of Design and Technology (AUCDT) offer Degree, Diploma, and Certificate programmes which provide students access to state-of-the-art equipment, tools, studios, machinery, professional staff, internship opportunities, and entrepreneurial skills.
                        </p>
                        <p>
                            This academic year provides a platform for outstanding education in nurturing a generation of highly skilled professionals. We invite you to join us in our world-class facilities to merge art and science, creating design experiences that will produce graduates able to create their own jobs, employ other artisanal youth, and contribute directly to nation-building.
                        </p>
                    </div>
                </div>
                <div className="w-full h-80 rounded-lg overflow-hidden shadow-2xl">
                    <img 
                        src="https://storage.googleapis.com/aistudio-hosting/aucdt-assets/welcome-product-design.png"
                        alt="A student working on a product design project"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    </section>
  );
};

export default Welcome;
