import React from 'react';

const galleryItems = [
    { title: 'Drawing', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-drawing.png' },
    { title: 'Computer Aided Design', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-cad.png' },
    { title: 'Model Making', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-model-making.png' },
    { title: 'Fashion Photography', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-8.png' },
    { title: 'Gem Setting', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-gem-setting.png' },
    { title: 'Videography', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-videography.png' },
    { title: 'African Art & Culture', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-6.png' },
    { title: 'Workshop Practices', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-workshop.png' },
    { title: 'Entrepreneurship', image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-9.png' },
];

const GalleryItem: React.FC<{ title: string, image: string }> = ({ title, image }) => (
    <div className="relative rounded-lg overflow-hidden group shadow-lg">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">{title}</h3>
        </div>
    </div>
);

const Gallery: React.FC = () => {
    return (
        <section className="py-20 lg:py-24 bg-aucdt-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-aucdt-primary">Explore Our Creative World</h2>
                    <p className="mt-4 text-lg text-aucdt-dark-text">Experience the hands-on learning that defines AUCDT.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map(item => (
                        <GalleryItem key={item.title} title={item.title} image={item.image} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Gallery;
