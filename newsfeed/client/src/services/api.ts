const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

// Feeds
export const getFeeds = () => request<Feed[]>('/feeds');
export const getFeed = (id: string) => request<Feed>(`/feeds/${id}`);
export const createFeed = (data: Partial<Feed>) =>
  request<Feed>('/feeds', { method: 'POST', body: JSON.stringify(data) });
export const updateFeed = (id: string, data: Partial<Feed>) =>
  request<Feed>(`/feeds/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteFeed = (id: string) =>
  request<{ message: string }>(`/feeds/${id}`, { method: 'DELETE' });

// Articles
export const getArticles = () => request<Article[]>('/articles');
export const getArticle = (id: string) => request<Article>(`/articles/${id}`);
export const createArticle = (data: Partial<Article>) =>
  request<Article>('/articles', { method: 'POST', body: JSON.stringify(data) });
export const updateArticle = (id: string, data: Partial<Article>) =>
  request<Article>(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteArticle = (id: string) =>
  request<{ message: string }>(`/articles/${id}`, { method: 'DELETE' });

export interface Feed {
  id: string;
  title: string;
  source: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  feed_id: string;
  headline: string;
  summary: string | null;
  content: string | null;
  author: string | null;
  published_at: string;
  views: number;
  created_at: string;
}
