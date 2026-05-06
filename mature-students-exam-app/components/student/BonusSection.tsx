
import React from 'react';
import { Award } from 'lucide-react';
import { COLORS } from '../../constants';
import { LatexRenderer } from '../common/LatexRenderer';

interface BonusSectionProps {
  title: string;
  content: string;
}

export const BonusSection: React.FC<BonusSectionProps> = ({ title, content }) => {
    if (!title || !content) return null;
    return (
        <div className="mt-8 p-4 border-l-4 rounded-r-lg" style={{ borderColor: COLORS.aucdtGold, backgroundColor: COLORS.aucdtLightGreen }}>
            <div className="flex items-center">
                <Award className="h-6 w-6 mr-3 flex-shrink-0" style={{ color: COLORS.aucdtGold }} />
                <h3 className="text-lg font-bold" style={{ color: COLORS.aucdtDeepBrown }}>{title}</h3>
            </div>
            <div className="mt-2 text-base pl-9" style={{ color: COLORS.aucdtDarkGray }}>
                <LatexRenderer>{content}</LatexRenderer>
            </div>
        </div>
    );
};
