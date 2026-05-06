import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import QuestSubmissionForm from '../../components/QuestSubmissionForm';
import { useProgress } from '../../context/ProgressContext';
import { QuestSubmission } from '../../types';
import { fetchQuestSubmission } from '../../services/questService';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, History } from 'lucide-react';
import { ROUTES } from '../../constants';
import Button from '../../components/ui/Button';
import BadgeIcon from '../../components/BadgeIcon';

const DesignAuditQuestPage: React.FC = () => {
  const { moduleId, questId } = useParams<{ moduleId: string; questId: string }>();
  const { user } = useAuth();
  const { modules, isLoadingProgress } = useProgress();
  const [questSubmission, setQuestSubmission] = useState<QuestSubmission | undefined>(undefined);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState<boolean>(true);
  const [showHistory, setShowHistory] = useState<boolean>(false); // Not fully implemented for now.

  const module = modules.find((m) => m.id === moduleId);
  const quest = module?.quests.find((q) => q.id === questId);

  useEffect(() => {
    const loadSubmission = async () => {
      if (user?.id && questId) {
        setIsLoadingSubmission(true);
        const submission = await fetchQuestSubmission(user.id, questId);
        setQuestSubmission(submission);
        setIsLoadingSubmission(false);
      }
    };
    loadSubmission();
  }, [user, questId]);

  const handleSubmissionSuccess = (submission: QuestSubmission) => {
    setQuestSubmission(submission);
    alert('Quest submitted successfully! AI feedback will be reviewed shortly.');
  };

  if (isLoadingProgress || isLoadingSubmission || !module || !quest) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={`${ROUTES.MODULES}/${moduleId}`} className="flex items-center text-primary hover:underline">
            <ArrowLeft size={18} className="mr-2" /> Back to Module {module.id}
          </Link>
          <Button variant="ghost" onClick={() => setShowHistory(!showHistory)} aria-label="View submission history">
            <History size={18} className="mr-2" /> View History (Not Implemented)
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">{quest.title}</h1>
        <p className="text-lg text-subtle-text-light dark:text-subtle-text-dark mb-6">
          {quest.description}
        </p>

        {questSubmission && (
          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
            <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3">Previous Submission & AI Feedback</h2>
            <div className="flex items-center justify-between mb-3 text-subtle-text-light dark:text-subtle-text-dark">
              <p>Submitted: {new Date(questSubmission.submittedAt).toLocaleDateString()}</p>
              {questSubmission.score !== undefined && (
                <div className="flex items-center space-x-2">
                  <span>Score: {questSubmission.score}%</span>
                  <BadgeIcon level={questSubmission.badgeLevel || 'none'} size={20} />
                </div>
              )}
            </div>
            {questSubmission.aiFeedback?.feedback ? (
              <div className="space-y-2">
                <p className="font-medium text-text-light dark:text-text-dark">{questSubmission.aiFeedback.feedback.tone}</p>
                <ul className="list-disc list-inside text-subtle-text-light dark:text-subtle-text-dark">
                  {questSubmission.aiFeedback.feedback.observations.map((obs, index) => (
                    <li key={index}>{obs}</li>
                  ))}
                  {questSubmission.aiFeedback.feedback.nextSteps.map((step, index) => (
                    <li key={`next-${index}`}>Next Step: {step}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>AI feedback pending or unavailable.</p>
            )}
          </Card>
        )}

        <QuestSubmissionForm
          moduleId={moduleId || ''}
          quest={quest}
          onSubmitSuccess={handleSubmissionSuccess}
          existingSubmission={questSubmission}
        />
      </div>
    </DashboardLayout>
  );
};

export default DesignAuditQuestPage;