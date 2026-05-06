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

