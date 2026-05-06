import React, { useState, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DesignState, KenteColor, DesignElement } from '../types';
import ColorSymbolismDisplay from './ColorSymbolismDisplay';

interface CanvasProps {
  designState: DesignState;
  generatedImageUrl: string | null;
  setGeneratedImageUrl: (url: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  currentPrompt: string | null; // New prop for displaying the prompt
  setCurrentPrompt: (prompt: string | null) => void; // New prop to set the prompt
}

// Helper for base64 decoding (as per GenAI guidelines) - currently not used for image, but kept as per instructions.
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const Canvas: React.FC<CanvasProps> = ({
  designState,
  generatedImageUrl,
  setGeneratedImageUrl,
  isLoading,
  setIsLoading,
  error,
  setError,
  currentPrompt,
  setCurrentPrompt,
}) => {
  const {
    silhouette,
    kentePlacement,
    materialFusion,
    kenteColors,
    accessories,
    versatility,
  } = designState;

  const generateOutfitPrompt = (): string => {
    let promptParts: string[] = [
      "A high-fashion, realistic photograph of a model wearing a contemporary Kente fusion outfit.",
      "The setting is a vibrant, modern runway or fashion studio.",
      "Focus on dynamic poses and excellent lighting to showcase the design details."
    ];

    if (silhouette) {
      promptParts.push(`The primary silhouette is a ${silhouette.name.toLowerCase()}.`);
    } else {
      promptParts.push("The silhouette is elegant and modern.");
    }

    if (kentePlacement) {
      promptParts.push(`It features a ${kentePlacement.name.toLowerCase()} using authentic, richly patterned Kente cloth.`);
    } else {
      promptParts.push("Kente fabric is strategically incorporated to create a striking visual impact.");
    }

    if (materialFusion) {
      promptParts.push(`The Kente is harmoniously fused with a ${materialFusion.name.toLowerCase()} material.`);
    } else {
      promptParts.push("The design blends Kente with complementary modern fabrics.");
    }

    if (kenteColors.length > 0) {
      const colorNames = kenteColors.map(c => c.name).join(', ');
      const symbolisms = kenteColors.map(c => c.symbolism).join('; ');
      promptParts.push(`Dominant Kente colors are ${colorNames}, which evoke themes of: ${symbolisms}.`);
    } else {
      promptParts.push("The Kente pattern features a vibrant, traditional color palette.");
    }

    if (accessories.length > 0) {
      const accessoryNames = accessories.map(acc => acc.name).join(', ');
      promptParts.push(`The look is completed with stylish accessories including ${accessoryNames}.`);
    } else {
      promptParts.push("Appropriate modern accessories enhance the outfit's appeal.");
    }

    if (versatility) {
      promptParts.push(`The garment emphasizes ${versatility.name.toLowerCase()} functionality and style.`);
    }

    promptParts.push("Ensure full body shot, high resolution, intricate fabric detail, and photorealistic quality.");

    return promptParts.join(' ');
  };

  const handleGenerateOutfit = async () => {
    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    setCurrentPrompt(null); // Clear previous prompt while generating new one

    try {
      const prompt = generateOutfitPrompt();
      setCurrentPrompt(prompt); // Store the prompt immediately

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

      if (imagePart?.inlineData?.data && imagePart?.inlineData?.mimeType) {
        const base64EncodeString: string = imagePart.inlineData.data;
        const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${base64EncodeString}`;
        setGeneratedImageUrl(imageUrl);
      } else {
        setError("Could not generate image. No image data received from the model.");
        console.error("GenerateContentResponse did not contain inlineData:", response);
        setCurrentPrompt(null); // Clear prompt if image generation failed
      }
    } catch (e: any) {
      console.error("Error generating outfit:", e);
      let errorMessage = "Failed to generate outfit image.";

      if (e.message && e.message.includes("403")) {
          errorMessage += " Ensure your API key has access to 'gemini-2.5-flash-image' and is correctly configured.";
      } else if (e.message && e.message.includes("500")) {
          errorMessage += " The model encountered an internal error. Please try again.";
      } else if (e.message && e.message.includes("content filtering")) {
          errorMessage += " The request was blocked due to safety concerns. Please refine your design description.";
      }
      setError(errorMessage);
      setCurrentPrompt(null); // Clear prompt on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = 'kente-fusion-outfit.png'; // Suggested filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareImage = async () => {
    if (generatedImageUrl) {
      if (navigator.share) {
        try {
          // Convert data URL to Blob for sharing as a file
          const response = await fetch(generatedImageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'kente-fusion-outfit.png', { type: blob.type });

          await navigator.share({
            title: 'My Kente Fusion Outfit',
            text: 'Check out this AI-generated Kente fusion fashion design!',
            files: [file],
          });
        } catch (error) {
          console.error('Error sharing:', error);
          if ((error as any).name !== 'AbortError') { // Ignore user cancellation of share sheet
            alert('Sharing failed. Your browser might not support sharing this content directly, or an error occurred. Opening image in a new tab.');
            window.open(generatedImageUrl, '_blank');
          }
        }
      } else {
        alert('Web Share API is not supported in your browser. Opening image in a new tab. You can right-click to save it.');
        window.open(generatedImageUrl, '_blank');
      }
    }
  };

  const hasSelections = [
    silhouette,
    kentePlacement,
    materialFusion,
    versatility,
  ].filter(Boolean).length > 0 || kenteColors.length > 0 || accessories.length > 0;

  return (
    <main className="flex-grow bg-[#1A1A1A] p-8 lg:p-12 flex flex-col items-center justify-start overflow-y-auto md:w-3/5 lg:w-3/4">
      <h2 className="text-4xl font-playfair-display uppercase letter-spacing-wide text-[#D4A017] mb-8 text-center leading-tight">
        Your Kente Fusion Creation
      </h2>

      {!hasSelections ? (
        <div className="text-center text-[#FAF5EB] p-10 border-2 border-dashed border-[#D4A017] border-opacity-30 rounded-lg max-w-xl mx-auto my-16 font-cormorant-garamond animate-[fade-in_1s_ease-out]">
          <p className="text-2xl font-semibold mb-4">Start Designing!</p>
          <p className="text-lg">Select elements from the left panel to bring your vision to life.</p>
          <p className="mt-4 text-sm italic">Let's craft something truly stunning.</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-[#2D2D2D] p-10 rounded-3xl shadow-deep border border-gray-700 flex flex-col items-center gap-10 animate-[fade-in_1s_ease-out]">
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-300 px-6 py-4 rounded-lg relative w-full mb-6" role="alert">
              <strong className="font-playfair-display uppercase mr-2">Error!</strong>
              <span className="block sm:inline ml-2 font-inter">{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerateOutfit}
            disabled={isLoading || !hasSelections}
            className={`w-full md:w-3/4 px-10 py-5 text-2xl font-bold font-playfair-display uppercase rounded-full transition-all duration-300 ease-in-out transform shadow-gold-glow-lg
              ${isLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-75' : 'bg-gradient-to-r from-[#D4A017] to-[#EACD8F] hover:from-[#EACD8F] hover:to-[#D4A017] text-[#1A1A1A] hover:scale-105'}`}
            aria-label="Generate Outfit Image"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-[#1A1A1A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating your Kente masterpiece...
              </span>
            ) : (
              'Generate Outfit'
            )}
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mt-8 w-full">
            <div className="flex-shrink-0 w-full lg:w-1/2">
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="AI Generated Kente Outfit Concept"
                  className="w-full h-auto object-contain rounded-2xl shadow-gold-glow-md ring-2 ring-[#D4A017] ring-opacity-50 transition-all duration-500 ease-in-out"
                  aria-live="polite"
                />
              ) : (
                <div className="w-full h-[700px] bg-gray-800 flex items-center justify-center rounded-2xl shadow-inner-dark ring-2 ring-[#D4A017] ring-opacity-30 animate-pulse">
                  <p className="font-cormorant-garamond text-gray-400 text-center text-xl">
                    {isLoading ? "Generating exquisite Kente design..." : "Your unique outfit concept will appear here."}
                  </p>
                </div>
              )}
              {kenteColors.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {kenteColors.map(color => (
                    <div key={color.hex} className="h-10 w-10 rounded-full shadow-md border-2 border-[#1A1A1A]" style={{ backgroundColor: color.hex }} title={color.name}></div>
                  ))}
                </div>
              )}

              {generatedImageUrl && (
                <div className="flex justify-center gap-6 mt-8">
                  <button
                    onClick={handleDownloadImage}
                    className="px-8 py-3 bg-[#D4A017] text-[#1A1A1A] font-bold font-inter rounded-full shadow-gold-glow-sm hover:bg-[#EACD8F] transition-all duration-300 transform hover:scale-105"
                    aria-label="Download generated image"
                  >
                    Download Image
                  </button>
                  <button
                    onClick={handleShareImage}
                    className="px-8 py-3 bg-[#D4A017] bg-opacity-70 text-[#FAF5EB] font-bold font-inter rounded-full shadow-gold-glow-sm hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    aria-label="Share generated image"
                  >
                    Share Image
                  </button>
                </div>
              )}
            </div>

            <div className="flex-grow w-full lg:w-1/2 bg-[#1A1A1A] p-8 rounded-xl shadow-inner-dark border border-gray-700">
              <h3 className="text-3xl font-playfair-display uppercase letter-spacing-wide text-[#D4A017] mb-6 border-b pb-4 border-gray-800">Design Details</h3>
              <ul className="space-y-5 font-inter text-[#FAF5EB]">
                {silhouette && (
                  <li className="animate-[fade-in-slide-up_0.5s_ease-out]">
                    <strong className="text-[#D4A017]">Silhouette:</strong> {silhouette.name}
                    <p className="text-sm text-gray-400 italic font-cormorant-garamond ml-4">{silhouette.description}</p>
                  </li>
                )}
                {kentePlacement && (
                  <li className="animate-[fade-in-slide-up_0.6s_ease-out]">
                    <strong className="text-[#D4A017]">Kente Placement:</strong> {kentePlacement.name}
                    <p className="text-sm text-gray-400 italic font-cormorant-garamond ml-4">{kentePlacement.description}</p>
                  </li>
                )}
                {materialFusion && (
                  <li className="animate-[fade-in-slide-up_0.7s_ease-out]">
                    <strong className="text-[#D4A017]">Material Fusion:</strong> {materialFusion.name}
                    <p className="text-sm text-gray-400 italic font-cormorant-garamond ml-4">{materialFusion.description}</p>
                  </li>
                )}
                {accessories.length > 0 && (
                  <li className="animate-[fade-in-slide-up_0.8s_ease-out]">
                    <strong className="text-[#D4A017]">Accessories:</strong>{' '}
                    {accessories.map((acc) => acc.name).join(', ')}
                    <ul className="list-disc list-inside ml-4 text-sm text-gray-400 italic font-cormorant-garamond">
                      {accessories.map((acc) => <li key={acc.id}>{acc.description}</li>)}
                    </ul>
                  </li>
                )}
                {versatility && (
                  <li className="animate-[fade-in-slide-up_0.9s_ease-out]">
                    <strong className="text-[#D4A017]">Versatility:</strong> {versatility.name}
                    <p className="text-sm text-gray-400 italic font-cormorant-garamond ml-4">{versatility.description}</p>
                  </li>
                )}
              </ul>

              {currentPrompt && (
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-inner-dark w-full animate-[fade-in_1s_ease-out]" role="status" aria-live="polite">
                  <h4 className="text-xl font-playfair-display uppercase letter-spacing-wide text-[#D4A017] mb-3">AI Generation Prompt:</h4>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono p-3 bg-[#1A1A1A] rounded-md overflow-x-auto border border-gray-700">
                    {currentPrompt}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ColorSymbolismDisplay colors={kenteColors} />
    </main>
  );
};

export default Canvas;