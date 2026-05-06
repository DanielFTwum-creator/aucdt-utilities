import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ResourceEditor() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      setMessage('Title and URL are required.');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'resources'), { title, description, url });
      setTitle('');
      setDescription('');
      setUrl('');
      setMessage('Resource added successfully!');
    } catch (error) {
      setMessage('Error adding resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-frost">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-serif text-navy mb-8">Add New Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" className="w-full p-4 rounded-[4px] border border-navy/20" />
          <button type="submit" className="bg-navy text-white px-8 py-3 rounded-[4px] font-sans font-medium hover:bg-prof-blue transition" disabled={loading}>
            {loading ? 'Adding...' : 'Add Resource'}
          </button>
          {message && <p className="text-navy font-sans">{message}</p>}
        </form>
      </div>
    </section>
  );
}
