import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Skeleton } from './ui/Skeleton';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'resources'), orderBy('title', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-serif text-navy mb-16 tracking-tight text-center">Resource Center</h2>
        
        <div className="mb-12 flex justify-center">
          <input type="text" placeholder="Search resources..." className="p-4 rounded-[4px] border border-navy/20 w-full md:w-96" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => <div key={i}><Skeleton className="h-40 rounded-[24px]" /></div>)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredResources.map(res => (
              <a key={res.id} href={res.url} target="_blank" className="block bg-frost p-8 rounded-[24px] border border-navy/10 hover:border-prof-blue transition">
                <h3 className="text-2xl font-serif text-navy mb-2">{res.title}</h3>
                <p className="text-gray-600 font-sans">{res.description}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
