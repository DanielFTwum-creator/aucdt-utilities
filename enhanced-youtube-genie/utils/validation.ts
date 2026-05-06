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

