import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) {
      setMessage('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'blogPosts'), {
        title,
        content,
        category,
        author: 'Admin',
        createdAt: new Date().toISOString().split('T')[0]
      });
      setTitle('');
      setContent('');
      setCategory('');
      setMessage('Post published successfully!');
    } catch (error) {
      setMessage('Error publishing post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-frost">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-serif text-navy mb-8">Add New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" className="w-full p-4 rounded-[4px] border border-navy/20 h-40" />
          <button type="submit" className="bg-navy text-white px-8 py-3 rounded-[4px] font-sans font-medium hover:bg-prof-blue transition" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
          {message && <p className="text-navy font-sans">{message}</p>}
        </form>
      </div>
    </section>
  );
}
