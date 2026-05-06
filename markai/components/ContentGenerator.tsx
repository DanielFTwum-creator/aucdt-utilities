
import React, { useState, useReducer, useCallback } from 'react';
import { generateMarketingContent, generateImage } from '../services/geminiService';
import { GeneratedContent, Platform, ScheduledPost, PostStatus, FeatureFlag, PostPriority } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import GeneratedContentCard from './GeneratedContentCard';
import Spinner from './Spinner';
import ScheduleModal from './ScheduleModal';
import PreviewModal from './PreviewModal';
import { usePosts } from '../contexts/PostsContext';
import { useAdmin } from '../contexts/AdminContext';
import { useFeatureFlags } from '../contexts/FeatureFlagsContext';


// --- STATE MANAGEMENT --- //

type ContentWithStatus = GeneratedContent & { 
  isGeneratingImage?: boolean; 
  generationError?: string | null;
};

interface State {
  prompt: string;
  brandVoice: string;
  selectedPlatforms: Set<Platform>;
  generatedContent: ContentWithStatus[];
  isLoading: boolean;
  error: string | null;
  emailVariantCount: number;
  schedulingPost: (ContentWithStatus & { originalIndex: number }) | null;
  previewingPost: ContentWithStatus | null;
}

type Action =
  | { type: 'SET_FIELD'; field: 'prompt' | 'brandVoice'; payload: string }
  | { type: 'TOGGLE_PLATFORM'; payload: Platform }
  | { type: 'SET_EMAIL_VARIANT_COUNT'; payload: number }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: GeneratedContent[] }
  | { type: 'SUBMIT_FAILURE'; payload: string }
  | { type: 'OPEN_SCHEDULE_MODAL'; payload: { content: ContentWithStatus; index: number } }
  | { type: 'CLOSE_SCHEDULE_MODAL' }
  | { type: 'OPEN_PREVIEW_MODAL'; payload: { content: ContentWithStatus } }
  | { type: 'CLOSE_PREVIEW_MODAL' }
  | { type: 'CONFIRM_SCHEDULE'; payload: number }
  | { type: 'GENERATE_IMAGE_START'; payload: { index: number } }
  | { type: 'GENERATE_IMAGE_SUCCESS'; payload: { index: number; imageUrl: string } }
  | { type: 'GENERATE_IMAGE_FAILURE'; payload: { index: number; error: string } };

const initialState: State = {
  prompt: 'Announce our new seasonal coffee flavor: Pumpkin Spice Delight.',
  brandVoice: 'Friendly, warm, and slightly humorous.',
  selectedPlatforms: new Set([Platform.Instagram, Platform.Email]),
  generatedContent: [],
  isLoading: false,
  error: null,
  emailVariantCount: 3,
  schedulingPost: null,
  previewingPost: null,
};

const contentGeneratorReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'TOGGLE_PLATFORM':
      const newPlatforms = new Set(state.selectedPlatforms);
      if (newPlatforms.has(action.payload)) {
        newPlatforms.delete(action.payload);
      } else {
        newPlatforms.add(action.payload);
      }
      return { ...state, selectedPlatforms: newPlatforms };
    case 'SET_EMAIL_VARIANT_COUNT':
      const count = Math.max(1, Math.min(5, action.payload));
      return { ...state, emailVariantCount: count };
    case 'SUBMIT_START':
      return { ...state, isLoading: true, error: null, generatedContent: [] };
    case 'SUBMIT_SUCCESS':
      return { ...state, isLoading: false, generatedContent: action.payload };
    case 'SUBMIT_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'OPEN_SCHEDULE_MODAL':
      return { ...state, schedulingPost: { ...action.payload.content, originalIndex: action.payload.index } };
    case 'CLOSE_SCHEDULE_MODAL':
      return { ...state, schedulingPost: null };
    case 'OPEN_PREVIEW_MODAL':
      return { ...state, previewingPost: action.payload.content };
    case 'CLOSE_PREVIEW_MODAL':
      return { ...state, previewingPost: null };
    case 'CONFIRM_SCHEDULE':
      return {
        ...state,
        generatedContent: state.generatedContent.filter((_, i) => i !== action.payload),
        schedulingPost: null,
      };
    case 'GENERATE_IMAGE_START': {
      const newContent = [...state.generatedContent];
      newContent[action.payload.index] = { ...newContent[action.payload.index], isGeneratingImage: true, generationError: null };
      return { ...state, generatedContent: newContent };
    }
    case 'GENERATE_IMAGE_SUCCESS': {
      const newContent = [...state.generatedContent];
      newContent[action.payload.index] = { ...newContent[action.payload.index], isGeneratingImage: false, generatedImageUrl: action.payload.imageUrl };
      return { ...state, generatedContent: newContent };
    }
    case 'GENERATE_IMAGE_FAILURE': {
      const newContent = [...state.generatedContent];
      newContent[action.payload.index] = { ...newContent[action.payload.index], isGeneratingImage: false, generationError: action.payload.error };
      return { ...state, generatedContent: newContent };
    }
    default:
      return state;
  }
};


// --- COMPONENT --- //

const ContentGenerator: React.FC = () => {
  const { addPost } = usePosts();
  const { geminiModel } = useAdmin();
  const { featureFlags } = useFeatureFlags();

  const [state, dispatch] = useReducer(contentGeneratorReducer, initialState);
  const { prompt, brandVoice, selectedPlatforms, generatedContent, isLoading, error, schedulingPost, emailVariantCount, previewingPost } = state;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === '' || brandVoice.trim() === '' || selectedPlatforms.size === 0) {
      dispatch({ type: 'SUBMIT_FAILURE', payload: 'Please fill in all fields and select at least one platform.' });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });
    try {
      const platformsArray: Platform[] = Array.from(selectedPlatforms);
      const result = await generateMarketingContent(prompt, brandVoice, platformsArray, geminiModel, emailVariantCount);
      dispatch({ type: 'SUBMIT_SUCCESS', payload: result });
    } catch (err) {
      dispatch({ type: 'SUBMIT_FAILURE', payload: err instanceof Error ? err.message : 'An unknown error occurred.' });
    }
  }, [prompt, brandVoice, selectedPlatforms, geminiModel, emailVariantCount]);

  const handleGenerateImage = useCallback(async (prompt: string, index: number) => {
    dispatch({ type: 'GENERATE_IMAGE_START', payload: { index } });
    try {
      const imageUrl = await generateImage(prompt);
      dispatch({ type: 'GENERATE_IMAGE_SUCCESS', payload: { index, imageUrl } });
    } catch (err) {
      dispatch({ type: 'GENERATE_IMAGE_FAILURE', payload: { index, error: err instanceof Error ? err.message : 'Failed to generate image.' } });
    }
  }, []);

  const handleConfirmSchedule = (scheduledAt: Date, priority: PostPriority) => {
    if (!schedulingPost) return;
    const { isGeneratingImage, generationError, originalIndex, ...contentToSchedule } = schedulingPost;
    const newScheduledPost: ScheduledPost = {
      ...contentToSchedule,
      id: `${new Date().getTime()}-${Math.random()}`,
      scheduledAt: scheduledAt.toISOString(),
      status: PostStatus.SCHEDULED,
      priority,
    };
    addPost(newScheduledPost);
    dispatch({ type: 'CONFIRM_SCHEDULE', payload: schedulingPost.originalIndex });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4">
          <div className="bg-secondary p-6 rounded-2xl shadow-lg sticky top-24">
            <h2 className="text-2xl font-bold text-primary mb-4">Create Content</h2>
            <p className="text-secondary mb-6">Describe your goal and let MarkAI do the rest.</p>
            <GeneratorForm
              prompt={prompt}
              brandVoice={brandVoice}
              selectedPlatforms={selectedPlatforms}
              emailVariantCount={emailVariantCount}
              isLoading={isLoading}
              dispatch={dispatch}
              onSubmit={handleSubmit}
            />
          </div>
        </aside>
        
        <section className="lg:col-span-8" aria-live="polite">
          <ResultsView
            isLoading={isLoading}
            error={error}
            generatedContent={generatedContent}
            featureFlags={featureFlags}
            dispatch={dispatch}
            onGenerateImage={handleGenerateImage}
          />
        </section>
      </div>

      {schedulingPost && (
        <ScheduleModal
          post={schedulingPost}
          onClose={() => dispatch({ type: 'CLOSE_SCHEDULE_MODAL' })}
          onSchedule={handleConfirmSchedule}
        />
      )}
      
      {previewingPost && (
        <PreviewModal
          post={previewingPost}
          onClose={() => dispatch({ type: 'CLOSE_PREVIEW_MODAL' })}
        />
      )}
    </>
  );
};

// --- SUB-COMPONENTS --- //

interface GeneratorFormProps {
  prompt: string;
  brandVoice: string;
  selectedPlatforms: Set<Platform>;
  emailVariantCount: number;
  isLoading: boolean;
  dispatch: React.Dispatch<Action>;
  onSubmit: (e: React.FormEvent) => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = React.memo(({ prompt, brandVoice, selectedPlatforms, emailVariantCount, isLoading, dispatch, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-6" aria-busy={isLoading}>
    <div>
      <label htmlFor="prompt" className="block text-sm font-semibold text-primary mb-2">
        What do you want to promote?
      </label>
      <textarea
        id="prompt"
        rows={3}
        value={prompt}
        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'prompt', payload: e.target.value })}
        className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition duration-200"
        placeholder="e.g., Announce a 20% sale on all products"
        required
      />
    </div>

    <div>
      <label htmlFor="brand-voice" className="block text-sm font-semibold text-primary mb-2">
        What's your Brand Voice?
      </label>
      <textarea
        id="brand-voice"
        rows={2}
        value={brandVoice}
        onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'brandVoice', payload: e.target.value })}
        className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition duration-200"
        placeholder="e.g., Professional and authoritative"
        required
      />
    </div>
    
    <fieldset>
      <legend className="block text-sm font-semibold text-primary mb-3">Select Platforms</legend>
      <div className="space-y-3">
        {PLATFORM_DETAILS.map((p) => {
          const isSelected = selectedPlatforms.has(p.id);
          return (
            <div key={p.id} onClick={() => dispatch({ type: 'TOGGLE_PLATFORM', payload: p.id })}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); dispatch({ type: 'TOGGLE_PLATFORM', payload: p.id }); } }}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-accent-primary/10 border-accent-primary ring-2 ring-accent-primary' : 'bg-primary border-default hover:border-gray-400'}`}>
              <p.icon className={`h-6 w-6 mr-3 ${isSelected ? 'text-accent-primary' : 'text-secondary'}`} />
              <div>
                <p className="font-semibold text-primary">{p.name}</p>
                <p className="text-xs text-secondary">{p.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </fieldset>
    
    {selectedPlatforms.has(Platform.Email) && (
      <div className="transition-all duration-300 ease-in-out transform opacity-100">
        <label htmlFor="email-variants" className="block text-sm font-semibold text-primary mb-2">
          Number of Email Subject Lines (1-5)
        </label>
        <input
          type="number"
          id="email-variants"
          value={emailVariantCount}
          onChange={(e) => dispatch({ type: 'SET_EMAIL_VARIANT_COUNT', payload: parseInt(e.target.value, 10) || 1 })}
          min="1"
          max="5"
          className="w-full p-3 bg-primary text-primary border border-default rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition duration-200"
          required
        />
      </div>
    )}

    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-accent-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-accent-primary/90 focus:outline-none focus:ring-4 focus:ring-accent-primary/50 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <Spinner /> Generating...
        </span>
      ) : (
        'Generate Content'
      )}
    </button>
  </form>
));

interface ResultsViewProps {
  isLoading: boolean;
  error: string | null;
  generatedContent: ContentWithStatus[];
  featureFlags: Record<FeatureFlag, boolean>;
  dispatch: React.Dispatch<Action>;
  onGenerateImage: (prompt: string, index: number) => void;
}

const ResultsView: React.FC<ResultsViewProps> = React.memo(({ isLoading, error, generatedContent, featureFlags, dispatch, onGenerateImage }) => {
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6" role="alert">
        <p className="font-bold">An Error Occurred</p>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading && !generatedContent.length) {
    return (
      <div className="text-center p-10 bg-secondary rounded-2xl shadow-lg">
        <Spinner className="w-12 h-12 mx-auto text-accent-primary" />
        <p className="mt-4 text-lg font-semibold text-secondary">MarkAI is thinking...</p>
        <p className="text-secondary">Crafting the perfect message for you.</p>
      </div>
    );
  }

  if (!isLoading && !generatedContent.length) {
    return (
      <div className="text-center p-10 bg-secondary rounded-2xl shadow-lg flex flex-col items-center justify-center h-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-xl font-bold text-primary">Your Generated Content Will Appear Here</h3>
        <p className="mt-1 text-secondary">Fill out the form on the left to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {generatedContent.map((content, index) => (
        <GeneratedContentCard 
          key={`${index}-${content.platform}`} 
          content={content}
          index={index}
          onSchedule={() => dispatch({ type: 'OPEN_SCHEDULE_MODAL', payload: { content, index } })}
          onPreview={() => dispatch({ type: 'OPEN_PREVIEW_MODAL', payload: { content } })}
          onGenerateImage={onGenerateImage}
          isSchedulingEnabled={featureFlags[FeatureFlag.CAMPAIGN_SCHEDULING]}
          isImageGenerationEnabled={featureFlags[FeatureFlag.IMAGE_EDITING]}
        />
      ))}
    </div>
  );
});

export default ContentGenerator;