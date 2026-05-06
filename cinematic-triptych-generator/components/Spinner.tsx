
import React from 'react';

const Spinner = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-900 bg-opacity-60">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-500 border-t-transparent"></div>
    </div>
);

export default Spinner;
