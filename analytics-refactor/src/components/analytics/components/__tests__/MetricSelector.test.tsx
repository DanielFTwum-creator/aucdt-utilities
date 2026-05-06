import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MetricSelector } from '../MetricSelector';

const ALL_KEYS = ['signups', 'applicants', 'accepted', 'rejected', 'waitlisted', 'registered'];

describe('MetricSelector', () => {
  it('renders All and all individual metric buttons', () => {
    render(<MetricSelector selectedMetrics={['all']} onChange={() => {}} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Signups')).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Registered')).toBeInTheDocument();
  });

  it('marks All button as pressed when selectedMetrics is ["all"]', () => {
    render(<MetricSelector selectedMetrics={['all']} onChange={() => {}} />);
    expect(screen.getByText('All').closest('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onChange when a metric is deselected from "all" state', () => {
    const onChange = vi.fn();
    render(<MetricSelector selectedMetrics={['all']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Signups'));
    expect(onChange).toHaveBeenCalledOnce();
    const called = onChange.mock.calls[0][0] as string[];
    expect(called).not.toContain('signups');
    expect(called.length).toBe(ALL_KEYS.length - 1);
  });

  it('calls onChange with ["all"] when All button is clicked', () => {
    const onChange = vi.fn();
    render(<MetricSelector selectedMetrics={['applicants', 'accepted']} onChange={onChange} />);
    fireEvent.click(screen.getByText('All'));
    expect(onChange).toHaveBeenCalledWith(['all']);
  });

  it('adds a metric when an inactive one is clicked', () => {
    const onChange = vi.fn();
    render(<MetricSelector selectedMetrics={['applicants']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Accepted'));
    expect(onChange).toHaveBeenCalledOnce();
    const called = onChange.mock.calls[0][0] as string[];
    expect(called).toContain('applicants');
    expect(called).toContain('accepted');
  });

  it('does not allow deselecting the last metric', () => {
    const onChange = vi.fn();
    render(<MetricSelector selectedMetrics={['applicants']} onChange={onChange} />);
    fireEvent.click(screen.getByText('Applicants'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('has role="group" with aria-labelledby for accessibility', () => {
    const { container } = render(<MetricSelector selectedMetrics={['all']} onChange={() => {}} />);
    const group = container.querySelector('[role="group"]');
    expect(group).not.toBeNull();
    expect(group).toHaveAttribute('aria-labelledby');
  });
});
