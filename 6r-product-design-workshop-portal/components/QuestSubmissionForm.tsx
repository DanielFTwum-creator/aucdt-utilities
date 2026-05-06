import React, { useState, useCallback, useMemo } from 'react';
import { Quest, QuestSubmission, AIResponse } from '../types';
import Button from './ui/Button';
import Textarea from './ui/Textarea';
import Card from './ui/Card';
import LoadingSpinner from './ui/LoadingSpinner';
import { Upload, CheckCircle, XCircle, FileText } from 'lucide-react';
import { generateAIFeedback } from '../services/questService';
import BadgeIcon from './BadgeIcon';
import Modal from './ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { COLORS } from '../constants';

interface QuestSubmissionFormProps {
  moduleId: string;
  quest: Quest;
  onSubmitSuccess: (submission: QuestSubmission) => void;
  existingSubmission?: QuestSubmission;
}

const QuestSubmissionForm: React.FC<QuestSubmissionFormProps> = ({
  moduleId,
  quest,
  onSubmitSuccess,
  existingSubmission,
}) => {
  const { user } = useAuth();
  const { updateQuestSubmission } = useProgress();
  const [description, setDescription] = useState<string>(existingSubmission?.submissionData?.description || '');
  const [files, setFiles] = useState<File[]>([]);
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<AIResponse | undefined>(existingSubmission?.aiFeedback);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);

  const MAX_FILES = 5;
  const MAX_FILE_SIZE_MB = 5;
  const MIN_DESCRIPTION_LENGTH = 50; // Requirement from SRS

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      if (selectedFiles.length > MAX_FILES) {
        setFileError(`You can upload a maximum of ${MAX_FILES} files.`);
        return;
      }
      for (const file of selectedFiles) {
        // Fix: 'size' and 'type' properties exist on File object
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          setFileError(`File "${file.name}" exceeds the maximum size of ${MAX_FILE_SIZE_MB}MB.`);
          return;
        }
        // Fix: 'type' property exists on File object
        if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) {
          setFileError(`File "${file.name}" is not a supported type (PNG, JPG, PDF only).`);
          return;
        }
      }
      setFiles(selectedFiles);
      setFileError('');
    }
  };

  const validateForm = useCallback(() => {
    let isValid = true;
    if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters.`);
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (files.length === 0 && quest.type === 'design-audit') { // Assuming design audit requires files
      setFileError('Please upload at least one image/PDF for your audit.');
      isValid = false;
    } else {
      setFileError('');
    }

    return isValid;
  }, [description, files, quest.type]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate file upload to S3 by converting to Data URL
      const fileBase64Urls: string[] = [];
      for (const file of files) {
        fileBase64Urls.push(await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }));
      }

      // Simulate AI processing and submission
      const submissionData = { description: description };
      const aiResult = await generateAIFeedback(submissionData, quest.type, existingSubmission?.attemptNumber ? existingSubmission.attemptNumber + 1 : 1);

      // In a real app, this would send to your backend, which then calls Anthropic Claude
      const newSubmission: QuestSubmission = {
        id: `submission-${Date.now()}-${user.id}-${quest.id}`,
        userId: user.id,
        questId: quest.id,
        moduleNumber: moduleId,
        submissionData,
        fileUrls: fileBase64Urls,
        aiFeedback: aiResult,
        score: aiResult.score,
        badgeLevel: aiResult.badgeLevel,
        attemptNumber: (existingSubmission?.attemptNumber || 0) + 1,
        status: 'reviewed',
        submittedAt: new Date(),
        reviewedAt: new Date(),
      };

      // Update local storage for mock submissions (already handled by services/questService)
      // Call service to actually save (mocked)
      // await questService.submitQuest(user.id, moduleId, quest.id, submissionData, fileBase64Urls);

      setAiFeedback(aiResult);
      setIsFeedbackModalOpen(true);
      onSubmitSuccess(newSubmission); // Notify parent component

      // Update progress context
      await updateQuestSubmission(moduleId, quest.id, aiResult.score);

    } catch (error) {
      console.error('Quest submission failed:', error);
      // Fallback: Generic feedback if AI unavailable (NFR-QUEST-002)
      setAiFeedback({
        score: 50, badgeLevel: 'none', feedback: {
          completeness: 'Could not generate detailed feedback due to a temporary issue. Please try again.',
          quality: '', prioritization: '', observations: [], nextSteps: [], tone: 'neutral'
        }
      });
      setIsFeedbackModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFiles = useMemo(() => {
    // Combine current files and existing submission URLs
    const displayFiles = [...files, ...(existingSubmission?.fileUrls || [])];
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {displayFiles.map((file, index) => (
          <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-sm text-subtle-text-light dark:text-subtle-text-dark">
            <FileText size={16} />
            {/* Fix: Check type of file to access 'name' property correctly */}
            <span>{typeof file === 'string' ? `File ${index + 1}` : file.name}</span> {/* Display name if File object, generic if URL string */}
          </div>
        ))}
      </div>
    );
  }, [files, existingSubmission?.fileUrls]);


  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">{quest.title}</h2>
      <p className="text-subtle-text-light dark:text-subtle-text-dark mb-6">{quest.description}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Textarea
          label="Project Description (min 300 words)"
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={descriptionError}
          rows={6}
          placeholder="Describe your design choices, challenges, and insights gained..."
          minLength={MIN_DESCRIPTION_LENGTH}
        />

        <div>
          <label htmlFor="file-upload" className="text-sm font-medium text-text-light dark:text-text-dark block mb-1">
            Upload images/PDFs (Max {MAX_FILES} files, {MAX_FILE_SIZE_MB}MB each)
          </label>
          <input
            type="file"
            id="file-upload"
            className="block w-full text-sm text-text-light dark:text-text-dark
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-primary file:text-white
                       hover:file:bg-blue-600 cursor-pointer"
            multiple
            accept="image/png, image/jpeg, application/pdf"
            onChange={handleFileChange}
          />
          {renderFiles}
          {fileError && <p className="text-error text-xs mt-1" role="alert">{fileError}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary">
            Save Draft
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            <Upload size={18} />
          </Button>
        </div>
      </form>

      {aiFeedback && (
        <Modal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} title="AI Feedback">
          <div className="space-y-4 text-text-light dark:text-text-dark">
            <div className="flex items-center justify-between text-xl font-semibold">
              <span>Your Score: {aiFeedback.score}%</span>
              <BadgeIcon level={aiFeedback.badgeLevel} size={30} />
            </div>
            <p className="text-subtle-text-light dark:text-subtle-text-dark text-center">
              {aiFeedback.feedback.tone}
            </p>

            <h4 className="font-semibold text-lg mt-4">Detailed Observations:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li className={aiFeedback.score >= 75 ? 'text-success' : aiFeedback.score >= 60 ? 'text-warning' : 'text-error'}>
                <strong>Completeness:</strong> {aiFeedback.feedback.completeness}
              </li>
              <li className={aiFeedback.score >= 75 ? 'text-success' : aiFeedback.score >= 60 ? 'text-warning' : 'text-error'}>
                <strong>Quality of Observations:</strong> {aiFeedback.feedback.quality}
              </li>
              <li className={aiFeedback.score >= 75 ? 'text-success' : aiFeedback.score >= 60 ? 'text-warning' : 'text-error'}>
                <strong>Prioritization Logic:</strong> {aiFeedback.feedback.prioritization}
              </li>
              {aiFeedback.feedback.observations.map((obs, index) => (
                <li key={index} className="text-subtle-text-light dark:text-subtle-text-dark">{obs}</li>
              ))}
            </ul>

            <h4 className="font-semibold text-lg mt-4\">Suggested Next Steps:</h4>
            <ul className="list-disc list-inside space-y-1">
              {aiFeedback.feedback.nextSteps.map((step, index) => (
                <li key={index} className="text-subtle-text-light dark:text-subtle-text-dark">{step}</li>
              ))}
            </ul>

            <div className="mt-6 text-right">
              <Button onClick={() => setIsFeedbackModalOpen(false)}>
                Got It!
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};

export default QuestSubmissionForm;
