import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';

// Helper component that throws on demand
const ProblemChild = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Explosion in child component!');
  }
  return <div>Safe Child Content</div>;
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error in Vitest logs during expected boundary throws
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('renders children normally when no exception is thrown', () => {
    render(
      <ErrorBoundary sectionName="Test View">
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Child Content')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('catches runtime exception and renders default error shield with section name', () => {
    render(
      <ErrorBoundary sectionName="Interactive Map">
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Safe Child Content')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong in this view/i)).toBeInTheDocument();
    expect(screen.getByText('Interactive Map Error Boundary')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload App/i })).toBeInTheDocument();
  });

  it('invokes onError callback with error details when an error occurs', () => {
    const onErrorMock = vi.fn();

    render(
      <ErrorBoundary sectionName="Telemetry Test" onError={onErrorMock}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onErrorMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock.mock.calls[0][0].message).toBe('Explosion in child component!');
  });

  it('renders custom fallback function when provided', () => {
    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <p>Custom Fallback: {error.message}</p>
            <button onClick={reset}>Reset Me</button>
          </div>
        )}
      >
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Fallback: Explosion in child component!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Me/i })).toBeInTheDocument();
  });

  it('recovers and resets boundary when reset button is clicked and state recovers', () => {
    // Dynamic component that can fix itself
    const RecoverableWidget = () => {
      const [hasExploded, setHasExploded] = useState(true);
      return (
        <div>
          {hasExploded ? (
            <ProblemChild shouldThrow={true} />
          ) : (
            <div>Successfully Recovered Content</div>
          )}
          <button onClick={() => setHasExploded(false)}>Fix Bug</button>
        </div>
      );
    };

    const onResetMock = vi.fn();

    const { rerender } = render(
      <ErrorBoundary onReset={onResetMock}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Rerender with fixed safe child before triggering reset
    rerender(
      <ErrorBoundary onReset={onResetMock}>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole('button', { name: /Try Again/i }));
    expect(onResetMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Safe Child Content')).toBeInTheDocument();
  });

  it('supports withErrorBoundary higher order component wrapper', () => {
    const SafeComponent = withErrorBoundary(ProblemChild, 'HOC Section');

    render(<SafeComponent shouldThrow={false} />);
    expect(screen.getByText('Safe Child Content')).toBeInTheDocument();
  });
});
