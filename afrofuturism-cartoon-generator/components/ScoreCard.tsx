import React from 'react';
import { StarIcon } from './icons';
import { DirectiveScores } from '../types';

interface ScoreCardProps {
  scores: DirectiveScores;
}

const strengthColour = {
  'Strong Afrofuturism': 'text-emerald-400 bg-emerald-900/30 border-emerald-700/50',
  'Moderate Afrofuturism': 'text-amber-400 bg-amber-900/30 border-amber-700/50',
  'Aesthetic Afrofuturism': 'text-purple-400 bg-purple-900/30 border-purple-700/50',
};

const StarRating: React.FC<{ score: number; label: string }> = ({ score, label }) => (
  <div className="space-y-1.5">
    <p className="text-xs text-purple-300 font-medium">{label}</p>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <StarIcon
          key={n}
          filled={n <= score}
          className={`w-5 h-5 ${n <= score ? 'text-amber-400' : 'text-purple-800'}`}
        />
      ))}
    </div>
    <p className="text-xs text-purple-400">{score}/5</p>
  </div>
);

const ScoreCard: React.FC<ScoreCardProps> = ({ scores }) => (
  <div className="rounded-xl border border-purple-800/40 bg-gradient-to-br from-purple-950/60 to-black/60 p-5 space-y-5">
    <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Directive Scores</h3>
    <div className="grid grid-cols-2 gap-5">
      <StarRating score={scores.cultural_authenticity} label="Cultural Authenticity" />
      <StarRating score={scores.representation_quality} label="Representation Quality" />
    </div>
    <div>
      <p className="text-xs text-purple-300 font-medium mb-2">Afrofuturism Strength</p>
      <span className={`inline-block text-sm font-semibold px-3 py-1.5 rounded-full border ${strengthColour[scores.afrofuturism_strength]}`}>
        {scores.afrofuturism_strength}
      </span>
    </div>
  </div>
);

export default ScoreCard;
