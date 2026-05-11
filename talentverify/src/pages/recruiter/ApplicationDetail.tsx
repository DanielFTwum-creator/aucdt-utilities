import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, CheckCircle, AlertTriangle, FileText, Video } from 'lucide-react';

interface Answer {
  id: number;
  question_text: string;
  text_response: string | null;
  video_data: string | null;
  file_data: string | null;
  ai_score: number;
}

interface Application {
  id: number;
  candidate_name: string;
  candidate_email: string;
  role_title: string;
  ai_authorship_score: number;
  talent_signal_score: number;
  created_at: string;
  status: string;
  answers: Answer[];
}

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch the full details including answers
    // For now, we'll just fetch the application metadata
    // You might need to update the API to return answers for a specific application
    fetch(`/api/applications/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load application');
        return res.json();
      })
      .then(setApplication)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading application...</div>;
  if (!application) return <div className="p-8 text-center">Application not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/candidates" className="flex items-center text-text-muted hover:text-brand-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Applications
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-display">{application.candidate_name}</h1>
              <p className="text-text-muted font-body">{application.role_title}</p>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium font-body">
                {application.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-text-muted" />
            <span className="text-text-primary font-body">{application.candidate_email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-text-muted" />
            <span className="text-text-primary font-body">{new Date(application.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${application.ai_authorship_score > 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              <AlertTriangle className="w-4 h-4" />
              AI Score: {Math.round(application.ai_authorship_score)}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-text-primary font-display">Responses</h2>
        {application.answers?.map((answer) => (
          <div key={answer.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-medium text-text-primary mb-3 font-display">{answer.question_text}</h3>
            
            {answer.video_data ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden max-w-lg">
                <video src={answer.video_data} controls className="w-full h-full" />
              </div>
            ) : answer.file_data ? (
               <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                 <FileText className="w-6 h-6 text-brand-primary" />
                 <span className="text-sm font-medium text-text-primary">File Uploaded</span>
                 {/* In a real app, add a download link here */}
               </div>
            ) : (
              <p className="text-text-secondary whitespace-pre-wrap font-body">{answer.text_response}</p>
            )}

            <div className="mt-4 flex justify-end">
               <span className="text-xs text-text-muted font-body">AI Analysis Score: {Math.round(answer.ai_score)}%</span>
            </div>
          </div>
        ))}
        {(!application.answers || application.answers.length === 0) && (
            <div className="text-center p-8 text-text-muted bg-gray-50 rounded-xl border border-dashed border-gray-300">
                No detailed answers available for this view yet.
            </div>
        )}
      </div>
    </div>
  );
}
