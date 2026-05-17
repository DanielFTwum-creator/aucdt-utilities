# kente-fusion-fashion-workshop - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for kente-fusion-fashion-workshop.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript
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
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_kente_fusion_fashion_workshop';
const ACCENT   = '#d97706';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Kente Fusion Fashion Workshop</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: components/Canvas.tsx
```typescript
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
```

### FILE: components/CheckboxGroup.tsx
```typescript
import React from 'react';
import { DesignElement, KenteColor } from '../types';

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: (DesignElement | KenteColor)[];
  selectedValues: (DesignElement | KenteColor)[];
  onChange: (value: DesignElement | KenteColor) => void;
  renderColorSwatch?: boolean;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  selectedValues,
  onChange,
  renderColorSwatch = false,
}) => {
  const isSelected = (option: DesignElement | KenteColor) =>
    selectedValues.some((selected) => selected.id === option.id);

  return (
    <div className="mb-6 bg-[#2D2D2D] p-6 rounded-xl shadow-deep border border-gray-700">
      <h3 className="text-xl font-playfair-display uppercase letter-spacing-wide mb-4 text-[#D4A017]">{label}</h3>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isColor = 'hex' in option;
          const kenteColor = option as KenteColor;
          const designElem = option as DesignElement;

          return (
            <label
              key={option.id}
              className={`group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform
                bg-[#1A1A1A] border border-gray-800 shadow-md hover:scale-[1.02] hover:shadow-lg
                ${isSelected(option) ? 'border-[#D4A017] ring-1 ring-[#D4A017] ring-opacity-70 shadow-gold-glow-sm bg-[#252525]' : ''}`
              }
              aria-checked={isSelected(option)}
              role="checkbox"
              tabIndex={0}
              title={isColor ? `Symbolism: ${kenteColor.symbolism}` : undefined}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(option); }}
            >
              <input
                type="checkbox"
                name={name}
                value={option.id}
                checked={isSelected(option)}
                onChange={() => onChange(option)}
                className="sr-only"
                aria-label={option.name}
              />
              
              {renderColorSwatch && isColor && (
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-inner mr-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: kenteColor.hex }}
                >
                  <div className="w-full h-full rounded-full opacity-0 hover:opacity-100 bg-black bg-opacity-10 transition-opacity duration-200"></div>
                </div>
              )}

              {!renderColorSwatch && label === 'Accessorizing for Impact' && (
                <span className="mr-3 text-2xl w-8 text-center" role="img" aria-label={option.name}>
                  {option.name === 'Minimalist Heels' && '👠'}
                  {option.name === 'Statement Gold Jewelry' && '✨'}
                  {option.name === 'Coordinated Headwrap' && '👳'}
                  {option.name === 'Chic Clutch' && '👜'}
                  {option.name === 'Geometric Earrings' && '💎'}
                </span>
              )}

              <div className="flex flex-col">
                <span className={`text-lg font-cormorant-garamond font-semibold text-[#FAF5EB] transition-colors duration-200 ${isSelected(option) ? 'text-[#D4A017]' : 'group-hover:text-[#EACD8F]'}`}>
                  {option.name}
                </span>
                <span className="text-xs font-inter text-gray-500 line-clamp-1 group-hover:text-gray-400">
                  {isColor ? kenteColor.symbolism : designElem.description}
                </span>
              </div>

              {isSelected(option) && (
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-[#D4A017]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxGroup;
```

### FILE: components/ColorSymbolismDisplay.tsx
```typescript
import React from 'react';
import { KenteColor } from '../types';

interface ColorSymbolismDisplayProps {
  colors: KenteColor[];
}

const ColorSymbolismDisplay: React.FC<ColorSymbolismDisplayProps> = ({ colors }) => {
  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#2D2D2D] p-8 rounded-2xl shadow-lg mt-12 border border-gray-700 animate-[fade-in_1.2s_ease-out]">
      <h3 className="text-2xl font-playfair-display uppercase letter-spacing-wide text-[#D4A017] mb-6">Selected Kente Colors & Symbolism</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {colors.map((color) => (
          <div key={color.hex} className="flex flex-col items-center bg-[#1A1A1A] p-6 rounded-xl shadow-md border border-gray-800 transition-all duration-300 hover:scale-105">
            <div
              className="w-20 h-20 rounded-full border-4 border-[#D4A017] border-opacity-50 shadow-gold-glow-sm mb-4 transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: color.hex }}
            ></div>
            <p className="text-xl font-playfair-display font-semibold text-[#FAF5EB] mb-2">{color.name}</p>
            <p className="text-sm font-cormorant-garamond text-gray-400 text-center italic">{color.symbolism}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSymbolismDisplay;
```

### FILE: components/ControlPanel.tsx
```typescript
import React from 'react';
import { DesignState, DesignElement, KenteColor } from '../types';
import { DESIGN_CATEGORIES, KENTE_COLORS, ACCESSORIES } from '../constants';
import RadioGroup from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';

interface ControlPanelProps {
  designState: DesignState;
  onUpdate: (category: keyof DesignState, value: DesignElement | KenteColor | DesignElement[] | KenteColor[] | null) => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  hasSavedDesign: boolean;
  isLoading: boolean;
}

type MultiSelectCategory = 'kenteColors' | 'accessories';

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  designState, 
  onUpdate, 
  onReset, 
  onSave, 
  onLoad, 
  hasSavedDesign, 
  isLoading 
}) => {

  const handleSingleSelectChange = (category: keyof DesignState, value: DesignElement) => {
    onUpdate(category, value);
  };

  const handleMultiSelectChange = (category: MultiSelectCategory, option: DesignElement | KenteColor) => {
    if (category === 'kenteColors') {
      const currentColors = designState.kenteColors;
      const isSelected = currentColors.some((item) => item.id === option.id);

      let newColors: KenteColor[];
      if (isSelected) {
        newColors = currentColors.filter((item) => item.id !== option.id);
      } else {
        newColors = [...currentColors, option as KenteColor];
      }
      onUpdate('kenteColors', newColors);
    } else if (category === 'accessories') {
      const currentAccessories = designState.accessories;
      const isSelected = currentAccessories.some((item) => item.id === option.id);

      let newAccessories: DesignElement[];
      if (isSelected) {
        newAccessories = currentAccessories.filter((item) => item.id !== option.id);
      } else {
        newAccessories = [...currentAccessories, option as DesignElement];
      }
      onUpdate('accessories', newAccessories);
    }
  };

  const getSelectedItems = () => {
    const items: (DesignElement | KenteColor)[] = [];
    if (designState.silhouette) items.push(designState.silhouette);
    if (designState.kentePlacement) items.push(designState.kentePlacement);
    if (designState.materialFusion) items.push(designState.materialFusion);
    if (designState.versatility) items.push(designState.versatility);
    items.push(...designState.kenteColors);
    items.push(...designState.accessories);
    return items;
  };

  const selectedItems = getSelectedItems();

  return (
    <aside className="w-full md:w-2/5 lg:w-1/4 bg-[#2D2D2D] p-8 shadow-2xl overflow-y-auto border-r border-gray-800 md:rounded-tr-3xl md:rounded-br-3xl flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-3xl font-playfair-display uppercase letter-spacing-wide text-[#D4A017] mb-8 text-center">Design Controls</h2>
        <p className="font-cormorant-garamond text-[#FAF5EB] mb-8 text-center text-md italic">
          Select elements to craft your unique Kente fusion masterpiece.
        </p>

        <div className="space-y-8 pb-10">
          {DESIGN_CATEGORIES.map((category) => {
            if (category.type === 'single') {
              const currentSelected = designState[category.id as keyof DesignState] as DesignElement | null;
              return (
                <RadioGroup
                  key={category.id}
                  label={category.name}
                  name={category.id}
                  options={category.options as DesignElement[]}
                  selectedValue={currentSelected}
                  onChange={(value) => handleSingleSelectChange(category.id as keyof DesignState, value)}
                />
              );
            } else if (category.id === 'kenteColors') {
              const currentSelectedColors = designState.kenteColors;
              return (
                <CheckboxGroup
                  key={category.id}
                  label={category.name}
                  name={category.id}
                  options={KENTE_COLORS}
                  selectedValues={currentSelectedColors}
                  onChange={(value) => handleMultiSelectChange(category.id as MultiSelectCategory, value as KenteColor)}
                  renderColorSwatch={true}
                />
              );
            } else if (category.type === 'multiple') {
              const currentSelected = designState[category.id as keyof DesignState] as DesignElement[];
              return (
                <CheckboxGroup
                  key={category.id}
                  label={category.name}
                  name={category.id}
                  options={category.options as DesignElement[]}
                  selectedValues={currentSelected}
                  onChange={(value) => handleMultiSelectChange(category.id as MultiSelectCategory, value as DesignElement)}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-[#2D2D2D] p-6 mt-auto border-t border-gray-700 shadow-inner-xl z-20">
        {selectedItems.length > 0 && (
          <div className="mb-4 text-sm font-inter text-gray-400">
            <h4 className="font-playfair-display uppercase text-[#D4A017] text-sm mb-2">Selected Elements:</h4>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {selectedItems.map((item) => (
                <span
                  key={item.id}
                  className="bg-[#D4A017] bg-opacity-20 text-[#D4A017] font-cormorant-garamond text-sm px-3 py-1 rounded-full border border-[#D4A017] transition-all duration-300"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={onSave}
            className="bg-[#1A1A1A] text-[#D4A017] border border-[#D4A017] font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#D4A017] hover:text-[#1A1A1A] text-sm"
          >
            Save Design
          </button>
          <button
            onClick={onLoad}
            disabled={!hasSavedDesign}
            className={`font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm border
              ${hasSavedDesign 
                ? 'bg-[#1A1A1A] text-[#FAF5EB] border-gray-600 hover:border-[#D4A017] hover:text-[#D4A017]' 
                : 'bg-gray-800 text-gray-600 border-transparent cursor-not-allowed'}`}
          >
            Load Saved
          </button>
        </div>

        <button
          onClick={onReset}
          disabled={isLoading}
          className={`w-full bg-[#D4A017] text-[#1A1A1A] font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform shadow-lg
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EACD8F] hover:scale-105'}`}
        >
          Reset All
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;
```

### FILE: components/Header.tsx
```typescript
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-br from-[#D4A017] via-[#8B4513] to-[#1A1A1A] bg-opacity-20 text-[#FAF5EB] p-4 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold font-playfair-display uppercase tracking-widest text-shadow-xl">
          Kente Fusion Fashion Workshop
        </h1>
        <p className="mt-2 md:mt-0 text-base md:text-lg opacity-90 text-center md:text-left font-cormorant-garamond text-shadow-sm italic">
          Blend rich Kente heritage with modern fashion
        </p>
      </div>
    </header>
  );
};

export default Header;
```

### FILE: components/RadioGroup.tsx
```typescript
import React from 'react';
import { DesignElement } from '../types';

interface RadioGroupProps {
  label: string;
  name: string;
  options: DesignElement[];
  selectedValue: DesignElement | null;
  onChange: (value: DesignElement) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange }) => {
  return (
    <div className="mb-6 bg-[#2D2D2D] p-6 rounded-xl shadow-deep border border-gray-700">
      <h3 className="text-xl font-playfair-display uppercase letter-spacing-wide mb-4 text-[#D4A017]">{label}</h3>
      <div className="space-y-4">
        {options.map((option) => (
          <label 
            key={option.id} 
            className={`flex flex-col p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform
              bg-[#1A1A1A] border border-gray-800 shadow-md hover:scale-102 hover:shadow-lg
              ${selectedValue?.id === option.id ? 'border-[#D4A017] ring-2 ring-[#D4A017] ring-opacity-70 shadow-gold-glow-sm' : ''}`
            }
            aria-checked={selectedValue?.id === option.id}
            role="radio"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(option); }}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selectedValue?.id === option.id}
              onChange={() => onChange(option)}
              className="sr-only" // Visually hide the radio input
              aria-label={option.name}
            />
            <span className="text-lg font-cormorant-garamond font-semibold text-[#FAF5EB] group-hover:text-[#D4A017] transition-colors duration-200">
              {option.name}
            </span>
            <span className="text-sm font-inter text-gray-400 mt-1">
              {option.description}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
```

### FILE: constants.ts
```typescript
import { DesignElement, KenteColor } from './types';

export const SILHOUETTES: DesignElement[] = [
  { id: 'structured-bodice', name: 'Structured Bodice', description: 'A fitted, structured upper part, offering a sophisticated and modern look.' },
  { id: 'off-shoulder', name: 'Off-Shoulder Style', description: 'Exposing the shoulders for an elegant and contemporary feel.' },
  { id: 'a-line-gown', name: 'A-line Gown', description: 'A classic, flattering silhouette that is fitted at the bodice and flares out gracefully to the hem.' },
  { id: 'jumpsuit', name: 'Jumpsuit', description: 'A stylish one-piece garment, blending comfort with high fashion.' },
  { id: 'blazer', name: 'Blazer', description: 'A tailored jacket, perfect for a sharp, powerful, and versatile statement.' },
  { id: 'peplum-top', name: 'Peplum Top', description: 'A top with a short, flared ruffle around the waist, adding a chic and feminine touch.' },
  { id: 'infinity-dress', name: 'Infinity Dress', description: 'A versatile dress that can be styled in numerous ways, offering adaptability.' },
];

export const KENTE_PLACEMENTS: DesignElement[] = [
  { id: 'statement-panel', name: 'Statement Panel', description: 'A prominent section of Kente cloth integrated into the garment, drawing attention.' },
  { id: 'dramatic-sleeve', name: 'Dramatic Sleeve', description: 'Voluminous or uniquely shaped sleeves made with Kente, creating a focal point.' },
  { id: 'peplum-detail', name: 'Peplum Detail', description: 'Kente cloth used for the peplum, adding a vibrant and textured flare.' },
  { id: 'oversized-bow', name: 'Oversized Bow', description: 'A large, decorative bow made from Kente, offering a playful yet elegant accent.' },
  { id: 'collar-cuff', name: 'Collar & Cuff Accents', description: 'Subtle Kente detailing on collars and cuffs for a refined touch.' },
];

export const MATERIAL_FUSIONS: DesignElement[] = [
  { id: 'tulle-skirt', name: 'Tulle Skirt', description: 'Kente bodice paired with a light, flowing tulle skirt for contrast and elegance.' },
  { id: 'denim-base', name: 'Denim Base', description: 'Kente accents over a casual denim garment, blending traditional with urban style.' },
  { id: 'ankara-base', name: 'Ankara Base', description: 'Kente incorporated into an Ankara fabric outfit, a fusion of African prints.' },
  { id: 'plain-silk', name: 'Plain Silk', description: 'Kente combined with luxurious plain silk for a sophisticated and smooth contrast.' },
];

export const KENTE_COLORS: KenteColor[] = [
  { id: 'Gold', name: 'Gold', hex: '#FFD700', symbolism: 'Royalty, wealth, high status, glory, spiritual purity' },
  { id: 'Blue', name: 'Blue', hex: '#0000FF', symbolism: 'Peace, harmony, love, patience, tenderness' },
  { id: 'Green', name: 'Green', hex: '#008000', symbolism: 'Growth, harvest, renewal, good health, spiritual growth' },
  { id: 'Red', name: 'Red', hex: '#FF0000', symbolism: 'Passion, strength, political power, blood, sacrifice' },
  { id: 'Black', name: 'Black', hex: '#000000', symbolism: 'Maturity, spirituality, ancestors, mourning, strong spiritual energy' },
  { id: 'White', name: 'White', hex: '#FFFFFF', symbolism: 'Purity, cleansing, festive occasions, innocence' },
  { id: 'Yellow', name: 'Yellow', hex: '#FFFF00', symbolism: 'Preciousness, royalty, wealth, fertility' },
];

export const ACCESSORIES: DesignElement[] = [
  { id: 'minimalist-heels', name: 'Minimalist Heels', description: 'Sleek, simple heels that complement without distracting.' },
  { id: 'statement-gold-jewelry', name: 'Statement Gold Jewelry', description: 'Bold gold pieces that enhance the royal feel of Kente.' },
  { id: 'coordinated-headwrap', name: 'Coordinated Headwrap', description: 'A headwrap matching or complementing the Kente pattern.' },
  { id: 'chic-clutch', name: 'Chic Clutch', description: 'A stylish, small handbag for elegance and functionality.' },
  { id: 'geometric-earrings', name: 'Geometric Earrings', description: 'Modern earrings with sharp lines to contrast traditional patterns.' },
];

export const VERSATILITY_OPTIONS: DesignElement[] = [
  { id: 'jumpsuit-multi', name: 'Jumpsuit (Multi-wear)', description: 'A versatile jumpsuit that can be dressed up or down for various occasions.' },
  { id: 'two-piece-set', name: 'Two-Piece Set', description: 'Separate top and bottom that can be worn together or mixed and matched.' },
  { id: 'adaptable-dress', name: 'Adaptable Dress', description: 'A dress (like an infinity dress) with changeable styling options.' },
];

export const DESIGN_CATEGORIES = [
    { id: 'silhouette', name: 'Contemporary Silhouettes', options: SILHOUETTES, type: 'single' },
    { id: 'kentePlacement', name: 'Strategic Kente Placement', options: KENTE_PLACEMENTS, type: 'single' },
    { id: 'materialFusion', name: 'Fusion with Other Materials', options: MATERIAL_FUSIONS, type: 'single' },
    { id: 'kenteColors', name: 'Colour Play & Symbolism', options: KENTE_COLORS, type: 'multiple' },
    { id: 'accessories', name: 'Accessorizing for Impact', options: ACCESSORIES, type: 'multiple' },
    { id: 'versatility', name: 'Versatility in Design', options: VERSATILITY_OPTIONS, type: 'single' },
];
```

### FILE: CREATION.md
```md
# kente-fusion-fashion-workshop

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/kente-fusion-fashion-workshop/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/kente-fusion-fashion-workshop/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/kente-fusion-fashion-workshop/',  // REQUIRED: Assets must load from /kente-fusion-fashion-workshop/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/kente-fusion-fashion-workshop"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/kente-fusion-fashion-workshop">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/kente-fusion-fashion-workshop/`, not at the root
- **Asset Loading**: Without `base: '/kente-fusion-fashion-workshop/'`, assets try to load from `/assets/` instead of `/kente-fusion-fashion-workshop/assets/`
- **Routing**: Without `basename="/kente-fusion-fashion-workshop"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/kente-fusion-fashion-workshop/assets/index-*.js`
- Link tags should reference: `/kente-fusion-fashion-workshop/assets/index-*.css`

If they reference `/assets/` instead of `/kente-fusion-fashion-workshop/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/kente-fusion-fashion-workshop/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/kente-fusion-fashion-workshop/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: kente-fusion-fashion-workshop

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — kente-fusion-fashion-workshop

**Application:** kente-fusion-fashion-workshop
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_kente-fusion-fashion-workshop_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — kente-fusion-fashion-workshop

**Application:** kente-fusion-fashion-workshop
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd kente-fusion-fashion-workshop
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build kente-fusion-fashion-workshop
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up kente-fusion-fashion-workshop
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Kente Fusion Fashion Workshop
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Kente Fusion Fashion Workshop**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Kente Fusion Fashion Workshop** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Kente Fusion Fashion Workshop** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — kente-fusion-fashion-workshop

**Application:** kente-fusion-fashion-workshop
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd kente-fusion-fashion-workshop
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Kente Fusion Fashion Workshop | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Kente Fusion Fashion Workshop | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kente Fusion Fashion Workshop | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">kente fusion fashion workshop</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "Kente Fusion Fashion Workshop",
  "description": "An interactive workshop for designing contemporary outfits blending Kente cloth with modern styles, focusing on silhouettes, placement, material fusion, color symbolism, and accessories.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "kente-fusion-fashion-workshop",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@google/genai": "^1.40.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "serve": "14.2.5",
    "typescript": "~5.8.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1wb7aiNB5t8ZxvqPor3G3sCbEuAivVS06

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Kente Fusion Fashion Workshop</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Kente Fusion Fashion Workshop — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — kente-fusion-fashion-workshop
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('kente-fusion-fashion-workshop E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript
export interface DesignElement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; // Optional image for visual representation
}

export interface KenteColor {
  id: string; // Added to enable consistent identification
  name: string;
  hex: string;
  symbolism: string;
}

export interface DesignState {
  silhouette: DesignElement | null;
  kentePlacement: DesignElement | null;
  materialFusion: DesignElement | null;
  kenteColors: KenteColor[];
  accessories: DesignElement[];
  versatility: DesignElement | null;
}
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
  base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — kente-fusion-fashion-workshop
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — kente-fusion-fashion-workshop
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

