import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-ink text-brand-cream border-t-4 border-brand-gold mt-auto animate-fade-up delay-600">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Left: Motto */}
                    <div className="flex flex-col items-center md:items-start">
                        <span className="font-playfair italic text-brand-gold text-lg md:text-xl">"Design and Build a Nation"</span>
                        <span className="font-dm-sans text-brand-gold-pale/60 text-xs uppercase tracking-widest mt-1">&copy; {currentYear} Techbridge University College</span>
                    </div>

                    {/* Right: Links & Meta */}
                    <div className="flex items-center space-x-6">
                        <a href="https://techbridge.edu.gh" className="font-bebas text-brand-gold-pale hover:text-brand-gold tracking-wider transition-colors">Main Site</a>
                        <div className="h-3 w-px bg-brand-gold/30"></div>
                        <a href="mailto:info@techbridge.edu.gh" className="font-bebas text-brand-gold-pale hover:text-brand-gold tracking-wider transition-colors">Contact</a>
                    </div>
                </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-brand-ink via-brand-gold/50 to-brand-ink mt-2"></div>
        </footer>
    );
}

export default Footer;
