import React, { useEffect, useState } from 'react';
import { Plus, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  role_id: number;
  created_at: string;
}

export default function AssessmentsList() {
  const [assessments, setAssessments] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch this. For now, we'll mock or fetch if endpoint exists.
    // I didn't create a GET /api/questionnaires endpoint yet, only GET /api/questionnaires/:roleId
    // Let's just show the "Create New" state if empty for now, or fetch roles to infer.
    setLoading(false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Assessment Frameworks</h1>
          <p className="text-text-muted mt-1 font-body">Manage role-specific questionnaire templates</p>
        </div>
        <Link
          to="/assessments/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-body"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-brand-primary" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2 font-display">No Assessments Created</h3>
          <p className="text-text-muted mb-6 max-w-md mx-auto font-body">
            Create structured questionnaire templates for your roles to ensure consistent and AI-resilient candidate screening.
          </p>
          <Link
            to="/assessments/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-body"
          >
            <Plus className="w-4 h-4" />
            Create First Template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-brand-primary/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-brand-primary" />
                </div>
                <span className="text-xs font-medium text-text-muted bg-gray-100 px-2 py-1 rounded-full font-body">
                  Role ID: {assessment.role_id}
                </span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2 group-hover:text-brand-primary transition-colors font-display text-lg">
                {assessment.title}
              </h3>
              <p className="text-sm text-text-muted line-clamp-2 mb-4 font-body">
                {assessment.description}
              </p>
              <div className="flex items-center text-sm text-brand-primary font-medium font-body">
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
