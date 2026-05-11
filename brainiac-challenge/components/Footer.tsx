import React from 'react';
import { BRAND_COLORS } from '../constants.ts';

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#B8860B] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#B8860B] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 11.884l7.997-6M2 18h16a2 2 0 002-2V8l-8 5-8-5v8a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#B8860B] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);


export const Footer = () => {
    return (
        <footer style={{ backgroundColor: BRAND_COLORS.brown }} className="text-white py-8 px-4 mt-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                
                {/* Location */}
                <div className="flex items-start gap-4">
                    <LocationIcon />
                    <div>
                        <p><span className="font-bold" style={{ color: BRAND_COLORS.gold }}>Location:</span> Oyibi</p>
                        <p>(off the Adenta – Dodowa Road)</p>
                        <p className="mt-2">GM-274-6332</p>
                    </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-4">
                    <EmailIcon />
                    <div>
                        <p><span className="font-bold" style={{ color: BRAND_COLORS.gold }}>Email:</span> info@aucdt.edu.gh</p>
                        <p className="mt-2"><span className="font-bold" style={{ color: BRAND_COLORS.gold }}>Postal Address:</span> P. O. Box VV 179, Oyibi – Accra.</p>
                    </div>
                </div>

                {/* Mobile */}
                <div className="flex items-start gap-4">
                    <PhoneIcon />
                    <div>
                        <p><span className="font-bold" style={{ color: BRAND_COLORS.gold }}>Mobile 1:</span> +233 (0) 54 012 4400</p>
                        <p className="mt-2"><span className="font-bold" style={{ color: BRAND_COLORS.gold }}>Mobile 2:</span> +233 (0) 54 012 4488</p>
                    </div>
                </div>
            </div>
             <div className="text-center mt-8 pt-4 border-t border-gray-600/50 text-xs text-gray-400">
                <p>Brainiac Challenge | Powered by Google Gemini</p>
            </div>
        </footer>
    )
}