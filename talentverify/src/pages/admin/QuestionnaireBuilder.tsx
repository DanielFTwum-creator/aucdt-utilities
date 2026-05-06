import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  text: string;
  type: 'short_answer' | 'long_answer' | 'scenario' | 'ranked_choice';
  min_words: number;
  max_words: number;
}

interface Role {
  id: number;
  title: string;
}

export default function QuestionnaireBuilder() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', type: 'long_answer', min_words: 100, max_words: 600 }
  ]);

  useEffect(() => {
    fetch('/api/roles')
      .then(res => res.json())
      .then(setRoles)
      .catch(console.error);
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'long_answer', min_words: 100, max_words: 600 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!selectedRole) return alert('Please select a role');
    
    try {
      const res = await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role_id: selectedRole,
          title,
          description,
          questions
        })
      });
      
      if (res.ok) {
        alert('Questionnaire saved successfully!');
        navigate('/assessments');
      } else {
        alert('Failed to save questionnaire');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving questionnaire');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </button>
          <h1 className="text-2xl font-bold text-text-primary font-display">Create Assessment Template</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-body"
        >
          <Save className="w-4 h-4" />
          Save Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1 font-body">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-body"
            >
              <option value="">Select a role...</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1 font-body">Template Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-body"
              placeholder="e.g., Senior Engineer Screening"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1 font-body">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-body"
            rows={3}
            placeholder="Instructions for the candidate..."
          />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => removeQuestion(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-text-muted font-body">
                {index + 1}
              </span>
              <select
                value={q.type}
                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-body"
              >
                <option value="short_answer">Short Answer</option>
                <option value="long_answer">Long Answer</option>
                <option value="scenario">Scenario Response</option>
                <option value="ranked_choice">Ranked Choice</option>
                <option value="video_response">Video Response</option>
                <option value="file_upload">File Upload (Work Sample)</option>
              </select>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-medium font-body"
                placeholder="Enter your question here..."
              />
            </div>

            <div className="flex gap-4">
              <div className="w-32">
                <label className="block text-xs font-medium text-text-muted mb-1 font-body">Min Words</label>
                <input
                  type="number"
                  value={q.min_words}
                  onChange={(e) => updateQuestion(index, 'min_words', parseInt(e.target.value))}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm font-body"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-text-muted mb-1 font-body">Max Words</label>
                <input
                  type="number"
                  value={q.max_words}
                  onChange={(e) => updateQuestion(index, 'max_words', parseInt(e.target.value))}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm font-body"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-text-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all flex items-center justify-center gap-2 font-medium font-body"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>
    </div>
  );
}
