import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { ShowcaseProject } from '../types';
import * as showcaseService from '../services/showcaseService';
import { Search, Filter, SlidersHorizontal, Eye } from 'lucide-react';
import { MODULES_DATA } from '../constants';
import { Link } from 'react-router-dom';

interface ShowcaseCardProps {
  project: ShowcaseProject;
  onViewDetails: (project: ShowcaseProject) => void;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ project, onViewDetails }) => (
  <Card className="flex flex-col overflow-hidden h-full">
    <img
      src={project.heroImages[0]}
      alt={project.title}
      className="w-full h-48 object-cover rounded-t-lg mb-4"
    />
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">{project.title}</h3>
        <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark mb-3 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">By {project.author}</span>
        <Button variant="outline" size="sm" onClick={() => onViewDetails(project)}>
          <Eye size={16} className="mr-1" /> View Project
        </Button>
      </div>
    </div>
  </Card>
);

const ShowcasePage: React.FC = () => {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'featured'>('recent');
  const [filterByModule, setFilterByModule] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    const fetchedProjects = await showcaseService.fetchShowcaseProjects({
      sortBy,
      filterByModule,
      searchKeyword,
    });
    setProjects(fetchedProjects);
    setIsLoading(false);
  }, [sortBy, filterByModule, searchKeyword]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleViewDetails = (project: ShowcaseProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const moduleOptions = MODULES_DATA.map(module => ({
    value: module.id,
    label: `${module.id}: ${module.name}`
  }));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-text-light dark:text-text-dark mb-6">Community Showcase</h1>
        <p className="text-lg text-subtle-text-light dark:text-subtle-text-dark mb-8">
          Explore amazing projects from fellow learners and get inspired!
        </p>

        {/* Filters and Search */}
        <Card className="mb-8 p-6">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <Input
              label="Search Keywords"
              type="text"
              placeholder="e.g., e-commerce, mobile, dashboard"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              id="search-keyword"
              className="md:col-span-2"
            />
            <Select
              label="Sort By"
              options={[
                { value: 'recent', label: 'Recent' },
                { value: 'popular', label: 'Popular' },
                { value: 'featured', label: 'Featured' },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'featured')}
              id="sort-by"
            />
            <Select
              label="Filter By Module"
              options={[{ value: '', label: 'All Modules' }, ...moduleOptions]}
              value={filterByModule}
              onChange={(e) => setFilterByModule(e.target.value)}
              id="filter-by-module"
            />
            <Button type="submit" className="md:col-span-1 lg:col-span-4 mt-4 lg:mt-0">
              <Search size={18} className="mr-2" /> Apply Filters
            </Button>
          </form>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map(project => (
                <ShowcaseCard key={project.id} project={project} onViewDetails={handleViewDetails} />
              ))
            ) : (
              <p className="col-span-full text-center text-subtle-text-light dark:text-subtle-text-dark">No projects found matching your criteria.</p>
            )}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedProject.title}>
          <div className="space-y-4">
            <img src={selectedProject.heroImages[0]} alt={selectedProject.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-text-light dark:text-text-dark">{selectedProject.title}</h3>
            <p className="text-subtle-text-light dark:text-subtle-text-dark">{selectedProject.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tags.map(tag => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark">
              By <span className="font-semibold">{selectedProject.author}</span>
              {selectedProject.publishedAt && ` on ${new Date(selectedProject.publishedAt).toLocaleDateString()}`}
            </p>
            {selectedProject.portfolioLink && (
              <Link to={selectedProject.portfolioLink} onClick={() => setIsModalOpen(false)} className="block mt-4">
                <Button variant="primary" size="sm">
                  View Full Portfolio
                </Button>
              </Link>
            )}
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default ShowcasePage;