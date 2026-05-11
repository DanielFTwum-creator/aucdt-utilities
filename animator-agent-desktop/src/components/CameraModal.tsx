import { useRef, useEffect } from 'react';

interface CameraModalProps {
  onClose: () => void;
  onPhotoTaken: (photoDataUrl: string) => void;
}

export function CameraModal({ onClose, onPhotoTaken }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera', err);
        alert('Could not access camera.');
        onClose();
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        onPhotoTaken(dataUrl);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Update profile photo"
    >
      <div className="bg-[var(--c-bg-panel)] border border-[var(--c-border-default)] rounded-xl p-6 w-[400px] flex flex-col gap-4 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-[var(--c-text-primary)] text-sm font-semibold tracking-tight" id="camera-modal-title">Update Profile Photo</h2>
          <button
            type="button"
            className="text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] transition-colors"
            onClick={onClose}
            aria-label="Close camera modal"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="relative w-full aspect-square bg-[var(--c-bg-base)] rounded-lg overflow-hidden border border-[var(--c-border-default)]">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" aria-label="Camera preview" />
          <div className="absolute inset-0 border-2 border-[var(--c-accent-soft)]/20 border-dashed rounded-lg pointer-events-none m-4" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="w-full py-3 bg-[var(--c-accent-strong)] hover:bg-[var(--c-accent-mid)] text-white rounded font-medium transition-colors"
          onClick={takePhoto}
          aria-label="Capture photo"
        >
          Take photo
        </button>
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </div>
    </div>
  );
}
