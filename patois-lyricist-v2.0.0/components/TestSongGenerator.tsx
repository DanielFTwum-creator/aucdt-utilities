import React, { useState } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

const TestSongGenerator: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTestSong = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      return;
    }

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);
    setLyrics("");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContentStream({
        model: "lyria-3-clip-preview",
        contents: 'Generate a 30-second cinematic orchestral track.',
        config: {
          responseModalities: [Modality.AUDIO],
        }
      });

      let audioBase64 = "";
      let lyricsText = "";
      let mimeType = "audio/wav";

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyricsText) {
            lyricsText = part.text;
          }
        }
      }

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setLyrics(lyricsText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-md mt-4">
      <h4 className="font-semibold mb-2">Test Song Generator</h4>
      <button 
        onClick={generateTestSong} 
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Test Song'}
      </button>
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
          {lyrics && <p className="mt-2 text-sm text-gray-300">Lyrics: {lyrics}</p>}
        </div>
      )}
    </div>
  );
};

export default TestSongGenerator;
