import { ShowcaseProject, ProjectStatus } from '../types'; // Fix: Import ProjectStatus
import { MOCK_SHOWCASE_PROJECTS, BADGE_THRESHOLDS } from '../constants'; // Import BADGE_THRESHOLDS

const SHOWCASE_STORAGE_KEY = 'mockShowcaseProjects';

// Initialize with mock data if not already present
function initializeShowcaseProjects() {
  if (!localStorage.getItem(SHOWCASE_STORAGE_KEY)) {
    // Fix: Add badgeLevel to mock projects for filtering consistency
    const projectsWithBadges = MOCK_SHOWCASE_PROJECTS.map(p => ({
      ...p,
      badgeLevel: getBadgeLevel(Math.floor(Math.random() * 100)), // Simulate a random badge level
    }));
    localStorage.setItem(SHOWCASE_STORAGE_KEY, JSON.stringify(projectsWithBadges));
  }
}
initializeShowcaseProjects();

function getShowcaseProjects(): ShowcaseProject[] {
  const projects = localStorage.getItem(SHOWCASE_STORAGE_KEY);
  return projects ? JSON.parse(projects) : [];
}

function saveShowcaseProjects(projects: ShowcaseProject[]) {
  localStorage.setItem(SHOWCASE_STORAGE_KEY, JSON.stringify(projects));
}

// Helper to determine badge level - duplicated from moduleService for now for self-containment
function getBadgeLevel(score: number): 'bronze' | 'silver' | 'gold' | 'none' {
  if (score >= BADGE_THRESHOLDS.gold) return 'gold';
  if (score >= BADGE_THRESHOLDS.silver) return 'silver';
  if (score >= BADGE_THRESHOLDS.bronze) return 'bronze';
  return 'none';
}

interface FilterOptions {
  sortBy?: 'recent' | 'popular' | 'featured';
  filterByModule?: string;
  filterByBadge?: 'bronze' | 'silver' | 'gold' | 'none';
  searchKeyword?: string;
}

export async function fetchShowcaseProjects(options?: FilterOptions): Promise<ShowcaseProject[]> {
  let projects = getShowcaseProjects().filter(p => p.status === 'approved'); // Only show approved

  // Filter
  if (options?.filterByModule) {
    projects = projects.filter(p => p.moduleNumber === options.filterByModule);
  }
  if (options?.filterByBadge) {
    // Fix: Now `ShowcaseProject` has `badgeLevel`, so this filter can work
    projects = projects.filter(p => p.badgeLevel === options.filterByBadge);
  }
  if (options?.searchKeyword) {
    const keyword = options.searchKeyword.toLowerCase();
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword) ||
      p.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
      p.author.toLowerCase().includes(keyword)
    );
  }

  // Sort
  if (options?.sortBy === 'recent') {
    projects.sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
  } else if (options?.sortBy === 'popular') {
    projects.sort((a, b) => b.viewCount - a.viewCount);
  } else if (options?.sortBy === 'featured') {
    projects.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  return projects;
}

export async function fetchShowcaseProjectById(projectId: string): Promise<ShowcaseProject | undefined> {
  const projects = getShowcaseProjects();
  const project = projects.find(p => p.id === projectId);
  if (project) {
    // Simulate view count increment
    project.viewCount = (project.viewCount || 0) + 1;
    saveShowcaseProjects(projects); // Persist updated view count
  }
  return project;
}

export async function submitShowcaseProject(project: ShowcaseProject): Promise<ShowcaseProject> {
  const projects = getShowcaseProjects();
  // Fix: Ensure status is of type ProjectStatus
  const newProject: ShowcaseProject = {
    ...project,
    id: `showcase-${Date.now()}`,
    status: 'pending' as ProjectStatus, // Fix: Explicitly cast to ProjectStatus
    publishedAt: undefined,
    viewCount: 0,
    badgeLevel: project.badgeLevel || 'none', // Ensure badgeLevel is set
  };
  projects.push(newProject);
  saveShowcaseProjects(projects);
  return newProject;
}

export async function updateShowcaseProjectStatus(projectId: string, status: 'approved' | 'rejected'): Promise<ShowcaseProject | undefined> {
  const projects = getShowcaseProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  if (projectIndex !== -1) {
    projects[projectIndex].status = status;
    if (status === 'approved') {
      projects[projectIndex].publishedAt = new Date();
    }
    saveShowcaseProjects(projects);
    return projects[projectIndex];
  }
  return undefined;
}