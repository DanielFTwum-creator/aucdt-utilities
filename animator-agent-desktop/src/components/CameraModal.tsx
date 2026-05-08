import { useRef } from 'react';

interface CameraModalProps {
  onClose: () => void;
  onPhotoTaken: (photoDataUrl: string) => void;
}

export function CameraModal({ onClose, onPhotoTaken }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        onPhotoTaken(dataUrl);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-[400px] flex flex-col gap-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-semibold tracking-tight">Update Profile Photo</h2>
          <button className="text-zinc-500 hover:text-white transition-colors" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="relative w-full aspect-square bg-[#09090b] rounded-lg overflow-hidden border border-[#27272a]">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
          <div className="absolute inset-0 border-2 border-indigo-500/30 border-dashed rounded-lg pointer-events-none m-4" />
        </div>

        <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition-colors" onClick={takePhoto}>
          TAKE PHOTO
        </button>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
