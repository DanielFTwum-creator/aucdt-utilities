import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal component', () => {
    const onCloseMock = vi.fn();
    const onConfirmMock = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should not render when isOpen is false', () => {
        render(
            <ConfirmationModal
                isOpen={false}
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                title="Test Modal"
            >
                <p>Test content</p>
            </ConfirmationModal>
        );
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render with title and children when isOpen is true', () => {
        render(
            <ConfirmationModal
                isOpen={true}
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                title="Test Modal"
            >
                <p>Test content</p>
            </ConfirmationModal>
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Test Modal' })).toBeInTheDocument();
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should call onClose when the Cancel button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <ConfirmationModal
                isOpen={true}
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                title="Test Modal"
            >
                <p>Test content</p>
            </ConfirmationModal>
        );

        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm when the Confirm & Proceed button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <ConfirmationModal
                isOpen={true}
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                title="Test Modal"
            >
                <p>Test content</p>
            </ConfirmationModal>
        );

        await user.click(screen.getByRole('button', { name: /Confirm & Proceed/i }));
        expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });
    
    it('should call onClose when the overlay is clicked', async () => {
        const user = userEvent.setup();
        render(
            <ConfirmationModal
                isOpen={true}
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                title="Test Modal"
            >
                <p>Test content</p>
            </ConfirmationModal>
        );

        // Clicking the parent div which acts as the overlay
        await user.click(screen.getByRole('dialog').parentElement as HTMLElement);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});