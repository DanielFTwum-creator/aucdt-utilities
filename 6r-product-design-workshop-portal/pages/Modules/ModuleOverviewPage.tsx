import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useProgress } from '../../context/ProgressContext';
import { ROUTES } from '../../constants';
import { BookOpen, HelpCircle, CheckSquare, FileText, ArrowLeft, Lock } from 'lucide-react';
import ProgressBarLinear from '../../components/ProgressBarLinear';
import BadgeIcon from '../../components/BadgeIcon';
import QuizComponent from '../../components/QuizComponent'; // Import the QuizComponent

const ModuleOverviewPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { modules, userProgress, isLoadingProgress, updateQuizCompletion, updateQuestSubmission } = useProgress();

  const module = useMemo(() => modules.find((m) => m.id === moduleId), [modules, moduleId]);
  const progress = useMemo(() => userProgress.find((p) => p.moduleNumber === moduleId), [userProgress, moduleId]);

  const allPreviousModulesCompleted = useMemo(() => {
    if (!module) return false;
    const currentIndex = modules.findIndex(m => m.id === module.id);
    if (currentIndex === 0) return true; // First module is always accessible

    const previousModule = modules[currentIndex - 1];
    const previousModuleProgress = userProgress.find(p => p.moduleNumber === previousModule?.id);

    return previousModuleProgress?.status === 'completed';
  }, [module, modules, userProgress]);


  if (isLoadingProgress || !module || !progress) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Determine if the module is accessible
  const isModuleAccessible = !module.locked && (progress.status !== 'locked' || allPreviousModulesCompleted);

  const renderStatusIcon = (isCompleted: boolean, isDisabled: boolean = false) => {
    if (isDisabled) return <Lock size={18} className="text-gray-400" />;
    return isCompleted ? <CheckSquare size={18} className="text-success" /> : <BookOpen size={18} className="text-primary" />;
  };

  const handleQuizComplete = async (score: number) => {
    if (module.quizzes.length > 0) {
      await updateQuizCompletion(module.id, module.quizzes[0].id, score); // Assuming one quiz per module for simplicity
    }
  };

  const handleQuestSubmitSuccess = async (submissionScore: number) => {
    if (module.quests.length > 0) {
      await updateQuestSubmission(module.id, module.quests[0].id, submissionScore); // Assuming one quest per module
    }
  };

  const lessonsCompleted = progress.lessonsCompleted || 0;
  const quizzesPassed = progress.quizzesPassed || 0;
  const questSubmitted = progress.questSubmitted || false;


  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to={ROUTES.DASHBOARD} className="flex items-center text-primary hover:underline">
            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <BadgeIcon level={progress.badgeLevel} size={30} />
            <span className={`text-lg font-medium ${
              progress.status === 'completed' ? 'text-success' :
              progress.status === 'in_progress' ? 'text-primary' : 'text-gray-500'
            }`}>
              {progress.status === 'completed' ? 'Module Completed!' : 'In Progress'}
            </span>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-text-light dark:text-text-dark mb-3">{module.name}</h1>
        <h2 className="text-xl font-semibold text-subtle-text-light dark:text-subtle-text-dark mb-4">{module.theme}</h2>
        <p className="text-lg text-subtle-text-light dark:text-subtle-text-dark mb-6 leading-relaxed">
          {module.description}
        </p>

        <div className="flex items-center space-x-4 mb-8">
          <ProgressBarLinear value={progress.progressPercentage} className="flex-1" />
          <span className="text-lg font-semibold text-primary">{progress.progressPercentage}% Complete</span>
        </div>

        {!isModuleAccessible && (
          <Card className="p-6 text-center bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 mb-8">
            <Lock size={24} className="inline-block text-yellow-600 mr-2" />
            <h3 className="inline-block text-xl font-semibold text-yellow-800 dark:text-yellow-200">
              Module Locked
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 mt-2">
              Please complete the previous module to unlock this content.
            </p>
          </Card>
        )}

        {isModuleAccessible && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Lessons Section */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
                <BookOpen size={24} className="mr-3 text-primary" /> Lessons
              </h3>
              <ul className="space-y-3">
                {module.lessons.map((lesson, index) => {
                  const isLessonCompleted = lessonsCompleted > index;
                  const isLessonAccessible = index === 0 || lessonsCompleted > index - 1; // Unlock next lesson when prev is done
                  return (
                    <li key={lesson.id} className="flex items-center justify-between text-subtle-text-light dark:text-subtle-text-dark">
                      <span className={`flex-1 ${isLessonAccessible && !isLessonCompleted ? 'font-medium text-text-light dark:text-text-dark' : ''}`}>
                        {renderStatusIcon(isLessonCompleted, !isLessonAccessible)} {lesson.title} ({lesson.duration})
                      </span>
                      {isLessonAccessible && (
                        <Link to={`${ROUTES.MODULES}/${moduleId}/lesson/${lesson.id}`}>
                          <Button variant="ghost" size="sm" disabled={!isLessonAccessible}>
                            {isLessonCompleted ? 'Review' : 'Start'}
                          </Button>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>

            {/* Quizzes Section */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
                <HelpCircle size={24} className="mr-3 text-primary" /> Quizzes
              </h3>
              <ul className="space-y-3">
                {module.quizzes.map((quiz, index) => {
                  const isQuizPassed = quizzesPassed > index;
                  // Fix: `isQuizAccessible` must be defined within the map for each quiz
                  const isQuizAccessible = lessonsCompleted >= module.lessons.length;
                  return (
                    <li key={quiz.id} className="flex items-center justify-between text-subtle-text-light dark:text-subtle-text-dark">
                      <span className={`flex-1 ${isQuizAccessible && !isQuizPassed ? 'font-medium text-text-light dark:text-text-dark' : ''}`}>
                        {renderStatusIcon(isQuizPassed, !isQuizAccessible)} {quiz.title} (Pass: {quiz.passScore}%)
                      </span>
                      {isQuizAccessible && (
                        <Button variant="ghost" size="sm" onClick={() => navigate(`${ROUTES.MODULES}/${moduleId}/quiz/${quiz.id}`)} disabled={!isQuizAccessible}>
                          {isQuizPassed ? 'Review' : 'Start'}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
              {/* Render quiz component directly if accessible and not passed yet */}
              {quizzesPassed < module.quizzes.length && lessonsCompleted >= module.lessons.length && module.quizzes.length > 0 && ( // Ensure isQuizAccessible for the first quiz
                <div className="mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
                  <QuizComponent moduleId={moduleId} quiz={module.quizzes[quizzesPassed]} onQuizComplete={handleQuizComplete} />
                </div>
              )}
            </Card>

            {/* Quests Section */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
                <CheckSquare size={24} className="mr-3 text-primary" /> Quest
              </h3>
              <ul className="space-y-3">
                {module.quests.map((quest, index) => {
                  const isQuestAccessible = quizzesPassed >= module.quizzes.length;
                  return (
                    <li key={quest.id} className="flex items-center justify-between text-subtle-text-light dark:text-subtle-text-dark">
                      <span className={`flex-1 ${isQuestAccessible && !questSubmitted ? 'font-medium text-text-light dark:text-text-dark' : ''}`}>
                        {renderStatusIcon(questSubmitted, !isQuestAccessible)} {quest.title}
                      </span>
                      {isQuestAccessible && (
                        <Link to={`${ROUTES.MODULES}/${moduleId}/quest/${quest.id}`}>
                          <Button variant="ghost" size="sm" disabled={!isQuestAccessible}>
                            {questSubmitted ? 'Review' : 'Start'}
                          </Button>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>

            {/* Resources Section */}
            <Card className="p-6">
              <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
                <FileText size={24} className="mr-3 text-primary" /> Resources
              </h3>
              <ul className="space-y-3">
                {module.resources.map((resource) => (
                  <li key={resource.name} className="flex items-center justify-between text-subtle-text-light dark:text-subtle-text-dark">
                    <span>{resource.name}</span>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ModuleOverviewPage;