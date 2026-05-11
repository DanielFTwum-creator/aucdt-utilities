
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
