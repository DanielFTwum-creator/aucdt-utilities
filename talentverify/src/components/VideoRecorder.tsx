import React, { useRef, useState } from 'react';
import { Video, StopCircle, Play, RotateCcw, Check } from 'lucide-react';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // seconds
}

export default function VideoRecorder({ onRecordingComplete, maxDuration = 90 }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

      // Timer
      let time = maxDuration;
      const timer = setInterval(() => {
        time--;
        setTimeLeft(time);
        if (time <= 0) {
          stopRecording();
          clearInterval(timer);
        }
      }, 1000);
      
      // Store timer ID to clear it if stopped manually
      (mediaRecorder as any).timerId = timer;

    } catch (err) {
      console.error(err);
      setError('Could not access camera/microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval((mediaRecorderRef.current as any).timerId);
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setPreviewUrl(null);
    setTimeLeft(maxDuration);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 text-center">
      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      {!previewUrl ? (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
          {isRecording && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-mono animate-pulse">
              REC {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      ) : (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video 
            src={previewUrl} 
            controls 
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!isRecording && !recordedBlob && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Video className="w-4 h-4" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <StopCircle className="w-4 h-4" />
            Stop Recording
          </button>
        )}

        {recordedBlob && (
          <button
            type="button"
            onClick={resetRecording}
            className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </button>
        )}
      </div>
      
      {recordedBlob && (
        <div className="mt-2 text-green-600 text-sm flex items-center justify-center gap-1">
          <Check className="w-4 h-4" />
          Video recorded successfully
        </div>
      )}
    </div>
  );
}
