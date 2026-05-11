import React, { useState, useRef, TouchEvent, WheelEvent, MouseEvent } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (url: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartDistance = useRef<number | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageStartPos = useRef({ x: 0, y: 0 });

  const handleCrop = async () => {
    if (imageContainerRef.current) {
      setIsCropping(true);
      try {
        const canvas = await html2canvas(imageContainerRef.current, { 
          useCORS: true,
          backgroundColor: null,
          width: imageContainerRef.current.clientWidth,
          height: imageContainerRef.current.clientHeight,
        });
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.92);
        onCropComplete(croppedImageUrl);
      } catch (e) {
        console.error("Image cropping failed:", e);
        onCancel(); // Fallback on error
      }
    } else {
      onCropComplete(imageUrl);
    }
  };

  const getDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };
  
  // Mouse Drag Handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    imageStartPos.current = position;
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x);
    const dy = (e.clientY - dragStart.current.y);
    setPosition({
      x: imageStartPos.current.x + dx,
      y: imageStartPos.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grab';
    }
  };

  // Touch Handlers for Pinch-to-Zoom and Pan
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      imageStartPos.current = position;
      touchStartDistance.current = null;
    } else if (e.touches.length === 2) {
      e.preventDefault();
      setIsDragging(false);
      touchStartDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const dx = (touch.clientX - dragStart.current.x);
      const dy = (touch.clientY - dragStart.current.y);
      setPosition({
        x: imageStartPos.current.x + dx,
        y: imageStartPos.current.y + dy,
      });
    } else if (e.touches.length === 2 && touchStartDistance.current) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const scale = newDistance / touchStartDistance.current;
      setZoom(prevZoom => Math.max(1, Math.min(prevZoom * scale, 5)));
      touchStartDistance.current = newDistance;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistance.current = null;
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.01;
    setZoom(Math.max(1, Math.min(newZoom, 5)));
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };


  return (
    <div className="text-center">
        {isCropping && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 backdrop-blur-sm flex flex-col justify-center items-center z-50 rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mb-4"></div>
                <p className="text-white text-lg font-semibold">Processing Image...</p>
            </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Adjust Image</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Click and drag to pan. Use slider, mouse wheel, or pinch to zoom.
        </p>
        
        <div
          className="w-full max-w-sm aspect-[9/16] mx-auto overflow-hidden rounded-lg mb-6 shadow-inner bg-gray-200 dark:bg-gray-900 cursor-grab"
          ref={imageContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <img
            src={imageUrl}
            alt="Preview for cropping"
            className="w-full h-auto"
            style={{ 
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`, 
              touchAction: 'none',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              maxWidth: 'none',
            }}
          />
        </div>
        
        <div className="flex items-center gap-4 mb-6 max-w-sm mx-auto">
          <ZoomOut className="w-5 h-5 text-gray-500" />
          <input
            type="range"
            min="1"
            max="5"
            step="0.01"
            value={zoom}
            onChange={handleZoomChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Zoom slider"
            title="Adjust the zoom level of the image"
            disabled={isCropping}
          />
          <ZoomIn className="w-5 h-5 text-gray-500" />
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            disabled={isCropping}
            className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            title="Discard changes and cancel cropping"
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop} 
            disabled={isCropping}
            className="px-6 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:opacity-50"
            title="Confirm the adjustment and use this image"
          >
            Use Image
          </button>
        </div>
      </div>
  );
};

export default ImageCropper;