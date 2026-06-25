import React from 'react';

const TestSongGenerator: React.FC = () => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-md mt-4">
      <h4 className="font-semibold mb-2">Test Song Generator</h4>
      <p className="text-sm text-gray-400">
        Audio generation (Lyria) requires AI Studio integration and is not available in this deployment.
      </p>
    </div>
  );
};

export default TestSongGenerator;
