import React from 'react';

// This component is not currently used in the main UI but has been restored
// to a valid state to prevent module loading errors that crash the application.
const Loader: React.FC = () => {
  return (
    <div className="text-center p-4 text-slate-400">
      <span>Loading...</span>
    </div>
  );
};

export default Loader;
