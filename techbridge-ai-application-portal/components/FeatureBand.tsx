import React from 'react';
import { Cpu, Globe, Zap, ShieldCheck } from 'lucide-react';

const FeatureBand: React.FC = () => {
    const features = [
        { icon: <Cpu className="w-5 h-5" />, label: "AI INFRASTRUCTURE", sub: "Next-Gen Compute" },
        { icon: <Globe className="w-5 h-5" />, label: "GLOBAL NETWORK", sub: "Connected Campus" },
        { icon: <Zap className="w-5 h-5" />, label: "INSTANT DEPLOY", sub: "Zero Latency" },
        { icon: <ShieldCheck className="w-5 h-5" />, label: "SECURE CORE", sub: "Enterprise Grade" },
    ];

    return (
        <div className="w-full bg-brand-ink border-y border-brand-gold/30 py-4 animate-fade-up delay-350">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center divide-y md:divide-y-0 md:divide-x divide-brand-gold/20">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 px-6 py-2 w-full md:w-auto justify-center md:justify-start group">
                            <div className="text-brand-gold group-hover:text-brand-gold-light transition-colors">
                                {feature.icon}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bebas text-lg tracking-wider text-brand-cream leading-none">{feature.label}</span>
                                <span className="font-cormorant italic text-brand-gold text-sm">{feature.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureBand;
