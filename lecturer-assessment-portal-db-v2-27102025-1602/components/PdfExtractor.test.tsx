import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PdfExtractor from './PdfExtractor';

// FIX: Replaced 'global' with 'globalThis' for cross-environment compatibility.
const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>;

describe('PdfExtractor component', () => {
    const onPdfUpdateMock = vi.fn();
    const onPdfErrorMock = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
    });

    const uploadFile = async (user: ReturnType<typeof userEvent.setup>) => {
        const fileContent = 'dummy content for size'; // 21 bytes
        const file = new File([fileContent], 'timetable.pdf', { type: 'application/pdf' });
        const fileInput = screen.getByLabelText(/Choose a PDF file/i) as HTMLInputElement;
        await user.upload(fileInput, file);
        return file;
    };


    it('should render correctly', () => {
        render(<PdfExtractor onPdfUpdate={onPdfUpdateMock} onPdfError={onPdfErrorMock} />);
        expect(screen.getByText(/Choose a PDF file/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Extract & Update Data/i })).toBeDisabled();
    });

    it('should enable extract button and show file details after a valid PDF file is selected', async () => {
        const user = userEvent.setup();
        render(<PdfExtractor onPdfUpdate={onPdfUpdateMock} onPdfError={onPdfErrorMock} />);
        await uploadFile(user);

        expect(screen.getByText('timetable.pdf')).toBeInTheDocument();
        expect(screen.getByText('21 Bytes')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Extract & Update Data/i })).toBeEnabled();
    });
    
    it('should show an error if a non-PDF file is selected', async () => {
        const user = userEvent.setup();
        render(<PdfExtractor onPdfUpdate={onPdfUpdateMock} onPdfError={onPdfErrorMock} />);
        const file = new File(['dummy'], 'image.png', { type: 'image/png' });
        const fileInput = screen.getByLabelText(/Choose a PDF file/i) as HTMLInputElement;
        await user.upload(fileInput, file);

        expect(await screen.findByText(/Please upload a valid PDF file./i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Extract & Update Data/i })).toBeDisabled();
    });

    it('should open the confirmation modal when "Extract & Update Data" is clicked', async () => {
        const user = userEvent.setup();
        render(<PdfExtractor onPdfUpdate={onPdfUpdateMock} onPdfError={onPdfErrorMock} />);
        await uploadFile(user);
        await user.click(screen.getByRole('button', { name: /Extract & Update Data/i }));
        
        expect(screen.getByRole('heading', { name: 'Confirm Data Update & Deletion' })).toBeInTheDocument();
    });
    
    it('should show progress and success states on confirmation', async () => {
        const user = userEvent.setup();
        const mockResponse = [{ programmeId: "mock_prog", programmeName: "Mock Programme", courses: [] }];
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        render(<PdfExtractor onPdfUpdate={onPdfUpdateMock} onPdfError={onPdfErrorMock} />);
        const file = await uploadFile(user);
        
        await user.click(screen.getByRole('button', { name: /Extract & Update Data/i }));
        await user.click(screen.getByRole('button', { name: /Confirm & Proceed/i }));

        // Check for processing state
        expect(screen.getByRole('button', { name: /Processing.../i })).toBeInTheDocument();
        expect(screen.getByText('Upload PDF')).toBeInTheDocument();
        
        // Wait for fetch to be called and state to update
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/v1/admin/curriculum/upload', expect.any(Object));
        });
        
        // Wait for success and check final message and callback
        await waitFor(() => {
            expect(onPdfUpdateMock).toHaveBeenCalledWith(mockResponse, file, expect.any(Number));
        });

        expect(await screen.findByText(/Found 1 programmes./i)).toBeInTheDocument();
    });
    
    it('should display an error message if the processing fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: async () => 'Internal Server Error',
        });

        const user = userEvent.setup();
        render(<PdfExtractor onPdfUpdate={onPdfUpdateMock} onPdfError={onPdfErrorMock} />);
        const file = await uploadFile(user);
        
        await user.click(screen.getByRole('button', { name: /Extract & Update Data/i }));
        await user.click(screen.getByRole('button', { name: /Confirm & Proceed/i }));

        await waitFor(() => {
             expect(onPdfErrorMock).toHaveBeenCalledWith(expect.any(Error), file);
        });

        expect(await screen.findByText(/Extraction failed: 500 - Internal Server Error/i)).toBeInTheDocument();
        expect(onPdfUpdateMock).not.toHaveBeenCalled();
    });
});