
import React, { useRef, useEffect, useState } from 'react';
import { Patient, PatientRecording } from '../types';

interface VideoCallProps {
  patient: Patient;
  appointmentId: string;
  onEnd: () => void;
  onSaveRecording: (recording: PatientRecording) => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ patient, appointmentId, onEnd, onSaveRecording }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    startCamera();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      clearInterval(timer);
    };
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = 'video/webm';
    }

    try {
      const recorder = new MediaRecorder(stream, options);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: options.mimeType });
        const url = URL.createObjectURL(blob);
        setRecordingBlobUrl(url);
        setShowPreview(true);
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveToRecord = () => {
    if (recordingBlobUrl) {
      const newRecording: PatientRecording = {
        id: `REC-${Math.random().toString(36).substr(2, 9)}`,
        patientId: patient.id,
        appointmentId,
        date: new Date().toISOString(),
        duration: recordingDuration,
        videoUrl: recordingBlobUrl,
        fileName: `Consultation_${patient.lastName}_${new Date().toLocaleDateString().replace(/\//g, '-')}.webm`
      };
      onSaveRecording(newRecording);
      setShowPreview(false);
      setRecordingBlobUrl(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setCameraOff(!cameraOff);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col md:flex-row items-stretch overflow-hidden animate-in fade-in duration-300">
      {/* Remote Video (Patient) - Placeholder */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute top-6 left-6 z-20 flex flex-col space-y-2">
          <div className="bg-emerald-600 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
            LIVE SESSION
          </div>
          {isRecording && (
            <div className="bg-rose-600 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center shadow-lg animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              REC {formatTime(recordingDuration)}
            </div>
          )}
          <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white shadow-xl mt-2">
            <h2 className="font-bold text-lg">{patient.firstName} {patient.lastName}</h2>
            <p className="text-xs text-gray-300">Remote Participant</p>
          </div>
        </div>

        {/* Placeholder for Patient Video */}
        <div className="flex flex-col items-center justify-center text-center px-6">
          <div className="w-32 h-32 rounded-full bg-emerald-800/50 flex items-center justify-center border-4 border-emerald-500/30 mb-6 animate-pulse">
            <span className="text-4xl font-bold text-emerald-200">{patient.firstName.charAt(0)}{patient.lastName.charAt(0)}</span>
          </div>
          <p className="text-emerald-400 font-medium tracking-wide">Connecting encrypted tunnel...</p>
          <p className="text-gray-500 text-xs mt-2 italic">Standard HIPAA compliant video connection</p>
        </div>

        {/* Local Video Overlay (Doctor) */}
        <div className="absolute bottom-24 md:bottom-32 right-6 w-40 md:w-64 aspect-video rounded-2xl bg-black border-2 border-white/20 shadow-2xl overflow-hidden z-30 transition-all hover:scale-105">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover ${cameraOff ? 'hidden' : 'block'}`}
          />
          {cameraOff && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/40 px-2 py-1 rounded text-[10px] text-white font-bold backdrop-blur-sm uppercase">YOU</div>
        </div>
      </div>

      {/* Recording Preview Modal */}
      {showPreview && recordingBlobUrl && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-xl text-gray-900">Session Recording Ready</h3>
               <button onClick={() => { setShowPreview(false); setRecordingBlobUrl(null); }} className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video src={recordingBlobUrl} controls className="max-h-full max-w-full" />
            </div>
            <div className="p-8 flex flex-col md:flex-row gap-4">
              <button 
                onClick={handleSaveToRecord}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                <span>Save to Patient Record</span>
              </button>
              <a 
                href={recordingBlobUrl} 
                download={`consultation_${patient.id}_${Date.now()}.webm`}
                className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all text-center flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span>Download Local Copy</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="h-24 md:h-auto md:w-24 bg-gray-950 border-t md:border-t-0 md:border-l border-white/10 flex flex-row md:flex-col items-center justify-around md:justify-center md:space-y-8 p-4 z-40">
        <button 
          onClick={toggleMute}
          className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          title={isMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMuted ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          )}
        </button>

        <button 
          onClick={toggleCamera}
          className={`p-4 rounded-2xl transition-all ${cameraOff ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
        </button>

        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-2xl transition-all ${isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
          title={isRecording ? "Stop Recording" : "Record Session"}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-white font-mono text-sm mb-1">{formatTime(callDuration)}</span>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
        </div>

        <button 
          onClick={onEnd}
          className="p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 shadow-xl shadow-red-900/20 transform hover:scale-110 active:scale-90 transition-all"
          title="End Consultation"
        >
          <svg className="w-8 h-8 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
