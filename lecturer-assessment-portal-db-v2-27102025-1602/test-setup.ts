// FIX: The triple-slash directive `/// <reference types="@testing-library/jest-dom" />` is
// removed as it's not needed for Vitest and was causing a type definition error.
// The import below correctly extends Vitest's `expect` with DOM matchers.
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

// Mock the global fetch API for all tests
// FIX: Replaced 'global' with 'globalThis' for cross-environment compatibility.
globalThis.fetch = vi.fn();

// Mock lucide-react icons
vi.mock('lucide-react', async (importOriginal) => {
    const original = await importOriginal() as typeof import('lucide-react');
    const MockIcon: React.FC<React.SVGProps<SVGSVGElement> & { "data-testid"?: string }> = ({ "data-testid": dataTestid, ...props }) => {
        return React.createElement('svg', { 'data-testid': dataTestid || 'mock-icon', ...props });
    };
    
    const iconNames = [
        'Star', 'Calendar', 'BookOpen', 'Clock', 'MessageCircle', 'ThumbsUp',
        'ThumbsDown', 'FileText', 'BarChart2', 'Users', 'Search', 'Sun', 'Moon',
        'ChevronDown', 'HelpCircle', 'Download', 'Upload', 'UploadCloud', 'File',
        'X', 'Loader', 'CheckCircle', 'AlertCircle', 'AlertTriangle', 'BrainCircuit',
        'Cog', 'Info', 'LayoutDashboard', 'Filter', 'Shield', 'History', 'ChevronsUpDown',
        'ChevronUp', 'User', 'BarChart3', 'PieChart', 'BarChartHorizontal', 'ArrowLeft',
        'MessageSquare', 'Mail', 'Bot', 'Play', 'Server', 'Contrast', 'Camera',
        // Added new icons for branding update
        'Phone', 'Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Youtube'
    ] as const;

    type IconName = (typeof iconNames)[number];
    const icons: { [key in IconName]?: typeof MockIcon } = {};
    iconNames.forEach(name => {
        icons[name] = MockIcon;
    });

    return {
        ...original,
        ...icons,
    };
});