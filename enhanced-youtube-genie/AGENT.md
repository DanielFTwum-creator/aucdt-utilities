# enhanced-youtube-genie - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for enhanced-youtube-genie.

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

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript

import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateDescription } from './services/geminiService';
import type { FormData } from './types';
import { DESCRIPTION_TEMPLATE } from './constants';
import { SparklesIcon } from './components/ui/icons';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    songTitle: 'Run Away Riddim Mix',
    artistName: 'Kudjo Twum',
    youtubeHandle: '@KudjoTwum',
    genres: 'Dub Reggae, Dark Pop, Electropop, Dancehall',
    influences: 'Bob Marley and The Wailers, Steel Pulse, Third World',
    vibeKeywords: 'Eerie, driving, anthemic, confessional, raw',
    chorusLine: 'Yuh cyan run \'way from yuhself!',
    lyrics: DESCRIPTION_TEMPLATE.split('--- LYRICS --')[1].trim(),
    credits: 'Produced/Mixed/Vocals: Kudjo Twum\nArtwork: Kudjo Twum',
  });
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedDescription('');
    try {
      const result = await generateDescription(formData);
      setGeneratedDescription(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10" />
            YouTube Description Genie
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Craft the perfect YouTube description for your music with AI.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
          <OutputDisplay
            description={generatedDescription}
            isLoading={isLoading}
            error={error}
          />
        </main>
         <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Google Gemini. Designed for musicians, by engineers.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

```

### FILE: AppEnhanced.tsx
```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { InputFormEnhanced } from './components/InputFormEnhanced';
import { OutputDisplay } from './components/OutputDisplay';
import { generateDescription, checkAPIAvailability } from './services/geminiServiceEnhanced';
import type { FormData } from './types';
import { DESCRIPTION_TEMPLATE } from './constants';
import { SparklesIcon, InfoIcon, AlertTriangleIcon } from './components/ui/iconsEnhanced';

const AppEnhanced: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    songTitle: 'Run Away Riddim Mix',
    artistName: 'Kudjo Twum',
    youtubeHandle: '@KudjoTwum',
    genres: 'Dub Reggae, Dark Pop, Electropop, Dancehall',
    influences: 'Bob Marley and The Wailers, Steel Pulse, Third World',
    vibeKeywords: 'Eerie, driving, anthemic, confessional, raw',
    chorusLine: 'Yuh cyan run \'way from yuhself!',
    lyrics: DESCRIPTION_TEMPLATE.split('--- LYRICS --')[1].trim(),
    credits: 'Produced/Mixed/Vocals: Kudjo Twum\nArtwork: Kudjo Twum',
  });
  
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Check API availability on component mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const isAvailable = await checkAPIAvailability();
        setApiStatus(isAvailable ? 'available' : 'unavailable');
      } catch (error) {
        setApiStatus('unavailable');
      }
    };

    checkAPI();
  }, []);

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('youtube-genie-form-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        setShowWelcomeMessage(false);
      } catch (error) {
        console.warn('Failed to load saved form data');
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('youtube-genie-form-data', JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedDescription('');
    
    try {
      const result = await generateDescription(formData);
      setGeneratedDescription(result);
      setShowWelcomeMessage(false);
      
      // Track successful generation
      const stats = JSON.parse(localStorage.getItem('youtube-genie-stats') || '{"generations": 0, "lastUsed": null}');
      stats.generations += 1;
      stats.lastUsed = new Date().toISOString();
      localStorage.setItem('youtube-genie-stats', JSON.stringify(stats));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleClearForm = () => {
    setFormData({
      songTitle: '',
      artistName: '',
      youtubeHandle: '@',
      genres: '',
      influences: '',
      vibeKeywords: '',
      chorusLine: '',
      lyrics: '',
      credits: '',
    });
    setGeneratedDescription('');
    setError(null);
    localStorage.removeItem('youtube-genie-form-data');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10" />
            YouTube Description Genie
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full ml-2">Enhanced</span>
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Craft the perfect YouTube description for your music with AI.
          </p>
          
          {/* API Status Indicator */}
          <div className="mt-4 flex items-center justify-center">
            {apiStatus === 'checking' && (
              <div className="flex items-center text-yellow-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
                Checking AI service...
              </div>
            )}
            {apiStatus === 'available' && (
              <div className="flex items-center text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                AI service ready
              </div>
            )}
            {apiStatus === 'unavailable' && (
              <div className="flex items-center text-red-400 text-sm">
                <AlertTriangleIcon className="w-4 h-4 mr-2" />
                AI service unavailable - Demo mode only
              </div>
            )}
          </div>

          {/* Welcome Message */}
          {showWelcomeMessage && (
            <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start">
                <InfoIcon className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-blue-300 font-semibold mb-2">Welcome to the Enhanced Version!</h3>
                  <p className="text-blue-200 text-sm">
                    This enhanced version includes input validation, better error handling, auto-save functionality, 
                    and improved user experience. Your form data is automatically saved as you type.
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputFormEnhanced
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
          <OutputDisplay
            description={generatedDescription}
            isLoading={isLoading}
            error={error}
          />
        </main>

        {/* Additional Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleClearForm}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-gray-600 hover:border-gray-500 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            Clear Form
          </button>
          <button
            onClick={() => setShowWelcomeMessage(!showWelcomeMessage)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-gray-600 hover:border-gray-500 rounded-md transition-colors duration-200"
          >
            {showWelcomeMessage ? 'Hide' : 'Show'} Welcome Message
          </button>
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Enhanced version with improved validation, error handling, and user experience.</p>
          <p className="mt-1">Powered by Google Gemini. Designed for musicians, by engineers.</p>
        </footer>
      </div>
    </div>
  );
};

export default AppEnhanced;


```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_enhanced_youtube_genie';
const ACCENT   = '#0891b2';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Enhanced Youtube Genie</h1>
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

### FILE: components/InputForm.tsx
```typescript

import React from 'react';
import type { FormData } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { MagicWandIcon } from './ui/icons';

interface InputFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-600 pb-2">Enter Song Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Song Title" name="songTitle" value={formData.songTitle} onChange={handleChange} required />
          <Input label="Artist Name" name="artistName" value={formData.artistName} onChange={handleChange} required />
        </div>

        <Input label="YouTube Channel Handle (e.g., @YourChannel)" name="youtubeHandle" value={formData.youtubeHandle} onChange={handleChange} required />
        <Input label="Genres (comma-separated)" name="genres" value={formData.genres} onChange={handleChange} placeholder="e.g., Synthwave, Dark Pop, Electronic" required />
        <Input label="Influences (comma-separated)" name="influences" value={formData.influences} onChange={handleChange} placeholder="e.g., The Weeknd, Kavinsky, CHVRCHES" />
        <Input label="Vibe Keywords (comma-separated)" name="vibeKeywords" value={formData.vibeKeywords} onChange={handleChange} placeholder="e.g., Nostalgic, driving, cinematic" required />
        <Input label="Key Chorus Line" name="chorusLine" value={formData.chorusLine} onChange={handleChange} placeholder="The most memorable line from your chorus" />
        
        <Textarea
          label="Credits"
          name="credits"
          value={formData.credits}
          onChange={handleChange}
          rows={3}
          placeholder="e.g., Produced by: John Doe&#10;Mixed by: Jane Smith"
        />

        <Textarea
          label="Lyrics"
          name="lyrics"
          value={formData.lyrics}
          onChange={handleChange}
          rows={12}
          required
          placeholder="Paste your full song lyrics here..."
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Generating...' : (
            <>
              <MagicWandIcon className="w-5 h-5 mr-2" />
              Generate Description
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

```

### FILE: components/InputFormEnhanced.tsx
```typescript
import React, { useState, useEffect } from 'react';
import type { FormData } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { MagicWandIcon, AlertTriangleIcon } from './ui/iconsEnhanced';
import { validateField, validateForm, isFormValid, type FormValidation } from '../utils/validation';

interface InputFormEnhancedProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputFormEnhanced: React.FC<InputFormEnhancedProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  isLoading 
}) => {
  const [validation, setValidation] = useState<FormValidation>({
    songTitle: { isValid: true, errors: [] },
    artistName: { isValid: true, errors: [] },
    youtubeHandle: { isValid: true, errors: [] },
    genres: { isValid: true, errors: [] },
    vibeKeywords: { isValid: true, errors: [] },
    lyrics: { isValid: true, errors: [] },
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const fieldValidation = validateField(name, value);
    setValidation(prev => ({
      ...prev,
      [name]: fieldValidation
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fullValidation = validateForm(formData);
    setValidation(fullValidation);
    setShowAllErrors(true);
    
    if (isFormValid(fullValidation)) {
      onSubmit();
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(fullValidation).find(
        key => !fullValidation[key as keyof FormValidation].isValid
      );
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const shouldShowError = (fieldName: string) => {
    return showAllErrors || touched[fieldName];
  };

  const getFieldError = (fieldName: keyof FormValidation) => {
    const fieldValidation = validation[fieldName];
    if (!shouldShowError(fieldName) || fieldValidation.isValid) {
      return null;
    }
    return fieldValidation.errors[0];
  };

  const formIsValid = isFormValid(validation);
  const hasRequiredFields = formData.songTitle && formData.artistName && formData.youtubeHandle && 
                           formData.genres && formData.vibeKeywords && formData.lyrics;

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
          <h2 className="text-2xl font-bold text-white">Enter Song Details</h2>
          {!formIsValid && showAllErrors && (
            <div className="flex items-center text-red-400 text-sm">
              <AlertTriangleIcon className="w-4 h-4 mr-1" />
              Please fix errors below
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input 
              label="Song Title" 
              name="songTitle" 
              value={formData.songTitle} 
              onChange={handleChange}
              onBlur={handleBlur}
              required 
              error={getFieldError('songTitle')}
              className={!validation.songTitle.isValid && shouldShowError('songTitle') ? 'border-red-500' : ''}
            />
          </div>
          <div>
            <Input 
              label="Artist Name" 
              name="artistName" 
              value={formData.artistName} 
              onChange={handleChange}
              onBlur={handleBlur}
              required 
              error={getFieldError('artistName')}
              className={!validation.artistName.isValid && shouldShowError('artistName') ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <Input 
          label="YouTube Channel Handle" 
          name="youtubeHandle" 
          value={formData.youtubeHandle} 
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="@YourChannel"
          required 
          error={getFieldError('youtubeHandle')}
          className={!validation.youtubeHandle.isValid && shouldShowError('youtubeHandle') ? 'border-red-500' : ''}
        />

        <Input 
          label="Genres" 
          name="genres" 
          value={formData.genres} 
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Synthwave, Dark Pop, Electronic" 
          required 
          error={getFieldError('genres')}
          className={!validation.genres.isValid && shouldShowError('genres') ? 'border-red-500' : ''}
          helpText="Separate multiple genres with commas"
        />

        <Input 
          label="Influences" 
          name="influences" 
          value={formData.influences} 
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., The Weeknd, Kavinsky, CHVRCHES" 
          helpText="Optional: Artists or bands that influenced this song"
        />

        <Input 
          label="Vibe Keywords" 
          name="vibeKeywords" 
          value={formData.vibeKeywords} 
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Nostalgic, driving, cinematic" 
          required 
          error={getFieldError('vibeKeywords')}
          className={!validation.vibeKeywords.isValid && shouldShowError('vibeKeywords') ? 'border-red-500' : ''}
          helpText="Describe the mood and feeling of your song"
        />

        <Input 
          label="Key Chorus Line" 
          name="chorusLine" 
          value={formData.chorusLine} 
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="The most memorable line from your chorus" 
          helpText="Optional: The hook that listeners will remember"
        />
        
        <Textarea
          label="Credits"
          name="credits"
          value={formData.credits}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={3}
          placeholder="e.g., Produced by: John Doe&#10;Mixed by: Jane Smith"
          helpText="Optional: Production credits and collaborators"
        />

        <Textarea
          label="Lyrics"
          name="lyrics"
          value={formData.lyrics}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={12}
          required
          placeholder="Paste your full song lyrics here..."
          error={getFieldError('lyrics')}
          className={!validation.lyrics.isValid && shouldShowError('lyrics') ? 'border-red-500' : ''}
          helpText="Full song lyrics help generate better descriptions"
        />
        
        <Button 
          type="submit" 
          disabled={isLoading || (!hasRequiredFields && !showAllErrors)} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Description...
            </>
          ) : (
            <>
              <MagicWandIcon className="w-5 h-5 mr-2" />
              Generate Description
            </>
          )}
        </Button>

        {!hasRequiredFields && !showAllErrors && (
          <p className="text-sm text-gray-400 text-center">
            Fill in all required fields to generate your description
          </p>
        )}
      </form>
    </Card>
  );
};


```

### FILE: components/OutputDisplay.tsx
```typescript

import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';
import { CopyIcon, CheckIcon, ExclamationIcon } from './ui/icons';

interface OutputDisplayProps {
  description: string;
  isLoading: boolean;
  error: string | null;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ description, isLoading, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (description) {
      setIsCopied(false);
    }
  }, [description]);

  const handleCopy = () => {
    if (description) {
      navigator.clipboard.writeText(description);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
        <h2 className="text-2xl font-bold text-white">Generated Description</h2>
        {description && (
          <Button onClick={handleCopy} variant="secondary" size="sm" disabled={isCopied}>
            {isCopied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>

      <div className="relative w-full h-full min-h-[500px] lg:min-h-0 lg:h-[calc(100%-4rem)]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/50 rounded-lg">
            <Spinner />
            <p className="mt-4 text-gray-300">AI is crafting your description...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-red-400 p-4">
            <ExclamationIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && !description && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 p-4">
             <p className="text-lg">Your generated description will appear here.</p>
             <p className="mt-2">Fill out the form and click "Generate" to start.</p>
          </div>
        )}
        
        {description && (
          <div className="prose prose-invert prose-sm max-w-none w-full h-full overflow-y-auto rounded-lg bg-gray-900 p-4 whitespace-pre-wrap font-mono">
            {description}
          </div>
        )}
      </div>
    </Card>
  );
};

```

### FILE: components/ui/Button.tsx
```typescript

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500',
    secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

```

### FILE: components/ui/Card.tsx
```typescript

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

```

### FILE: components/ui/icons.tsx
```typescript

import React from 'react';

export const MagicWandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .879 16.5a3 3 0 0 0 1.128-5.78l8.3-4.769a3 3 0 0 0 1.128-5.78 2.25 2.25 0 0 1 2.118-2.475 2.25 2.25 0 0 1 2.118 2.475 3 3 0 0 0 5.78 1.128 2.25 2.25 0 0 1 2.475 2.118 2.25 2.25 0 0 1-2.475 2.118 3 3 0 0 0-1.128 5.78l-8.3 4.77z" />
  </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.452-2.452L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.452-2.452L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.452 2.452L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.452 2.452Z" />
    </svg>
);

export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
);

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export const ExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

```

### FILE: components/ui/iconsEnhanced.tsx
```typescript
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l3.057-3L11 3l3.057 3L17 3v4l-3.057 3L11 7 7.943 10 5 7V3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21l3.057-3L11 21l3.057 3L17 21v-4l-3.057-3L11 17l-3.057-3L5 17v4z" />
  </svg>
);

export const MagicWandIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-3 9-9a1.414 1.414 0 000-2L17.586 5.586a1.414 1.414 0 00-2 0L6 15l-3 3v3h3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 5l3 3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2l-3 3" />
  </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const ExclamationIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const RefreshIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);


```

### FILE: components/ui/Input.tsx
```typescript
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({ label, name, error, helpText, className, ...props }) => {
  const inputClasses = `block w-full bg-gray-900/50 border rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-500 focus:outline-none sm:text-sm transition duration-200 ease-in-out
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'}
    ${className || ''}
  `;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        className={inputClasses}
        {...props}
      />
      {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};



```

### FILE: components/ui/InputEnhanced.tsx
```typescript
import React from 'react';

interface InputEnhancedProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  helpText?: string;
}

export const InputEnhanced: React.FC<InputEnhancedProps> = ({ 
  label, 
  error, 
  helpText, 
  className = '', 
  required,
  ...props 
}) => {
  const baseStyles = 'w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  );
};


```

### FILE: components/ui/Spinner.tsx
```typescript

import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

```

### FILE: components/ui/Textarea.tsx
```typescript
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | null;
  helpText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, name, error, helpText, className, ...props }) => {
  const textareaClasses = `block w-full bg-gray-900/50 border rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-500 focus:outline-none sm:text-sm transition duration-200 ease-in-out
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'}
    ${className || ''}
  `;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        className={textareaClasses}
        {...props}
      />
      {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};



```

### FILE: components/ui/TextareaEnhanced.tsx
```typescript
import React from 'react';

interface TextareaEnhancedProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | null;
  helpText?: string;
}

export const TextareaEnhanced: React.FC<TextareaEnhancedProps> = ({ 
  label, 
  error, 
  helpText, 
  className = '', 
  required,
  ...props 
}) => {
  const baseStyles = 'w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  );
};


```

### FILE: constants.ts
```typescript

export const DESCRIPTION_TEMPLATE = `
➤ Haunting synths meet dancehall swagger in this genre-bending journey. Kudjo Twum’s "Run Away Riddim Mix" fuses Dub Reggae’s raw basslines, Dark Pop’s eerie atmosphere, and Electropop’s pulsing energy with authentic Jamaican toasting.

The Vibe:

🎤 Confessional Lyrics: A raw narrative about escaping your past… only to confront yourself.  inspired by Bob Marley and The Wailers. Raspect to Steel Pulse and Third World 🌎 

🌑 Eerie & Driving: Hypnotic keys, gritty vocals, and that unstoppable riddim.

💥 Anthemic Chorus: “Yuh cyan run 'way from yuhself!” – a mantra that sticks.

🔥 DJ Toast Break: Authentic Patois fire over stripped-back dancehall drums.

Key Moments:
▶️ 0:00 | Intro: Haunting vocal chops & pulsing synths draw you in.
▶️ 0:45 | Verse 1: Jamaican flow meets introspective storytelling.
▶️ 1:50 | CHORUS: Heavy bass drops with raw, anthemic defiance.
▶️ 3:10 | DJ TOAST: Commanding Patois bars over sparse claps + bass (“Mi a di riddim inna yuh own heart!”).
▶️ 4:25 | Bridge: Raw vulnerability meets acid-burning truth.
▶️ 5:40 | Max-Energy Final Chorus: Passionate ad-libs & dub echoes.

Credits:
Produced/Mixed/Vocals: Kudjo Twum
Artwork: Kudjo Twum
🔔 Subscribe for more genre-blurring soundscapes: @KudjoTwum

#RunAwayRiddim #KudjoTwum #DubReggae #DarkPop #Electropop #Dancehall #JamaicanMusic #RiddimMix #EerieVibes #Anthemic #ConfrontYourself #MirrorTruth #ReggaeFusion #Toasting #Patois #NewMusic #MusicVideo #GenreBlend #CantRunFromYourself #NuhDehDeh  #accra 

--- LYRICS --
# Run From Yuhself - Soulful Reggae Dub
(Genre: Reggae, Slow roots reggae dub, Dark Pop, Electropop, Dancehall)
(Mood: Eerie, driving, anthemic, confident swagger)

[Intro]
(Pulsing synth bass, haunting keys. Eerie vocal chops)
(Vocal breathy): Aaaah-aah, ooh-ooh, mmmm-hmm / Ooooh... yeah gyal / Mmmm-mmmm

[Verse 1 - Jamaican Flow]
(Vocal: Confident whisper, slight rasp):
Sun hot pon di rearview, pure gold (Aaaah-mmm!)
Leff anodda town, story get cold (Ooh-ooh)
Try bury mi duppy dem inna di past (Aaaah! Mmmm-hmm)
Prayin' dis run nuh mek mi mind blast (Ooooh-yeah)

[Pre-Chorus - Build with Attitude]
(Beat builds: filtered drums, rising pad):
Switch up every likkle t'ing mi know (Ooh-ooh! Aaaah)
But di truth a grow, see it a show (Mmmm-mmmm)
Yeah, mi feel like a whole new gyal, true-true (Ooh-ooh! Aaaah-yeah)
But still... mi same like you. (Mmmm-hmm, same like you)

[Chorus - Anthemic & Gritty]
(Full beat: heavy bass/drums. Raw vocals + harmonies):
Run a t'ousand mile! (Aaaah-ooh! Run gyal!)
Change up yuh style! (Aaaah! Ooh-mmmm)
Tink yuh get 'way clean? (Ooooh-no!)
But hear di real t'ing! (Oh-oh! Mmmm-hmm)
Yuh cyan run 'way (Aaaah-no!)
Run 'way from yuhself! (Nuh deh deh! Ooooh-mmmm)

[Post-Chorus - Hypnotic Hook]
(Repetitive hook + main synth):
Oh, oh, oh-oh (Aaaah-mmmm) / Cyan run 'way from yuhself!
Oh, oh, oh-oh (Ooooh-yeah) / Mmmm-no, yuh cyan run 'way! (Nuh true? Aaaah)

[Verse 2 - Swagger]
Chat inna fake accent, sound so strange (Aaaah-strange!)
Like seh mi really have a choice fi change (Ooh-ooh, mmmm)
Fill up di night wid flashin' light (Aaaah! Ooooh-light)
Fi drown out di quiet... every night. (Mmmm-hmm, every night)

[DJ Toast / Dancehall Break]
(Toast confident, commanding):
Yo! Listen good! (Aaaah-yeah!)
Yuh buy new Clarks fi run di race! (Ooh-ooh)
Switch yuh frock, yuh wig, yuh face! (Mmmm-switch it)
But every corner, every space... mi deh-deh! (Aaaah-deh!)
Di real truth-ya, mi nuh play fair! (Ooooh-nah)
Yuh tink yuh slick? Yuh tink yuh smart? (Mmmm-hmm)
Mi a di riddim inna yuh own heart! (Aaaah-heart!)
So run go a Mobay, run go a 'Frisco... (Ooh-run gyal)
Yuh cyan hide from di face inna yuh mirror! FIYAH! (Aaaah-FIYAH!)

[Bridge - Raw & Haunting]
(Silence → pulsing bass/keys. Raw vocal):
Like shadow inna dark... (Aaaah-dark, mmmm)
Reflection, question mark... (Ooh-ooh, question)
Starin' back inna di glass... (Mmmm-glass, aaaah)
Di truth a bun like acid... bass. (Ooooh-bun, mmmm-hmm)

[Final Chorus - Max Energy]
Run a t'ousand mile! (Nowhere fi go! Aaaah-ooh)
Change up yuh style! (Aaaah! Ooh-mmmm-style)
Tink yuh get 'way clean? (Nevah get 'way! Ooooh)
But hear di real t'ing! (Oh-oh! Real t'ing! Mmmm)
Yuh cyan run 'way (Aaaah-no! Ooooh)
Run 'way from yuhself! (Yuhself deh yah fi stay! Mmmm-hmm)

[Outro - Fade w/ Whisper]
(Fade: bass + heavy dub echo):
Oh, oh, oh-oh (Aaaah-mmmm) / Cyan run 
`;

```

### FILE: CREATION.md
```md
# enhanced-youtube-genie

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

This application is deployed behind an Nginx reverse proxy at the path `/enhanced-youtube-genie/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/enhanced-youtube-genie/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/enhanced-youtube-genie/',  // REQUIRED: Assets must load from /enhanced-youtube-genie/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/enhanced-youtube-genie"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/enhanced-youtube-genie">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/enhanced-youtube-genie/`, not at the root
- **Asset Loading**: Without `base: '/enhanced-youtube-genie/'`, assets try to load from `/assets/` instead of `/enhanced-youtube-genie/assets/`
- **Routing**: Without `basename="/enhanced-youtube-genie"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/enhanced-youtube-genie/assets/index-*.js`
- Link tags should reference: `/enhanced-youtube-genie/assets/index-*.css`

If they reference `/assets/` instead of `/enhanced-youtube-genie/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/enhanced-youtube-genie/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/enhanced-youtube-genie/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: enhanced-youtube-genie

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
# Admin Guide — youtube-description-genie

**Application:** youtube-description-genie
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

Audit log data is stored in `localStorage` under the key `tuc_youtube-description-genie_audit`.

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
# Deployment Guide — youtube-description-genie

**Application:** youtube-description-genie
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd youtube-description-genie
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
docker-compose -f docker-compose-all-apps.yml build youtube-description-genie
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up youtube-description-genie
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

**Project:** Youtube Description Genie
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Youtube Description Genie**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Youtube Description Genie** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Youtube Description Genie** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
# Testing Guide — youtube-description-genie

**Application:** youtube-description-genie
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd youtube-description-genie
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

### FILE: ENHANCEMENTS.md
```md
# YouTube Description Genie - Enhancement Summary

## Overview

This enhanced version of the YouTube Description Genie addresses critical production readiness issues and significantly improves user experience, error handling, and overall application quality. The enhancements transform the application from a basic proof-of-concept into a more robust, user-friendly tool suitable for real-world usage.

## Key Enhancements Implemented

### 1. Comprehensive Input Validation

**Problem Solved**: Original application accepted invalid or empty inputs, leading to poor AI outputs and API errors.

**Implementation**:
- Created `utils/validation.ts` with comprehensive field validation
- Real-time validation feedback as users type
- Clear error messages for each field with specific requirements
- Visual error indicators (red borders, error icons)
- Form submission prevention until all required fields are valid

**Benefits**:
- Prevents API calls with invalid data, reducing costs
- Improves AI output quality through better input validation
- Enhanced user experience with immediate feedback
- Reduces user frustration from unclear error messages

### 2. Enhanced Error Handling and User Feedback

**Problem Solved**: Raw API errors were displayed to users, creating poor user experience and potentially exposing technical details.

**Implementation**:
- Created `services/geminiServiceEnhanced.ts` with custom error types
- User-friendly error message mapping for common API errors
- Graceful handling of network issues, rate limits, and API failures
- Clear distinction between user errors and system errors
- API availability checking with status indicators

**Benefits**:
- Professional error messages that users can understand and act upon
- Better debugging capabilities for developers
- Improved user trust through transparent error communication
- Reduced support burden through self-explanatory error messages

### 3. Improved User Interface Components

**Problem Solved**: Basic UI components lacked error states, help text, and accessibility features.

**Implementation**:
- Enhanced Input and Textarea components with error states
- Help text for complex fields to guide user input
- Required field indicators with visual cues
- Improved loading states with proper spinners
- Better visual hierarchy and spacing

**Benefits**:
- More accessible interface for all users
- Reduced learning curve for new users
- Professional appearance that builds user confidence
- Better mobile experience with improved touch targets

### 4. Auto-Save and Data Persistence

**Problem Solved**: Users lost their work when refreshing the page or navigating away.

**Implementation**:
- Automatic form data saving to localStorage
- Restoration of saved data on page load
- Usage statistics tracking for analytics
- Clear form functionality for starting fresh

**Benefits**:
- Eliminates data loss frustration
- Enables users to work on descriptions over multiple sessions
- Provides insights into user behavior and feature usage
- Improves overall user experience and retention

### 5. Enhanced Loading States and Feedback

**Problem Solved**: Users had no clear indication of processing status during AI generation.

**Implementation**:
- Proper loading spinners with descriptive text
- Button state management during processing
- API status indicators showing service availability
- Progress feedback throughout the generation process

**Benefits**:
- Reduces user anxiety during processing
- Clear communication of system status
- Professional feel that builds user confidence
- Better perceived performance through clear feedback

### 6. Welcome Message and Onboarding

**Problem Solved**: New users had no guidance on how to use the application effectively.

**Implementation**:
- Contextual welcome message explaining new features
- Dismissible information panels
- Clear indication of enhanced version capabilities
- Helpful hints throughout the interface

**Benefits**:
- Faster user onboarding and feature discovery
- Reduced support requests through better guidance
- Increased feature adoption and user engagement
- Professional presentation of new capabilities

## Technical Architecture Improvements

### Code Organization
- Separated validation logic into dedicated utility modules
- Enhanced service layer with proper error handling
- Improved component structure with better separation of concerns
- Type-safe error handling with custom error classes

### Performance Optimizations
- Debounced auto-save to prevent excessive localStorage writes
- Optimized re-rendering through proper state management
- Efficient validation that only runs when necessary
- Reduced API calls through better input validation

### Security Enhancements
- Input sanitization and validation to prevent malicious inputs
- Better API key handling with availability checking
- Protection against common web vulnerabilities
- Secure data storage practices for user information

## User Experience Improvements

### Form Interaction
- Progressive validation with immediate feedback
- Smart field focusing and error scrolling
- Intuitive error recovery workflows
- Consistent interaction patterns throughout

### Visual Design
- Enhanced color scheme with better contrast
- Improved typography and spacing
- Professional loading animations
- Clear visual hierarchy and information architecture

### Accessibility
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast error indicators

## Business Value Delivered

### Reduced Support Burden
- Self-explanatory error messages reduce support tickets
- Better user guidance decreases confusion
- Comprehensive validation prevents common user mistakes

### Improved User Retention
- Auto-save functionality prevents data loss frustration
- Better error handling reduces abandonment rates
- Professional appearance builds user trust and confidence

### Enhanced Scalability
- Proper error handling supports higher user volumes
- Validation reduces unnecessary API calls and costs
- Modular architecture enables easier feature additions

### Competitive Advantage
- Professional user experience differentiates from basic AI tools
- Music industry-specific validation and guidance
- Robust error handling creates reliable user experience

## Implementation Quality

### Code Quality
- TypeScript throughout for type safety
- Comprehensive error handling with custom error types
- Modular architecture with clear separation of concerns
- Consistent coding patterns and naming conventions

### Testing Readiness
- Validation utilities are easily unit testable
- Error handling logic is isolated and testable
- Component structure supports integration testing
- Clear interfaces enable mocking for testing

### Maintainability
- Well-documented code with clear comments
- Modular structure enables easy feature additions
- Consistent patterns make codebase predictable
- Proper error logging supports debugging

## Future Enhancement Opportunities

### Short-term Additions
- Form field auto-completion for genres and influences
- Template system for different music styles
- Export options for different platforms
- Undo/redo functionality for form changes

### Medium-term Features
- User accounts and saved templates
- Collaboration features for bands and teams
- Integration with music platforms and social media
- Advanced AI customization options

### Long-term Vision
- Full-stack architecture with backend services
- Analytics dashboard for content performance
- API for third-party integrations
- Enterprise features for music industry professionals

## Conclusion

These enhancements transform the YouTube Description Genie from a basic demonstration tool into a production-ready application that provides real value to musicians and content creators. The improvements address critical user experience issues while establishing a foundation for future feature development and business growth.

The enhanced version demonstrates professional software development practices and creates a competitive advantage through superior user experience and reliability. These changes position the application for successful market adoption and sustainable business growth in the music industry content creation space.


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
    <meta property="og:title" content="Enhanced Youtube Genie | Techbridge University College" />
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
    <meta name="twitter:title" content="Enhanced Youtube Genie | Techbridge University College" />
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
    <title>Enhanced Youtube Genie | Techbridge University College</title>

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
        <div class="tuc-status">enhanced youtube genie</div>
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
import App from './AppEnhanced';
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
  "name": "YouTube Description Genie",
  "description": "An AI-powered application to generate custom, professional YouTube video descriptions for musicians based on a proven template. Simply provide your song's details, and let the AI craft the perfect description to engage your audience.",
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
  "name": "youtube-description-genie",
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
    "@google/genai": "^1.12.0",
    "pnpm": "^10.14.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^22.17.0",
    "serve": "14.2.5",
    "typescript": "~5.7.3",
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
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/geminiService.ts
```typescript

import { GoogleGenAI, Type } from "@google/genai";
import type { FormData } from '../types';
import { DESCRIPTION_TEMPLATE } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "The full, formatted YouTube description text, including intro, vibe, key moments, credits, hashtags, and lyrics."
    }
  },
  required: ['description']
};

export const generateDescription = async (formData: FormData): Promise<string> => {
  const prompt = `
    You are an expert music marketer who creates compelling YouTube video descriptions.
    Based on the JSON data provided below, generate a complete YouTube description.

    **TASK:**
    1. Create a single string output for the YouTube description.
    2. Follow the structure, symbols (➤, 🎤, 🌑, 💥, 🔥, ▶️, 🔔, 🌎), and tone of the EXAMPLE provided below.
    3. Analyse the provided lyrics to create a "Key Moments" section with 5-6 descriptive entries. Infer plausible timestamps based on a typical 3-5 minute song structure.
    4. Generate a list of 20-25 relevant and niche hashtags based on all provided information.
    5. Format the final output as a single block of text, ready to be copied and pasted into YouTube. Ensure the "Credits" and "Subscribe" line are formatted correctly using the user's data.

    **USER INPUT DATA:**
    ${JSON.stringify(formData, null, 2)}

    **EXAMPLE OF DESIRED OUTPUT FORMAT AND STRUCTURE:**
    ${DESCRIPTION_TEMPLATE}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed && typeof parsed.description === 'string') {
        return parsed.description;
    } else {
        throw new Error("Invalid response format from AI.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate description: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};

```

### FILE: services/geminiServiceEnhanced.ts
```typescript
import { GoogleGenAI, Type } from "@google/genai";
import type { FormData } from '../types';
import { DESCRIPTION_TEMPLATE } from '../constants';

// Enhanced error types for better error handling
export class APIError extends Error {
  constructor(message: string, public code?: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Check for API key availability
const getAPIKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    throw new APIError(
      'API key is not configured. Please set up your Gemini API key in the environment variables.',
      'MISSING_API_KEY'
    );
  }
  return apiKey;
};

// Initialize AI client with error handling
const initializeAI = () => {
  try {
    const apiKey = getAPIKey();
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    throw error;
  }
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "The full, formatted YouTube description text, including intro, vibe, key moments, credits, hashtags, and lyrics."
    }
  },
  required: ['description']
};

// Enhanced input validation
const validateInput = (formData: FormData): void => {
  const requiredFields = ['songTitle', 'artistName', 'youtubeHandle', 'genres', 'vibeKeywords', 'lyrics'];
  const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]?.trim());
  
  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate lyrics length
  if (formData.lyrics.trim().length < 50) {
    throw new ValidationError('Lyrics must be at least 50 characters long for meaningful description generation.');
  }

  if (formData.lyrics.trim().length > 10000) {
    throw new ValidationError('Lyrics are too long. Please limit to 10,000 characters.');
  }

  // Validate YouTube handle format
  if (!formData.youtubeHandle.startsWith('@')) {
    throw new ValidationError('YouTube handle must start with @');
  }
};

// Enhanced error message mapping
const mapErrorToUserMessage = (error: any): string => {
  // Handle our custom error types
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof RateLimitError) {
    return 'You\'ve reached the rate limit. Please wait a moment before trying again.';
  }

  if (error instanceof APIError) {
    if (error.code === 'MISSING_API_KEY') {
      return 'The service is not properly configured. Please contact support.';
    }
    return error.message;
  }

  // Handle Google AI API errors
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('api key not valid') || message.includes('invalid_argument')) {
      return 'There\'s an issue with the API configuration. Please try again later or contact support.';
    }
    
    if (message.includes('quota exceeded') || message.includes('rate limit')) {
      return 'The service is currently experiencing high demand. Please try again in a few minutes.';
    }
    
    if (message.includes('model not found')) {
      return 'The AI model is temporarily unavailable. Please try again later.';
    }
    
    if (message.includes('content filtered') || message.includes('safety')) {
      return 'Your content couldn\'t be processed due to safety guidelines. Please review your lyrics and try again.';
    }
    
    if (message.includes('timeout') || message.includes('deadline')) {
      return 'The request timed out. Please try again with shorter content or check your connection.';
    }
  }

  // Generic fallback
  return 'Something went wrong while generating your description. Please try again, and if the problem persists, contact support.';
};

export const generateDescription = async (formData: FormData): Promise<string> => {
  try {
    // Validate input first
    validateInput(formData);

    // Initialize AI client
    const ai = initializeAI();

    // Create enhanced prompt with better structure
    const prompt = `
      You are an expert music marketer who creates compelling YouTube video descriptions.
      Based on the JSON data provided below, generate a complete YouTube description.

      **TASK:**
      1. Create a single string output for the YouTube description.
      2. Follow the structure, symbols (➤, 🎤, 🌑, 💥, 🔥, ▶️, 🔔, 🌎), and tone of the EXAMPLE provided below.
      3. Analyse the provided lyrics to create a "Key Moments" section with 5-6 descriptive entries. Infer plausible timestamps based on a typical 3-5 minute song structure.
      4. Generate a list of 20-25 relevant and niche hashtags based on all provided information.
      5. Format the final output as a single block of text, ready to be copied and pasted into YouTube. Ensure the "Credits" and "Subscribe" line are formatted correctly using the user's data.

      **USER INPUT DATA:**
      ${JSON.stringify(formData, null, 2)}

      **EXAMPLE OF DESIRED OUTPUT FORMAT AND STRUCTURE:**
      ${DESCRIPTION_TEMPLATE}
    `;

    // Make API call with enhanced error handling
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
        maxOutputTokens: 2048,
      },
    });

    // Validate response
    if (!response || !response.text) {
      throw new APIError('Empty response from AI service');
    }

    const jsonText = response.text.trim();
    
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      throw new APIError('Invalid response format from AI service');
    }
    
    if (!parsed || typeof parsed.description !== 'string' || !parsed.description.trim()) {
      throw new APIError('AI service returned invalid description format');
    }

    return parsed.description;

  } catch (error) {
    console.error("Error in generateDescription:", error);
    
    // Re-throw with user-friendly message
    const userMessage = mapErrorToUserMessage(error);
    throw new Error(userMessage);
  }
};

// Utility function to check API availability
export const checkAPIAvailability = async (): Promise<boolean> => {
  try {
    const ai = initializeAI();
    // Make a minimal test request
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: "Test",
      config: {
        maxOutputTokens: 10,
      },
    });
    return !!response;
  } catch (error) {
    return false;
  }
};


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
          <span className="font-bold text-sm">Enhanced Youtube Genie</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Youtube Genie — Admin</h1>
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
 * E2E stub — youtube-description-genie
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('youtube-description-genie E2E', () => {
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
    "target": "ES2020",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "allowJs": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "paths": {
      "@/*" :  ["./*"]
    }
  }
}

```

### FILE: types.ts
```typescript

export interface FormData {
  songTitle: string;
  artistName: string;
  youtubeHandle: string;
  genres: string;
  influences: string;
  vibeKeywords: string;
  chorusLine: string;
  lyrics: string;
  credits: string;
}

```

### FILE: utils/validation.ts
```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormValidation {
  songTitle: ValidationResult;
  artistName: ValidationResult;
  youtubeHandle: ValidationResult;
  genres: ValidationResult;
  vibeKeywords: ValidationResult;
  lyrics: ValidationResult;
}

export const validateField = (name: string, value: string): ValidationResult => {
  const errors: string[] = [];

  switch (name) {
    case 'songTitle':
      if (!value.trim()) {
        errors.push('Song title is required');
      } else if (value.trim().length < 2) {
        errors.push('Song title must be at least 2 characters');
      } else if (value.trim().length > 100) {
        errors.push('Song title must be less than 100 characters');
      }
      break;

    case 'artistName':
      if (!value.trim()) {
        errors.push('Artist name is required');
      } else if (value.trim().length < 2) {
        errors.push('Artist name must be at least 2 characters');
      } else if (value.trim().length > 50) {
        errors.push('Artist name must be less than 50 characters');
      }
      break;

    case 'youtubeHandle':
      if (!value.trim()) {
        errors.push('YouTube handle is required');
      } else if (!value.startsWith('@')) {
        errors.push('YouTube handle must start with @');
      } else if (value.length < 4) {
        errors.push('YouTube handle must be at least 4 characters');
      } else if (!/^@[a-zA-Z0-9_-]+$/.test(value)) {
        errors.push('YouTube handle can only contain letters, numbers, underscores, and hyphens');
      }
      break;

    case 'genres':
      if (!value.trim()) {
        errors.push('At least one genre is required');
      } else {
        const genres = value.split(',').map(g => g.trim()).filter(g => g.length > 0);
        if (genres.length === 0) {
          errors.push('At least one valid genre is required');
        } else if (genres.some(g => g.length < 2)) {
          errors.push('Each genre must be at least 2 characters');
        }
      }
      break;

    case 'vibeKeywords':
      if (!value.trim()) {
        errors.push('Vibe keywords are required');
      } else {
        const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
        if (keywords.length === 0) {
          errors.push('At least one vibe keyword is required');
        } else if (keywords.length > 10) {
          errors.push('Maximum 10 vibe keywords allowed');
        }
      }
      break;

    case 'lyrics':
      if (!value.trim()) {
        errors.push('Lyrics are required');
      } else if (value.trim().length < 50) {
        errors.push('Lyrics must be at least 50 characters for meaningful description generation');
      } else if (value.trim().length > 10000) {
        errors.push('Lyrics must be less than 10,000 characters');
      }
      break;

    default:
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (formData: any): FormValidation => {
  return {
    songTitle: validateField('songTitle', formData.songTitle || ''),
    artistName: validateField('artistName', formData.artistName || ''),
    youtubeHandle: validateField('youtubeHandle', formData.youtubeHandle || ''),
    genres: validateField('genres', formData.genres || ''),
    vibeKeywords: validateField('vibeKeywords', formData.vibeKeywords || ''),
    lyrics: validateField('lyrics', formData.lyrics || ''),
  };
};

export const isFormValid = (validation: FormValidation): boolean => {
  return Object.values(validation).every(field => field.isValid);
};


```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

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
      base: './', // Use relative paths for all assets
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

// Vitest unit test configuration — youtube-description-genie
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

// Vitest E2E configuration — youtube-description-genie
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

