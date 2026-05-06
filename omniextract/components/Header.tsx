
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-teal-300 text-transparent bg-clip-text">
                    OmniExtract
                </span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                Unlock data from your PDFs. Extract emails & invoice details with AI precision.
            </p>
        </header>
    );
};

export default Header;
