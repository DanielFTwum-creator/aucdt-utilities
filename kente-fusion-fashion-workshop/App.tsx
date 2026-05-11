import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Canvas from './components/Canvas';
import { DesignState, DesignElement, KenteColor } from './types';

const STORAGE_KEY = 'kente_fusion_saved_design';

const initialDesignState: DesignState = {
  silhouette: null,
  kentePlacement: null,
  materialFusion: null,
  kenteColors: [],
  accessories: [],
  versatility: null,
};

function App() {
  const [designState, setDesignState] = useState<DesignState>(initialDesignState);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [hasSavedDesign, setHasSavedDesign] = useState<boolean>(false);

  // Check for saved design on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setHasSavedDesign(!!saved);
  }, []);

  const handleUpdateDesign = useCallback(
    (category: keyof DesignState, value: DesignElement | KenteColor | DesignElement[] | KenteColor[] | null) => {
      setDesignState((prev) => ({
        ...prev,
        [category]: value,
      }));
      // Reset generated image, error, and prompt on design change
      setGeneratedImageUrl(null);
      setError(null);
      setCurrentPrompt(null);
    },
    []
  );

  const handleResetDesign = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the current design?")) {
      setDesignState(initialDesignState);
      setGeneratedImageUrl(null);
      setIsLoading(false);
      setError(null);
      setCurrentPrompt(null);
    }
  }, []);

  const handleSaveDesign = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designState));
      setHasSavedDesign(true);
      alert("Design saved successfully to your browser!");
    } catch (e) {
      console.error("Failed to save design", e);
      alert("Failed to save design. Local storage might be full or disabled.");
    }
  }, [designState]);

  const handleLoadDesign = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedDesign = JSON.parse(saved);
        setDesignState(parsedDesign);
        setGeneratedImageUrl(null); // Clear image as the design parameters changed
        setError(null);
        setCurrentPrompt(null);
        alert("Design loaded successfully!");
      } catch (e) {
        console.error("Failed to parse saved design", e);
        alert("The saved design data appears to be corrupted.");
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A]">
      <Header />
      <div className="flex flex-col md:flex-row flex-grow">
        <ControlPanel
          designState={designState}
          onUpdate={handleUpdateDesign}
          onReset={handleResetDesign}
          onSave={handleSaveDesign}
          onLoad={handleLoadDesign}
          hasSavedDesign={hasSavedDesign}
          isLoading={isLoading}
        />
        <Canvas
          designState={designState}
          generatedImageUrl={generatedImageUrl}
          setGeneratedImageUrl={setGeneratedImageUrl}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          error={error}
          setError={setError}
          currentPrompt={currentPrompt}
          setCurrentPrompt={setCurrentPrompt}
        />
      </div>
    </div>
  );
}

export default App;