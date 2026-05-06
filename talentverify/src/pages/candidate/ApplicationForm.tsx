import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, Upload, Video } from 'lucide-react';
import VideoRecorder from '@/components/VideoRecorder';

interface Question {
  id: number;
  text: string;
  type: string;
  min_words: number;
  max_words: number;
}

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export default function ApplicationForm() {
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get('role');
  
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Candidate Info State
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');

  useEffect(() => {
    if (roleId) {
      fetch(`/api/questionnaires/${roleId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load assessment');
          return res.json();
        })
        .then(setQuestionnaire)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [roleId]);

  const handleResponseChange = (questionId: number, text: string) => {
    setResponses(prev => ({ ...prev, [questionId]: text }));
  };

  const handleVideoComplete = (questionId: number, blob: Blob) => {
    // Convert blob to base64 for submission
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setResponses(prev => ({ ...prev, [questionId]: base64data }));
    };
  };

  const handleFileChange = (questionId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setResponses(prev => ({ ...prev, [questionId]: base64data }));
      };
    }
  };

  const handleVideoUpload = (questionId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (!file.type.startsWith('video/')) {
        alert('Please upload a valid video file.');
        return;
      }
      // Size limit (e.g., 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file is too large. Max size is 50MB.');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setResponses(prev => ({ ...prev, [questionId]: base64data }));
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionnaire) return;

    setSubmitting(true);
    try {
      const payload = {
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        role_id: roleId,
        responses: Object.entries(responses).map(([qId, text]) => ({
          question_id: parseInt(qId),
          text_response: text
        }))
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading assessment...</div>;

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2 font-display">Application Submitted</h2>
        <p className="text-text-muted font-body">Thank you for completing the assessment. We will review your responses shortly.</p>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary font-display">Assessment Not Found</h2>
        <p className="text-text-muted mt-2 font-body">Please check the link provided by your recruiter.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary font-display">{questionnaire.title}</h1>
        <p className="text-text-muted mt-2 font-body text-lg">{questionnaire.description}</p>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 font-body">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 45-60 minutes. Please answer authentically.</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Candidate Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-semibold text-text-primary border-b border-gray-100 pb-2 font-display text-lg">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 font-body">Full Name</label>
              <input
                type="text"
                required
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-body"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 font-body">Email Address</label>
              <input
                type="email"
                required
                value={candidateEmail}
                onChange={e => setCandidateEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-body"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questionnaire.questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <label className="block text-lg font-medium text-text-primary font-display">
                  {index + 1}. {q.text}
                </label>
                <span className="text-xs font-medium text-text-muted bg-gray-100 px-2 py-1 rounded font-body">
                  {q.type === 'video_response' ? 'Video Response' : q.type === 'file_upload' ? 'File Upload' : `${q.min_words}-${q.max_words} words`}
                </span>
              </div>
              
              {q.type === 'video_response' ? (
                <div className="mt-4 space-y-6">
                  {/* Option 1: Record */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-text-primary">
                      <Video className="w-4 h-4 text-brand-primary" />
                      Record Video
                    </div>
                    <VideoRecorder 
                      onRecordingComplete={(blob) => handleVideoComplete(q.id, blob)}
                      maxDuration={90}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* Option 2: Upload */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-text-primary">
                      <Upload className="w-4 h-4 text-brand-primary" />
                      Upload Video File
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoUpload(q.id, e)}
                      className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 font-body"
                    />
                    <p className="mt-1 text-xs text-gray-500">Supported formats: MP4, WebM, MOV. Max size: 50MB.</p>
                  </div>

                  {responses[q.id] && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Video response captured/uploaded
                    </div>
                  )}
                  
                  <input type="hidden" name={`q_${q.id}`} required value={responses[q.id] || ''} />
                </div>
              ) : q.type === 'file_upload' ? (
                <div className="mt-4">
                  <input
                    type="file"
                    accept=".pdf,.docx,.xlsx,.zip"
                    onChange={(e) => handleFileChange(q.id, e)}
                    className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 font-body"
                  />
                  <input type="hidden" name={`q_${q.id}`} required value={responses[q.id] || ''} />
                </div>
              ) : (
                <textarea
                  required
                  rows={6}
                  value={responses[q.id] || ''}
                  onChange={e => handleResponseChange(q.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-body"
                  placeholder="Type your answer here..."
                />
              )}
              
              {q.type !== 'video_response' && q.type !== 'file_upload' && (
                <div className="mt-2 flex justify-end">
                  <span className={`text-xs font-body ${(responses[q.id]?.split(/\s+/).filter(Boolean).length || 0) < q.min_words ? 'text-red-500' : 'text-green-600'}`}>
                    {responses[q.id]?.split(/\s+/).filter(Boolean).length || 0} words
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-brand-primary text-white font-medium rounded-xl hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-colors shadow-sm font-body"
          >
            {submitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
          <p className="text-center text-xs text-text-muted mt-4 font-body">
            By submitting, you confirm that these responses are your own work.
            AI authorship signals are analyzed for authenticity.
          </p>
        </div>
      </form>
    </div>
  );
}
