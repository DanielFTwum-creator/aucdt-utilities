
import React, { useEffect, useRef } from 'react';
import { GeneratedContent, Platform } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { X, Heart, MessageCircle, Repeat, Send, ThumbsUp } from 'lucide-react';

interface PreviewModalProps {
  post: GeneratedContent;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ post, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const platformDetail = PLATFORM_DETAILS.find(p => p.id === post.platform);
  const placeholderImageUrl = `https://picsum.photos/seed/${encodeURIComponent(post.imagePrompt)}/800/600`;
  const imageUrl = post.generatedImageUrl || placeholderImageUrl;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    const modal = modalRef.current;
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();

    const handleTabKeyPress = (event: KeyboardEvent) => {
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
    
    modal.addEventListener('keydown', handleTabKeyPress);
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        modal.removeEventListener('keydown', handleTabKeyPress);
    };
  }, [onClose]);

  const renderPreview = () => {
    const mockUser = { name: "Your Brand", handle: "@yourbrand", avatar: "https://i.pravatar.cc/150?u=yourbrand" };
    
    switch(post.platform) {
      case Platform.Instagram:
        return (
          <div className="w-full max-w-sm bg-primary border border-default rounded-lg overflow-hidden">
            <div className="flex items-center p-3">
              <img src={mockUser.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              <span className="ml-3 font-semibold text-sm text-primary">{mockUser.handle}</span>
            </div>
            <img src={imageUrl} alt={post.imagePrompt} className="w-full object-cover" />
            <div className="p-3">
              <div className="flex space-x-4 mb-2">
                <Heart className="h-6 w-6 text-primary" />
                <MessageCircle className="h-6 w-6 text-primary" />
                <Send className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-primary"><span className="font-semibold">{mockUser.handle}</span> {post.content}</p>
            </div>
          </div>
        );
      case Platform.Facebook:
        return (
          <div className="w-full max-w-lg bg-primary border border-default rounded-lg p-4">
            <div className="flex items-center mb-3">
              <img src={mockUser.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <p className="font-semibold text-primary">{mockUser.name}</p>
                <p className="text-xs text-secondary">Just now · 🌎</p>
              </div>
            </div>
            <p className="mb-3 text-primary whitespace-pre-wrap">{post.content}</p>
            <img src={imageUrl} alt={post.imagePrompt} className="w-full rounded-lg border border-default" />
            <div className="flex justify-around items-center mt-2 pt-2 border-t border-default text-secondary">
              <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md"><ThumbsUp className="h-5 w-5"/> Like</button>
              <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md"><MessageCircle className="h-5 w-5"/> Comment</button>
              <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md"><Send className="h-5 w-5"/> Share</button>
            </div>
          </div>
        );
      case Platform.Twitter:
        return (
          <div className="w-full max-w-lg bg-primary border border-default rounded-xl p-4">
            <div className="flex items-start">
              <img src={mockUser.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <div className="flex items-center">
                  <span className="font-bold text-primary">{mockUser.name}</span>
                  <span className="text-secondary ml-2">@{mockUser.handle} · 1m</span>
                </div>
                <p className="text-primary whitespace-pre-wrap">{post.content}</p>
                <img src={imageUrl} alt={post.imagePrompt} className="mt-3 w-full rounded-2xl border border-default" />
                <div className="flex justify-between items-center mt-3 text-secondary max-w-xs">
                  <button className="flex items-center gap-1 hover:text-blue-500"><MessageCircle className="h-5 w-5"/> 12</button>
                  <button className="flex items-center gap-1 hover:text-green-500"><Repeat className="h-5 w-5"/> 34</button>
                  <button className="flex items-center gap-1 hover:text-pink-500"><Heart className="h-5 w-5"/> 567</button>
                </div>
              </div>
            </div>
          </div>
        );
      case Platform.LinkedIn:
        return (
          <div className="w-full max-w-lg bg-primary border border-default rounded-lg">
             <div className="p-4">
                <div className="flex items-center mb-3">
                  <img src={mockUser.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
                  <div className="ml-3">
                    <p className="font-semibold text-primary">{mockUser.name}</p>
                    <p className="text-xs text-secondary">Marketing @ {mockUser.name} · 1,234 followers</p>
                    <p className="text-xs text-secondary">1m · 🌎</p>
                  </div>
                </div>
                <p className="mb-3 text-primary whitespace-pre-wrap">{post.content}</p>
             </div>
            <img src={imageUrl} alt={post.imagePrompt} className="w-full object-cover" />
            <div className="flex justify-around items-center p-1 border-t border-default text-secondary">
               <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md"><ThumbsUp className="h-5 w-5"/> Like</button>
              <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md"><MessageCircle className="h-5 w-5"/> Comment</button>
              <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md"><Repeat className="h-5 w-5"/> Repost</button>
              <button className="flex items-center gap-2 hover:bg-secondary p-2 rounded-md"><Send className="h-5 w-5"/> Send</button>
            </div>
          </div>
        );
      case Platform.Email:
        return (
          <div className="w-full max-w-2xl bg-primary border border-default rounded-lg">
            <div className="p-4 border-b border-default">
              <p className="text-sm text-secondary">To: customer@example.com</p>
              <p className="text-sm text-secondary">From: {mockUser.name} &lt;contact@{mockUser.handle}.com&gt;</p>
              <hr className="my-2 border-default"/>
              <h3 className="text-lg font-bold text-primary">{post.variants[0] || 'Your Subject Line Here'}</h3>
              {post.variants.length > 1 && (
                <div className="mt-2 text-xs text-secondary">
                  <p className="font-semibold">Other subject variants:</p>
                  <ul className="list-disc list-inside">
                    {post.variants.slice(1).map((v, i) => <li key={i}>{v}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="mb-4 text-primary whitespace-pre-wrap">{post.content}</p>
              <img src={imageUrl} alt={post.imagePrompt} className="w-full rounded-lg" />
            </div>
          </div>
        );
      default:
        return <p>No preview available for this platform.</p>;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-secondary rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-default">
          <div className="flex items-center gap-3">
            {platformDetail && <platformDetail.icon className="h-6 w-6 text-accent-primary" />}
            <h2 id="preview-modal-title" className="text-xl font-bold text-primary">
              Preview for {platformDetail?.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-secondary hover:bg-primary" aria-label="Close preview">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-grow flex items-center justify-center bg-primary rounded-b-2xl">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
