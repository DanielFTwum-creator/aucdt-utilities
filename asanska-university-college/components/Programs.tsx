import React from 'react';

const programs = [
    { name: 'Fashion Design Technology', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/program-fashion.png' },
    { name: 'Product Design & Entrepreneurship', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/program-product.png' },
    { name: 'Digital Media & Communication Design', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/program-digital.png' },
    { name: 'Jewellery Design Technology', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/program-jewellery.png' }
];

const ProgramCard: React.FC<{ name: string, image: string }> = ({ name, image }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
        <div className="h-56 overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold text-aucdt-primary h-16">{name}</h3>
            <a href="#top" className="mt-4 inline-block font-bold text-aucdt-primary hover:text-aucdt-secondary transition-colors">
                Learn More &rarr;
            </a>
        </div>
    </div>
);


const Programs: React.FC = () => {
    return (
        <section id="programs" className="py-20 lg:py-24 bg-aucdt-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-aucdt-primary">Our Programmes</h2>
                    <p className="mt-4 text-lg text-aucdt-dark-text">Fostering creativity and building the nation through design and technology.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {programs.map(program => (
                        <ProgramCard key={program.name} name={program.name} image={program.image} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Programs;
