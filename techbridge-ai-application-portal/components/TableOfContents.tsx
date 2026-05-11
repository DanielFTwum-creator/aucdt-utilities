import React from 'react';
import { Category } from '../types';

interface TableOfContentsProps {
    activeCategory: Category | 'All Apps';
    onCategoryChange: (category: Category | 'All Apps') => void;
    onScrollToTop: () => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ activeCategory, onCategoryChange, onScrollToTop }) => {
    const items = [
        { id: '01', title: 'Neural Networks', desc: 'Deep Learning Architectures', category: Category.Research },
        { id: '02', title: 'Data Science', desc: 'Predictive Analytics', category: Category.Analysis },
        { id: '03', title: 'Automation', desc: 'Robotic Process Control', category: Category.Development },
        { id: '04', title: 'Ethics in AI', desc: 'Responsible Innovation', category: Category.Education },
    ];

    return (
        <nav aria-label="Table of Contents" className="space-y-8">
            <div>
                <h3 className="font-bebas text-2xl text-brand-gold tracking-widest mb-6 border-b border-brand-gold/30 pb-2">
                    In This Issue
                </h3>
                <ul className="space-y-6">
                    <li className="group cursor-pointer" onClick={onScrollToTop}>
                         <div className="flex items-baseline space-x-3">
                            <span className="font-bebas text-xl text-brand-gold/50 group-hover:text-brand-gold transition-colors">00</span>
                            <div className="flex flex-col">
                                <span className="font-dm-sans font-bold uppercase text-xs tracking-wider text-brand-cream group-hover:text-brand-gold transition-colors">
                                    Cover Story
                                </span>
                                <span className="font-cormorant italic text-brand-gold-pale/70 text-sm">
                                    The AI Revolution
                                </span>
                            </div>
                        </div>
                    </li>
                    {items.map((item) => (
                        <li key={item.id} className="group cursor-pointer" onClick={() => onCategoryChange(item.category)}>
                            <div className="flex items-baseline space-x-3">
                                <span className={`font-bebas text-xl transition-colors ${activeCategory === item.category ? 'text-brand-gold' : 'text-brand-gold/50 group-hover:text-brand-gold'}`}>
                                    {item.id}
                                </span>
                                <div className="flex flex-col">
                                    <span className={`font-dm-sans font-bold uppercase text-xs tracking-wider transition-colors ${activeCategory === item.category ? 'text-brand-gold' : 'text-brand-cream group-hover:text-brand-gold'}`}>
                                        {item.title}
                                    </span>
                                    <span className="font-cormorant italic text-brand-gold-pale/70 text-sm">
                                        {item.desc}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                     <li className="group cursor-pointer" onClick={() => onCategoryChange('All Apps')}>
                         <div className="flex items-baseline space-x-3">
                            <span className={`font-bebas text-xl transition-colors ${activeCategory === 'All Apps' ? 'text-brand-gold' : 'text-brand-gold/50 group-hover:text-brand-gold'}`}>05</span>
                            <div className="flex flex-col">
                                <span className={`font-dm-sans font-bold uppercase text-xs tracking-wider transition-colors ${activeCategory === 'All Apps' ? 'text-brand-gold' : 'text-brand-cream group-hover:text-brand-gold'}`}>
                                    Full Index
                                </span>
                                <span className="font-cormorant italic text-brand-gold-pale/70 text-sm">
                                    Browse All Applications
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default TableOfContents;
