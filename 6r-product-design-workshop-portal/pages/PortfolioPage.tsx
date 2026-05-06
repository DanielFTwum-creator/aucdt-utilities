import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import * as portfolioService from '../services/portfolioService';
import { Portfolio, PortfolioSection, TemplateStyle } from '../types';
import { Download, Share2, Eye, Edit, ImagePlus, XCircle } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const { modules, userProgress } = useProgress();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editSection, setEditSection] = useState<PortfolioSection | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (user?.id) {
        setIsLoading(true);
        let userPortfolio = await portfolioService.fetchUserPortfolio(user.id);
        if (!userPortfolio) {
          userPortfolio = await portfolioService.createDefaultPortfolio(user.id);
        }
        setPortfolio(userPortfolio);
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, [user]);

  const handleUpdatePortfolio = useCallback(async (updates: Partial<Portfolio>) => {
    if (!user || !portfolio) return;
    setIsSaving(true);
    try {
      const updatedPortfolio = await portfolioService.saveUserPortfolio({ ...portfolio, ...updates });
      setPortfolio(updatedPortfolio);
    } catch (error) {
      console.error('Failed to update portfolio:', error);
    } finally {
      setIsSaving(false);
    }
  }, [user, portfolio]);

  const handleSectionEdit = (section: PortfolioSection) => {
    setEditSection(section);
    setEditedContent(Array.isArray(section.content) ? section.content.join('\n') : section.content);
    setSelectedImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveSectionContent = async () => {
    if (!user || !portfolio || !editSection) return;
    setIsSaving(true);
    try {
      let newContent: string | string[] = editedContent;
      if (editSection.type === 'image' && selectedImageFile) {
        const imageUrl = await portfolioService.uploadPortfolioImage(user.id, selectedImageFile);
        newContent = Array.isArray(editSection.content) ? [...editSection.content, imageUrl] : [imageUrl];
      } else if (editSection.type === 'image' && typeof editedContent === 'string' && editedContent.includes('data:image')) {
        // If content was edited directly as base64 string, keep it
        newContent = [editedContent];
      } else if (editSection.type === 'image') {
        // If image section but no new image, just save current string content
        newContent = editedContent.split('\n').filter(Boolean);
      } else {
        newContent = editedContent;
      }

      const updatedPortfolio = await portfolioService.updatePortfolioSection(user.id, editSection.id, newContent);
      if (updatedPortfolio) {
        setPortfolio(updatedPortfolio);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save section content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0]);
      // Optionally show a preview of the selected image in the modal
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedContent(reader.result as string); // Temporarily store base64 for preview
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const sectionsToDisplay = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.sections.filter(sec => {
        // Example: Only show sections for which the user has completed relevant modules
        const moduleMap: {[key: string]: string} = {
            'problem': 'R1',
            'research': 'R2',
            'wireframes': 'R3',
            'designSystem': 'R4',
            'visualDesign': 'R5',
            'implementation': 'R6'
        };
        const requiredModuleId = moduleMap[sec.id];
        if (requiredModuleId) {
            const moduleProgress = userProgress.find(p => p.moduleNumber === requiredModuleId);
            return moduleProgress?.status === 'completed';
        }
        return true; // Always show non-module specific sections like cover, reflection
    });
  }, [portfolio, userProgress]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (!portfolio) {
    return (
      <DashboardLayout>
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error loading portfolio</h2>
          <p className="text-subtle-text-light dark:text-subtle-text-dark">Please try again later.</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-text-light dark:text-text-dark mb-6">Portfolio Generator</h1>
        <p className="text-lg text-subtle-text-light dark:text-subtle-text-dark mb-8">
          Compile your quest submissions into a professional case study.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Settings */}
          <Card className="lg:col-span-1 p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">Settings</h2>
            <Input
              label="Portfolio Title"
              value={portfolio.title}
              onChange={(e) => handleUpdatePortfolio({ title: e.target.value })}
            />
            <Textarea
              label="Description"
              value={portfolio.description}
              onChange={(e) => handleUpdatePortfolio({ description: e.target.value })}
            />
            <Select
              label="Template Style"
              options={[
                { value: 'minimal', label: 'Minimal' },
                { value: 'bold', label: 'Bold' },
                { value: 'academic', label: 'Academic' },
              ]}
              value={portfolio.templateStyle}
              onChange={(e) => handleUpdatePortfolio({ templateStyle: e.target.value as TemplateStyle })}
            />
             <Checkbox
                label="Make Publicly Shareable"
                checked={portfolio.isPublic}
                onChange={(e) => handleUpdatePortfolio({ isPublic: e.target.checked })}
            />
            {portfolio.isPublic && portfolio.publicToken && (
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md text-sm text-subtle-text-light dark:text-subtle-text-dark break-all">
                    Share Link: <a href={`${window.location.origin}/portfolio/${portfolio.publicToken}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{window.location.origin}/portfolio/{portfolio.publicToken}</a>
                </div>
            )}
            <div className="flex flex-col space-y-2">
                <Button variant="primary" loading={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
            </div>
          </Card>

          {/* Portfolio Preview and Section Editing */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">Live Preview</h2>
            <div className={`border-2 border-dashed p-8 rounded-lg min-h-[500px] ${
                portfolio.templateStyle === 'minimal' ? 'border-gray-300 dark:border-gray-600' :
                portfolio.templateStyle === 'bold' ? 'border-primary dark:border-blue-400' :
                'border-green-500 dark:border-green-400'
            }`}>
              <h3 className="text-xl font-bold mb-4">{portfolio.title}</h3>
              <p className="text-subtle-text-light dark:text-subtle-text-dark mb-6">{portfolio.description}</p>

              <div className="space-y-8">
                {sectionsToDisplay.map((section) => (
                  <div key={section.id} className="relative group p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:shadow-sm transition-shadow duration-200">
                    <h4 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">{section.title}</h4>
                    {section.type === 'text' && (
                        <p className="text-subtle-text-light dark:text-subtle-text-dark whitespace-pre-wrap">{section.content as string}</p>
                    )}
                    {section.type === 'image' && Array.isArray(section.content) && section.content.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {(section.content as string[]).map((imgSrc, idx) => (
                                <img key={idx} src={imgSrc} alt={`${section.title} image ${idx + 1}`} className="w-full h-auto object-cover rounded-md" />
                            ))}
                        </div>
                    )}
                    {section.type === 'image' && (!Array.isArray(section.content) || section.content.length === 0) && (
                        <p className="text-subtle-text-light dark:text-subtle-text-dark italic">No images uploaded for this section. Click edit to add.</p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleSectionEdit(section)}
                      aria-label={`Edit ${section.title} section`}
                    >
                      <Edit size={16} /> Edit
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline">
                <Eye size={18} className="mr-2" /> Full Preview
              </Button>
              <Button variant="success">
                <Download size={18} className="mr-2" /> Export to PDF (mock)
              </Button>
              <Button variant="primary">
                <Share2 size={18} className="mr-2" /> Get Share Link
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${editSection?.title} Content`}
      >
        {editSection?.type === 'image' ? (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text-light dark:text-text-dark">Current Images:</h4>
            {Array.isArray(editSection.content) && editSection.content.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {(editSection.content as string[]).map((imgSrc, idx) => (
                  <div key={idx} className="relative">
                    <img src={imgSrc} alt={`Existing image ${idx}`} className="w-full h-auto object-cover rounded-md" />
                    <Button variant="danger" size="sm" className="absolute top-1 right-1" aria-label="Remove image">
                      <XCircle size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-subtle-text-light dark:text-subtle-text-dark">No images yet.</p>
            )}
            <Input
              type="file"
              label="Upload New Image"
              accept="image/*"
              onChange={handleImageFileChange}
            />
            {selectedImageFile && (
              <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark">Selected: {selectedImageFile.name}</p>
            )}
          </div>
        ) : (
          <Textarea
            label="Content"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={10}
            className="w-full"
          />
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" loading={isSaving} onClick={handleSaveSectionContent}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default PortfolioPage;