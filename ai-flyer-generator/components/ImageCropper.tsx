import React from 'react';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (url: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  
  const handleCrop = () => {
    // In this version, we pass the original image URL through.
    // A more advanced implementation would use a cropping library.
    onCropComplete(imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Crop Your Image</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Adjust the image to fit the flyer. For now, we'll use the full image.
        </p>
        <div className="max-h-[60vh] overflow-hidden rounded-lg mb-6 shadow-inner">
          <img src={imageUrl} alt="Preview for cropping" className="w-full h-auto object-contain" />
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
          <button onClick={handleCrop} className="px-6 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors">Use Image</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;