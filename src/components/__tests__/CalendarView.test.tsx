import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarView } from '../CalendarView';

describe('CalendarView', () => {
  const mockOnClose = jest.fn();
  const confirmedDates = ['2024-03-20', '2024-03-21'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render calendar dialog when isOpen is true', () => {
    render(
      <CalendarView
        isOpen={true}
        onClose={mockOnClose}
        confirmedDates={confirmedDates}
      />
    );

    expect(screen.getByText('Your Sobriety Journey')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <CalendarView
        isOpen={false}
        onClose={mockOnClose}
        confirmedDates={confirmedDates}
      />
    );

    expect(screen.queryByText('Your Sobriety Journey')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <CalendarView
        isOpen={true}
        onClose={mockOnClose}
        confirmedDates={confirmedDates}
      />
    );

    const closeButton = screen.getByRole('button', { 
      name: /close/i 
    });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show correct month and year', () => {
    render(
      <CalendarView
        isOpen={true}
        onClose={mockOnClose}
        confirmedDates={confirmedDates}
      />
    );

    const today = new Date();
    const monthYear = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    const monthYearParts = monthYear.split(' ');
    
    // Check for month and year separately since they might be in different elements
    expect(screen.getByText(monthYearParts[0], { exact: false })).toBeInTheDocument();
    expect(screen.getByText(monthYearParts[1], { exact: false })).toBeInTheDocument();
  });

  it('should allow navigation between months', () => {
    render(
      <CalendarView
        isOpen={true}
        onClose={mockOnClose}
        confirmedDates={confirmedDates}
      />
    );

    const prevButton = screen.getByRole('button', { name: '‹' }); // Previous month button
    const nextButton = screen.getByRole('button', { name: '›' }); // Next month button

    // Store initial month/year text
    const initialLabel = screen.getByLabelText('calendar navigation');
    expect(initialLabel).toHaveTextContent(/March 2025/);

    // Navigate to next month
    fireEvent.click(nextButton);
    const nextLabel = screen.getByLabelText('calendar navigation');
    expect(nextLabel).toHaveTextContent(/April 2025/);

    // Navigate back to previous month
    fireEvent.click(prevButton);
    const prevLabel = screen.getByLabelText('calendar navigation');
    expect(prevLabel).toHaveTextContent(/March 2025/);
  });

  it('should show week days correctly', () => {
    render(
      <CalendarView
        isOpen={true}
        onClose={mockOnClose}
        confirmedDates={confirmedDates}
      />
    );

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    weekDays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });
}); 