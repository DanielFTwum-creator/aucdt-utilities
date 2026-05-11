
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { ScheduledPost, PostPriority } from '../types';
import { storageService } from '../services/storageService';

interface PostsContextType { 
  scheduledPosts: ScheduledPost[]; 
  addPost: (post: ScheduledPost) => void; 
  deletePost: (postId: string) => void; 
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be used within PostsProvider');
  return context;
};

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  useEffect(() => { 
    (async () => {
        const posts = await storageService.getScheduledPosts();
        // Add default priority for backward compatibility with older data
        const postsWithDefaults = posts.map(p => ({
            ...p,
            priority: p.priority || PostPriority.MEDIUM,
        }));
        setScheduledPosts(postsWithDefaults)
    })(); 
  }, []);

  const addPost = useCallback(async (post: ScheduledPost) => {
    setScheduledPosts(prev => { 
      const updated = [...prev, post].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()); 
      storageService.setScheduledPosts(updated); 
      return updated; 
    });
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    setScheduledPosts(prev => { 
      const updated = prev.filter(p => p.id !== postId); 
      storageService.setScheduledPosts(updated); 
      return updated; 
    });
  }, []);

  return <PostsContext.Provider value={{ scheduledPosts, addPost, deletePost }}>{children}</PostsContext.Provider>;
};
