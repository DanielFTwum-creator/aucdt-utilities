
import React from 'react';

const PlaceholderView: React.FC<{ viewName: string }> = ({ viewName }) => (
    <div className="max-w-6xl mx-auto text-center py-20">
        <h2 className="text-3xl font-bold text-text-primary mb-6">{viewName}</h2>
        <p className="text-text-secondary">This feature is under construction.</p>
    </div>
);

export default PlaceholderView;
