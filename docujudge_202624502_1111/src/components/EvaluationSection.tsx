import { Section } from '@/constants';
import ScoreInput from './ScoreInput';

interface EvaluationSectionProps {
  section: Section;
  scores: Record<string, number>;
  onScoreChange: (criterionId: string, value: number) => void;
  sceneNumber: number;
}

export default function EvaluationSection({ section, scores, onScoreChange, sceneNumber }: EvaluationSectionProps) {
  return (
    <div className="bg-bg-card text-black">
      <div className="bg-bg-elevated px-4 py-2 flex justify-between items-center border-l-4 border-accent-red">
        <h2 className="font-mono text-white text-lg uppercase tracking-wide">
          INT. {section.title} — DAY
        </h2>
        <span className="font-mono text-accent-red font-bold">SC. {sceneNumber.toString().padStart(2, '0')}</span>
      </div>
      
      <div className="p-8 grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {section.criteria.map((criterion) => (
          <ScoreInput
            key={criterion.id}
            criterion={criterion}
            value={scores[criterion.id] || 0}
            onChange={(val) => onScoreChange(criterion.id, val)}
          />
        ))}
      </div>
    </div>
  );
}
