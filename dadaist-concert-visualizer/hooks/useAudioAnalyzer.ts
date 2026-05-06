import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioData } from '../types';

export const useAudioAnalyzer = (isActive: boolean) => {
  const [audioData, setAudioData] = useState<AudioData>({
    frequencyData: new Uint8Array(0),
    bass: 0,
    mid: 0,
    treble: 0,
    volume: 0
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
  }, []);

  useEffect(() => {
    if (!isActive) {
      cleanup();
      return;
    }

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const update = () => {
          if (!analyser) return;

          analyser.getByteFrequencyData(dataArray);

          // Calculate bands
          const bassRange = dataArray.slice(0, 10);
          const midRange = dataArray.slice(11, 100);
          const trebleRange = dataArray.slice(101, 255);

          const getAvg = (arr: Uint8Array) => arr.reduce((a, b) => a + b, 0) / arr.length;

          const bass = getAvg(bassRange);
          const mid = getAvg(midRange);
          const treble = getAvg(trebleRange);
          const volume = getAvg(dataArray) / 255;

          setAudioData({
            frequencyData: dataArray,
            bass,
            mid,
            treble,
            volume
          });

          rafIdRef.current = requestAnimationFrame(update);
        };

        update();

      } catch (err) {
        console.error("Error accessing microphone:", err);
        // Fallback or error handling could go here
      }
    };

    initAudio();

    return cleanup;
  }, [isActive, cleanup]);

  return audioData;
};