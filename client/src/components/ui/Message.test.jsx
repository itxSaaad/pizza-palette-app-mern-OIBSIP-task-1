import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Message from './Message';

afterEach(() => {
  vi.useRealTimers();
});

describe('Message auto variant inference', () => {
  it('renders a plain string as an error alert', () => {
    render(<Message>Something went wrong</Message>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Something went wrong');
    expect(screen.getByText(/Error/)).toBeInTheDocument();
  });

  it('renders a legacy { status, message } 4xx error as a warning', () => {
    render(<Message>{{ status: 400, message: 'Bad request' }}</Message>);
    expect(screen.getByText(/Warning/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Bad request');
  });

  it('renders a legacy { status, message } 5xx error as an error', () => {
    render(<Message>{{ status: 500, message: 'Server exploded' }}</Message>);
    expect(screen.getByText(/Error/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Server exploded');
  });

  it('renders a { success: true, message } object as a success alert', () => {
    render(<Message>{{ success: true, message: 'Order placed!' }}</Message>);
    expect(screen.getByText(/Success/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Order placed!');
  });

  it('renders a structured API validation error with field-level details', () => {
    const apiError = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      details: [{ field: 'email', message: 'Invalid email address' }],
    };
    render(<Message>{apiError}</Message>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid input');
    expect(alert).toHaveTextContent('email');
    expect(alert).toHaveTextContent('Invalid email address');
    // VALIDATION_* codes are surfaced as a warning, not a hard error.
    expect(screen.getByText(/Warning/)).toBeInTheDocument();
  });

  it('renders an auth error code as a warning', () => {
    render(<Message>{{ code: 'AUTH_ERROR', message: 'Please log in' }}</Message>);
    expect(screen.getByText(/Warning/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Please log in');
  });
});

describe('Message interactions', () => {
  it('calls onClose and dismisses the alert when the close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Message onClose={onClose}>Dismiss me</Message>);

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('auto-dismisses after 8 seconds', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Message onClose={onClose}>Temporary message</Message>);

    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(7999);
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not auto-dismiss before the timer elapses and clears the timer on unmount', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const { unmount } = render(<Message onClose={onClose}>Still here</Message>);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('supports being closed via fireEvent as well', () => {
    const onClose = vi.fn();
    render(<Message onClose={onClose}>Click to close</Message>);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
