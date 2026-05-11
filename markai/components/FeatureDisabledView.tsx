import React from 'react';

interface FeatureDisabledViewProps {
    featureName: string;
}

const FeatureDisabledView: React.FC<FeatureDisabledViewProps> = ({ featureName }) => {
    return (
        <div className="max-w-3xl mx-auto text-center p-10 bg-secondary rounded-2xl shadow-lg border border-default flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-4 text-2xl font-bold text-primary">Feature Disabled</h3>
            <p className="mt-2 text-lg text-secondary">
                The "{featureName}" feature is currently turned off.
            </p>
            <p className="mt-1 text-secondary">
                An administrator can re-enable this in the Admin Dashboard.
            </p>
        </div>
    );
};

export default FeatureDisabledView;
