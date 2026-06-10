
import React, { useEffect, useRef } from 'react';
// Fix: Import types from App.tsx where they are now defined.
import { ScheduledPost, PostPriority } from '../types';
import { PLATFORM_DETAILS } from '../constants';

interface PostDetailModalProps {
  post: ScheduledPost;
  onClose: () => void;
  onDelete: (postId: string) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onDelete }) => {
  const platformDetail = PLATFORM_DETAILS.find(p => p.id === post.platform);
  const placeholderImageUrl = `https://picsum.photos/seed/${encodeURIComponent(post.imagePrompt)}/800/450`;
  const imageUrl = post.generatedImageUrl || placeholderImageUrl;
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on 'Escape' key press and implement focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab') {
        if (event.shiftKey) { // Shift+Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    firstElement?.focus(); // Focus the first element on open
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this scheduled post? This action cannot be undone.')) {
      onDelete(post.id);
      onClose();
    }
  };

  const scheduledDateTime = new Date(post.scheduledAt);
  const formattedDate = scheduledDateTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = scheduledDateTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getPriorityBadge = (priority: PostPriority) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
    switch (priority) {
      case PostPriority.HIGH: return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300`}>High Priority</span>;
      case PostPriority.MEDIUM: return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300`}>Medium Priority</span>;
      case PostPriority.LOW: return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300`}>Low Priority</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300`}>Unknown</span>;
    }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-secondary rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-default" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-detail-modal-title"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center">
              {platformDetail && <platformDetail.icon className="h-8 w-8 text-accent-primary" />}
              <h2 id="post-detail-modal-title" className="text-2xl font-bold text-primary ml-3">{post.platform} Post Details</h2>
            </div>
            <div className="flex items-center gap-x-4 mt-2">
              <p className="text-secondary mt-1">Scheduled for {formattedDate} at {formattedTime}</p>
              {getPriorityBadge(post.priority)}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-secondary hover:bg-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-6 mt-6">
          {post.platform === 'Email' && post.variants && post.variants.length > 0 && (
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Suggested Subject Lines (A/B Test)</h4>
              <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {post.variants.map((variant, i) => <li key={i}>{variant}</li>)}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-primary mb-2">Content</h3>
            <div className="bg-primary p-4 rounded-lg border border-default">
              <p className="text-secondary whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-primary mb-2">Image</h3>
            <div className="aspect-w-16 aspect-h-9">
              <img src={imageUrl} alt={post.imagePrompt} className="rounded-lg object-cover w-full h-full" />
            </div>
            <p className="text-xs text-secondary mt-2 italic text-center">
              Prompt: "{post.imagePrompt}"
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-default">
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2 rounded-lg text-red-700 bg-red-100 hover:bg-red-200 font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
          >
            Delete
          </button>
          <button 
            type="button"
            disabled 
            className="px-6 py-2 rounded-lg text-secondary bg-border-default font-bold transition cursor-not-allowed"
            title="Editing functionality coming soon!"
          >
            Edit
          </button>
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-accent-primary text-white font-bold hover:bg-accent-primary/90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
