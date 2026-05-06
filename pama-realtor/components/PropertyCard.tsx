import React from 'react';
import { Property, PropertyType } from '../types';
import { MapPin, Bed, Ruler, Car, ShoppingCart } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onAddToCart: (property: Property, type: 'main' | 'view') => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onAddToCart }) => {
  const isRent = property.type === PropertyType.RENT;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isRent ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
           <h3 className="text-white text-xl font-bold truncate">{property.title}</h3>
           <div className="flex items-center text-gray-200 text-sm mt-1">
             <MapPin size={14} className="mr-1" />
             {property.location}
           </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-gray-900">
            Gh₵ {property.price.toLocaleString()}
            {isRent && <span className="text-sm text-gray-500 font-normal">/mo</span>}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {property.description}
        </p>

        <div className="flex items-center gap-4 mb-6 text-gray-500 text-sm">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.areaSize && (
            <div className="flex items-center gap-1">
              <Ruler size={16} />
              <span>{property.areaSize}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onAddToCart(property, 'main')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isRent 
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            <ShoppingCart size={16} />
            {isRent ? 'Rent Now' : 'Purchase'}
          </button>
          
          <button
            onClick={() => onAddToCart(property, 'view')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Car size={16} />
            Visit (Gh₵{property.driveToViewPrice})
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;