import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import VideoPlayer from '../../components/VideoPlayer';
import CodeBlock from '../../components/CodeBlock';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useProgress } from '../../context/ProgressContext';
import { ROUTES } from '../../constants';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const LessonPage: React.FC = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { modules, isLoadingProgress, updateLessonCompletion, userProgress } = useProgress();

  const module = modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    if (!isLoadingProgress && module && lesson) {
      // Optionally update lesson completion when page is loaded (e.g., if it's a text-only lesson)
      // For video lessons, completion is handled by VideoPlayer on 90% watch
      if (!lesson.videoUrl && moduleId && lessonId) {
        // If it's a text/code lesson, mark as completed on view
        const currentModuleProgress = userProgress.find(p => p.moduleNumber === moduleId);
        const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
        if (currentModuleProgress && currentModuleProgress.lessonsCompleted <= lessonIndex) {
          updateLessonCompletion(moduleId, lessonId);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingProgress, module, lesson, moduleId, lessonId]);


  if (isLoadingProgress || !module || !lesson) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const currentLessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = module.lessons[currentLessonIndex + 1];
  const prevLesson = module.lessons[currentLessonIndex - 1];

  const handleVideoEnded = () => {
    // This is also handled by VideoPlayer's internal logic, but here for explicit action
    if (moduleId && lessonId) {
      updateLessonCompletion(moduleId, lessonId);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Link to={`${ROUTES.MODULES}/${moduleId}`} className="flex items-center text-primary hover:underline mb-6">
          <ArrowLeft size={18} className="mr-2" /> Back to Module {module.id}: {module.name}
        </Link>

        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-4">{lesson.title}</h1>
        <p className="text-lg text-subtle-text-light dark:text-subtle-text-dark mb-6">
          Module {module.id} - Lesson {currentLessonIndex + 1}
        </p>

        {lesson.videoUrl && (
          <div className="mb-8">
            <VideoPlayer
              src={lesson.videoUrl}
              title={lesson.title}
              lessonId={lessonId}
              onEnded={handleVideoEnded}
            />
          </div>
        )}

        {/* Lesson Content (Transcription/Text) */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-3">Lesson Content</h2>
          <p className="text-subtle-text-light dark:text-subtle-text-dark leading-relaxed">
            {lesson.transcription}
          </p>
        </Card>

        {/* Code Example (if available) */}
        {lesson.codeExample && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-3">Interactive Code Example</h2>
            <p className="text-subtle-text-light dark:text-subtle-text-dark mb-4">
              Explore this code snippet. Click "Try it" to open it in CodeSandbox.
            </p>
            <CodeBlock
              code={lesson.codeExample.code}
              language={lesson.codeExample.language}
              sandboxUrl={lesson.codeExample.sandboxUrl}
            />
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {prevLesson ? (
            <Link to={`${ROUTES.MODULES}/${moduleId}/lesson/${prevLesson.id}`}>
              <Button variant="secondary">
                <ArrowLeft size={18} className="mr-2" /> Previous Lesson
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              <ArrowLeft size={18} className="mr-2" /> Previous Lesson
            </Button>
          )}

          {nextLesson ? (
            <Link to={`${ROUTES.MODULES}/${moduleId}/lesson/${nextLesson.id}`}>
              <Button variant="primary">
                Next Lesson <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          ) : (
            <Link to={`${ROUTES.MODULES}/${moduleId}/quest/${module.quests[0].id}`}>
              <Button variant="primary">
                Go to Quest <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonPage;