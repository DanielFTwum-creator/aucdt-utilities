import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                GIF Animator AI
            </h1>
            <p className="text-gray-400 mt-2">Bring your ideas to life! Describe a scene and get a custom animated GIF.</p>
        </header>
    );
};

export default Header;

