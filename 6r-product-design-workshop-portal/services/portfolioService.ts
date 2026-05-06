import { Portfolio, PortfolioSection, TemplateStyle } from '../types';

const PORTFOLIOS_STORAGE_KEY = 'mockPortfolios';

function getMockPortfolios(): Portfolio[] {
  const portfolios = localStorage.getItem(PORTFOLIOS_STORAGE_KEY);
  return portfolios ? JSON.parse(portfolios) : [];
}

function saveMockPortfolios(portfolios: Portfolio[]) {
  localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(portfolios));
}

export async function fetchUserPortfolio(userId: string): Promise<Portfolio | undefined> {
  const portfolios = getMockPortfolios();
  return portfolios.find(p => p.userId === userId);
}

export async function saveUserPortfolio(portfolio: Portfolio): Promise<Portfolio> {
  const portfolios = getMockPortfolios();
  const existingIndex = portfolios.findIndex(p => p.id === portfolio.id);

  if (existingIndex !== -1) {
    portfolios[existingIndex] = { ...portfolio, updatedAt: new Date() };
  } else {
    portfolios.push({ ...portfolio, createdAt: new Date(), updatedAt: new Date(), viewCount: 0, isPublic: false });
  }
  saveMockPortfolios(portfolios);
  return portfolio;
}

export async function createDefaultPortfolio(userId: string): Promise<Portfolio> {
  const defaultPortfolio: Portfolio = {
    id: `portfolio-${userId}`,
    userId: userId,
    title: 'My 6R Product Design Case Study',
    description: 'A compilation of design work completed through the 6R Product Design Workshop.',
    sections: [
      { id: 'cover', title: 'Cover Page', content: `User Name, Title, Date`, type: 'text' },
      { id: 'problem', title: 'Problem Statement', content: 'Extracted from R1 audit quest insights.', type: 'text' },
      { id: 'research', title: 'Research & Strategy', content: 'Insights from R2 Reimagine quest.', type: 'text' },
      { id: 'wireframes', title: 'Wireframes', content: [], type: 'image' },
      { id: 'designSystem', title: 'Design System', content: [], type: 'text' },
      { id: 'visualDesign', title: 'Visual Design', content: [], type: 'image' },
      { id: 'implementation', title: 'Implementation', content: 'Links/screenshots from R6 code.', type: 'text' },
      { id: 'reflection', title: 'Reflection', content: 'A summary of learnings and future steps.', type: 'text' },
    ],
    templateStyle: 'minimal',
    isPublic: false,
    viewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  saveMockPortfolios([
    ...getMockPortfolios().filter(p => p.userId !== userId), // Remove existing for this user
    defaultPortfolio,
  ]);
  return defaultPortfolio;
}

export async function updatePortfolioSection(userId: string, sectionId: string, newContent: string | string[]): Promise<Portfolio | undefined> {
  const portfolios = getMockPortfolios();
  const portfolio = portfolios.find(p => p.userId === userId);

  if (portfolio) {
    const updatedSections = portfolio.sections.map(sec =>
      sec.id === sectionId ? { ...sec, content: newContent } : sec
    );
    const updatedPortfolio = { ...portfolio, sections: updatedSections, updatedAt: new Date() };
    await saveUserPortfolio(updatedPortfolio);
    return updatedPortfolio;
  }
  return undefined;
}

export async function updatePortfolioSettings(userId: string, settings: { title?: string, description?: string, templateStyle?: TemplateStyle, isPublic?: boolean, publicToken?: string, sectionsToInclude?: string[] }): Promise<Portfolio | undefined> {
  const portfolios = getMockPortfolios();
  const portfolio = portfolios.find(p => p.userId === userId);

  if (portfolio) {
    let updatedPortfolio = { ...portfolio, updatedAt: new Date() };

    if (settings.title !== undefined) updatedPortfolio.title = settings.title;
    if (settings.description !== undefined) updatedPortfolio.description = settings.description;
    if (settings.templateStyle !== undefined) updatedPortfolio.templateStyle = settings.templateStyle;
    if (settings.isPublic !== undefined) {
      updatedPortfolio.isPublic = settings.isPublic;
      if (settings.isPublic && !updatedPortfolio.publicToken) {
        updatedPortfolio.publicToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      } else if (!settings.isPublic) {
        updatedPortfolio.publicToken = undefined; // Clear token if no longer public
      }
    }
    // Handle sectionsToInclude by filtering or adding sections
    if (settings.sectionsToInclude) {
        // This is a simplified approach. In a real app, you'd manage what sections are available
        // and which ones are included, potentially adding or removing based on settings.
        // For now, we'll just ensure core sections are present if not explicitly removed.
        // This logic is mostly for a "checkboxes" type of UI.
        const currentSectionsMap = new Map(updatedPortfolio.sections.map(s => [s.id, s]));
        const newSections: PortfolioSection[] = [];
        const allPossibleSectionIds = ['cover', 'problem', 'research', 'wireframes', 'designSystem', 'visualDesign', 'implementation', 'reflection']; // Define all possible sections
        for (const sectionId of allPossibleSectionIds) {
            if (settings.sectionsToInclude.includes(sectionId)) {
                if (currentSectionsMap.has(sectionId)) {
                    newSections.push(currentSectionsMap.get(sectionId)!);
                } else {
                    // Re-add a default if it was previously excluded and now included
                    newSections.push({ id: sectionId, title: sectionId.charAt(0).toUpperCase() + sectionId.slice(1), content: 'Default content for ' + sectionId, type: 'text' });
                }
            }
        }
        updatedPortfolio.sections = newSections;
    }


    await saveUserPortfolio(updatedPortfolio);
    return updatedPortfolio;
  }
  return undefined;
}

export async function uploadPortfolioImage(userId: string, file: File): Promise<string> {
  // Simulate S3 upload by converting to Base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
