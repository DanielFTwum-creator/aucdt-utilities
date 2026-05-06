import React from 'react';

interface RadioRatingInputProps {
  question: string;
  rating: number;
  onRatingChange: (rating: number) => void;
  questionNumber: number;
}

const options = [
  { label: 'Strongly Agree', value: 5 },
  { label: 'Agree', value: 4 },
  { label: 'Not Sure', value: 3 },
  { label: 'Disagree', value: 2 },
  { label: 'Strongly Disagree', value: 1 },
];

const RadioRatingInput: React.FC<RadioRatingInputProps> = ({ question, rating, onRatingChange, questionNumber }) => {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white">{question}</p>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-5 text-center text-xs text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300 font-medium px-2">
            {options.map(opt => (
              <label key={opt.value} htmlFor={`q${questionNumber}_${opt.value}`} className="cursor-pointer p-1">{opt.label}</label>
            ))}
          </div>
          <div className="grid grid-cols-5 mt-2">
            {options.map(opt => (
              <div key={opt.value} className="flex justify-center">
                <input
                  type="radio"
                  id={`q${questionNumber}_${opt.value}`}
                  name={`question_${questionNumber}`}
                  value={opt.value}
                  checked={rating === opt.value}
                  onChange={(e) => onRatingChange(Number(e.target.value))}
                  className="w-5 h-5 accent-[#8B1538] dark:accent-[#D4AF37] [.high-contrast_&]:accent-cyan-400 cursor-pointer"
                  aria-label={opt.label}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioRatingInput;