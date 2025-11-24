import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIAgent, { type AIAgentConfig, type AnalysisResult } from '../AIAgent';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('AIAgent Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the agent header', () => {
      render(<AIAgent />);
      expect(screen.getByText('AI Thesis Assessor')).toBeInTheDocument();
      expect(screen.getByText(/Upload your thesis document/i)).toBeInTheDocument();
    });

    it('displays file upload section in idle state', () => {
      render(<AIAgent />);
      expect(screen.getByText('Select Document')).toBeInTheDocument();
    });

    it('shows supported file formats', () => {
      render(<AIAgent />);
      expect(screen.getByText(/Supported formats/i)).toBeInTheDocument();
      expect(screen.getByText(/.pdf, .docx, .doc/i)).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('accepts valid file upload', async () => {
      const user = userEvent.setup();
      render(<AIAgent />);

      const file = new File(['test content'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('thesis.pdf')).toBeInTheDocument();
      });
    });

    it('displays file size after selection', async () => {
      const user = userEvent.setup();
      render(<AIAgent />);

      const file = new File(['x'.repeat(1024 * 1024)], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/MB/)).toBeInTheDocument();
      });
    });

    it('shows Start Analysis button after file selection', async () => {
      const user = userEvent.setup();
      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('Start Analysis')).toBeInTheDocument();
      });
    });
  });

  describe('File Validation', () => {
    it('rejects files exceeding size limit', async () => {
      const user = userEvent.setup();
      const config: AIAgentConfig = {
        maxFileSize: 1024, // 1KB limit
      };
      render(<AIAgent config={config} />);

      const largeFile = new File(['x'.repeat(2048)], 'large.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, largeFile);

      await waitFor(() => {
        expect(screen.getByText(/File size exceeds maximum/i)).toBeInTheDocument();
      });
    });

    it('rejects unsupported file formats', async () => {
      const user = userEvent.setup();
      render(<AIAgent />);

      const invalidFile = new File(['test'], 'thesis.txt', { type: 'text/plain' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, invalidFile);

      await waitFor(() => {
        expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Analysis Process', () => {
    it('displays processing state when analysis starts', async () => {
      const user = userEvent.setup();

      // Mock axios to delay response
      mockedAxios.post.mockImplementation(() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: createMockAnalysisResult(),
            });
          }, 100);
        })
      );

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      expect(screen.getByText('Processing Your Thesis')).toBeInTheDocument();
    });

    it('shows processing stages during analysis', async () => {
      const user = userEvent.setup();

      mockedAxios.post.mockImplementation(() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: createMockAnalysisResult(),
            });
          }, 100);
        })
      );

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      expect(screen.getByText(/Uploading document/i)).toBeInTheDocument();
    });

    it('calls API with correct endpoint', async () => {
      const user = userEvent.setup();
      const config: AIAgentConfig = {
        apiEndpoint: '/api/custom/analyze',
      };

      mockedAxios.post.mockResolvedValue({
        data: createMockAnalysisResult(),
      });

      render(<AIAgent config={config} />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          '/api/custom/analyze',
          expect.any(FormData),
          expect.any(Object)
        );
      });
    });
  });

  describe('Analysis Results', () => {
    it('displays results after successful analysis', async () => {
      const user = userEvent.setup();

      mockedAxios.post.mockResolvedValue({
        data: createMockAnalysisResult(),
      });

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
      });
    });

    it('displays overall score', async () => {
      const user = userEvent.setup();

      mockedAxios.post.mockResolvedValue({
        data: createMockAnalysisResult(85),
      });

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByText('85/100')).toBeInTheDocument();
      });
    });

    it('displays analysis sections', async () => {
      const user = userEvent.setup();

      mockedAxios.post.mockResolvedValue({
        data: createMockAnalysisResult(),
      });

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByText('Structure Analysis')).toBeInTheDocument();
        expect(screen.getByText('Content Quality')).toBeInTheDocument();
        expect(screen.getByText('Academic Rigor')).toBeInTheDocument();
      });
    });

    it('allows analyzing another document', async () => {
      const user = userEvent.setup();

      mockedAxios.post.mockResolvedValue({
        data: createMockAnalysisResult(),
      });

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByText('Analyze Another')).toBeInTheDocument();
      });

      const analyzeAnotherButton = screen.getByText('Analyze Another');
      await user.click(analyzeAnotherButton);

      expect(screen.getByText('Select Document')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message on API failure', async () => {
      const user = userEvent.setup();

      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByText('Analysis Failed')).toBeInTheDocument();
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it('allows retry after error', async () => {
      const user = userEvent.setup();

      mockedAxios.post.mockRejectedValue(new Error('Network error'));

      render(<AIAgent />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });

      const tryAgainButton = screen.getByText('Try Again');
      await user.click(tryAgainButton);

      expect(screen.getByText('Select Document')).toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('calls onAnalysisComplete callback with results', async () => {
      const user = userEvent.setup();
      const onAnalysisComplete = vi.fn();

      mockedAxios.post.mockResolvedValue({
        data: createMockAnalysisResult(),
      });

      render(<AIAgent onAnalysisComplete={onAnalysisComplete} />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(onAnalysisComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            overallScore: expect.any(Number),
          })
        );
      });
    });

    it('calls onError callback on failure', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();

      mockedAxios.post.mockRejectedValue(new Error('Test error'));

      render(<AIAgent onError={onError} />);

      const file = new File(['test'], 'thesis.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/Select Document/i) as HTMLInputElement;

      await user.upload(input, file);
      const startButton = screen.getByText('Start Analysis');
      await user.click(startButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible file input', () => {
      render(<AIAgent />);
      const input = screen.getByLabelText(/Select Document/i);
      expect(input).toBeInTheDocument();
    });

    it('buttons have accessible text', () => {
      render(<AIAgent />);
      const selectButton = screen.getByText('Select Document');
      expect(selectButton).toBeInTheDocument();
    });
  });
});

/**
 * Create mock analysis result for testing
 */
function createMockAnalysisResult(overallScore = 85): AnalysisResult {
  return {
    documentId: 'test-doc-123',
    timestamp: new Date(),
    overallScore,
    structureAnalysis: {
      score: 88,
      issues: ['Minor formatting inconsistency in chapter 3'],
      suggestions: [
        'Improve heading hierarchy consistency',
        'Add more descriptive section titles',
      ],
    },
    contentAnalysis: {
      score: 82,
      strengths: ['Strong methodology', 'Clear research questions'],
      weaknesses: ['Limited literature review', 'Insufficient data analysis'],
      improvements: [
        'Expand literature review section',
        'Include more recent sources',
        'Strengthen data interpretation',
      ],
    },
    academicRigor: {
      score: 85,
      citations: 45,
      methodology: 'Mixed methods approach',
      feedback: [
        'Good use of primary sources',
        'Consider adding more empirical data',
        'Methodology is well-documented',
      ],
    },
    feedback: {
      summary:
        'This thesis demonstrates strong foundational work with clear research objectives. The methodology is well-structured, though the literature review could be expanded to include more contemporary sources. Overall, a solid academic contribution that meets the required standards.',
      detailedComments: [
        'Introduction effectively establishes the research context',
        'Methodology section is comprehensive and well-justified',
        'Data analysis could benefit from additional statistical rigor',
        'Conclusions align well with stated research questions',
      ],
      gradingCriteria: {
        'Research Design': 85,
        'Literature Review': 78,
        'Methodology': 88,
        'Data Analysis': 82,
        'Writing Quality': 87,
        'Originality': 84,
      },
    },
  };
}
