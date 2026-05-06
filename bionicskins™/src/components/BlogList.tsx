import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Skeleton } from './ui/Skeleton';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  category: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post => 
    (category === 'All' || post.category === category) &&
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-serif text-navy mb-16 tracking-tight text-center">Our Blog</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-12 justify-center">
          <input type="text" placeholder="Search posts..." className="p-4 rounded-[4px] border border-navy/20 w-full md:w-64" onChange={(e) => setSearchTerm(e.target.value)} />
          <select className="p-4 rounded-[4px] border border-navy/20 w-full md:w-48" onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => <div key={i}><Skeleton className="h-64 rounded-[24px]" /></div>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map(post => (
              <motion.div key={post.id} className="bg-frost p-8 rounded-[24px] border border-navy/10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <h3 className="text-2xl font-serif text-navy mb-4">{post.title}</h3>
                <p className="text-gray-600 font-sans mb-4">{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-prof-blue font-sans">{post.author} • {post.createdAt}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
