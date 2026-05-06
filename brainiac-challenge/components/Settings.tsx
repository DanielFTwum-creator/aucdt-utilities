


import React, { useState, useEffect } from 'react';
import { QuizSettings, AcademicLevel, Difficulty } from '../types.ts';
import { ACADEMIC_LEVELS, DIFFICULTY_LEVELS, TOPICS_BY_LEVEL, HERO_IMAGES, TUC_LOGO_DATA_URL, TIME_LIMIT_OPTIONS } from '../constants.ts';
import { Button, Select, Input, Card } from './ui.tsx';

interface SettingsProps {
  onStartChallenge: (settings: QuizSettings) => void;
  onShowAuditLog: () => void;
  isLoading: boolean;
}

export const Settings = ({ onStartChallenge, onShowAuditLog, isLoading }: SettingsProps) => {
  const [level, setLevel] = useState<AcademicLevel>(AcademicLevel.SHS);
  const [topic, setTopic] = useState<string>(TOPICS_BY_LEVEL[AcademicLevel.SHS][0]);
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [timeLimit, setTimeLimit] = useState<number>(TIME_LIMIT_OPTIONS[1].value); // Default to 10 minutes
  const [availableTopics, setAvailableTopics] = useState<string[]>(TOPICS_BY_LEVEL[level]);

  // Use the first image as the stable, initial hero image.
  // This prevents the image from changing on re-renders and avoids visual flicker.
  const heroImage = HERO_IMAGES[0];

  useEffect(() => {
    const newTopics = TOPICS_BY_LEVEL[level];
    setAvailableTopics(newTopics);
    // When level changes, reset topic to the first of the new list,
    // but only if a custom topic is not being entered.
    if (!isCustomTopic) {
      setTopic(newTopics[0]);
    }
  }, [level, isCustomTopic]);

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'Other...') {
      setIsCustomTopic(true);
      setCustomTopic(''); // Clear previous custom topic input
    } else {
      setIsCustomTopic(false);
      setTopic(selectedValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartChallenge({
      level,
      topic: isCustomTopic ? customTopic : topic,
      isCustomTopic,
      numQuestions: 24, // Hardcoded to 24 to match the new prompt
      difficulty,
      timeLimit,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4" data-testid="settings-view">
      <Card>
        <img 
          src={heroImage} 
          alt="An artistic representation of a brain with a glowing neural network, symbolizing intelligence and learning." 
          className="w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] h-48 object-cover rounded-t-2xl mb-8 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8"
        />
        <div className="text-center mb-8">
            <a href="https://portal.aucdt.edu.gh" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src={TUC_LOGO_DATA_URL} alt="TUC Logo" className="mx-auto mb-2 h-12" />
            </a>
            <h1 className="text-4xl font-extrabold text-[#B8860B]" data-testid="main-title">Brainiac Challenge</h1>
            <p className="text-lg text-gray-300 mt-2">Create your own AI-powered quiz.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Level */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-200">Academic Level</label>
            <Select data-testid="level-select" value={level} onChange={(e) => setLevel(e.target.value as AcademicLevel)}>
              {ACADEMIC_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-200">Topic</label>
            <Select data-testid="topic-select" value={isCustomTopic ? 'Other...' : topic} onChange={handleTopicChange}>
              {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
              <option value="Other...">Other...</option>
            </Select>
            {isCustomTopic && (
              <Input 
                data-testid="custom-topic-input"
                type="text" 
                value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                placeholder="Enter custom topic"
                className="mt-3"
                required
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-200">Difficulty</label>
              <Select data-testid="difficulty-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                {DIFFICULTY_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            {/* Time Limit */}
             <div>
              <label className="block text-lg font-semibold mb-2 text-gray-200">Time Limit</label>
              <Select data-testid="time-limit-select" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}>
                {TIME_LIMIT_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-4">
            <Button data-testid="start-challenge-button" type="submit" disabled={isLoading} className="w-full text-xl py-3">
              {isLoading ? 'Please wait...' : 'Start Challenge'}
            </Button>
            <Button data-testid="audit-log-button" type="button" variant="outline" onClick={onShowAuditLog} className="w-full">
              View Audit Log
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};