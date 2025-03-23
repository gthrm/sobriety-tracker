import { render, screen, fireEvent } from '@testing-library/react';
import { StreakCounter } from '../StreakCounter';

describe('StreakCounter', () => {
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render initial state correctly', () => {
    render(
      <StreakCounter
        streak={0}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={[]}
      />
    );

    expect(screen.getByRole('heading', { name: 'Start your journey today' })).toBeInTheDocument();
    expect(screen.getByText('I AM SOBER TODAY')).toBeInTheDocument();
    expect(screen.getByText('Every journey begins with a single step. You can do this!')).toBeInTheDocument();
  });

  it('should render streak state correctly', () => {
    render(
      <StreakCounter
        streak={5}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={[]}
      />
    );

    expect(screen.getByRole('heading', { name: '5 days sober' })).toBeInTheDocument();
    expect(screen.getByText('Stay strong - every day sober is a victory!')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(
      <StreakCounter
        streak={0}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={[]}
      />
    );

    fireEvent.click(screen.getByText('I AM SOBER TODAY'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should disable confirm button when already confirmed today', () => {
    render(
      <StreakCounter
        streak={1}
        onConfirm={mockOnConfirm}
        isConfirmedToday={true}
        confirmedDates={[]}
      />
    );

    const confirmButton = screen.getByText('CONFIRMED');
    expect(confirmButton).toBeDisabled();
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should highlight confirmed days in the week view', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const confirmedDates = [yesterday.toISOString().split('T')[0]];

    render(
      <StreakCounter
        streak={1}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={confirmedDates}
      />
    );

    // The week view should show one highlighted day (yesterday)
    const highlightedDays = document.querySelectorAll('.bg-orange-500');
    expect(highlightedDays).toHaveLength(1);
  });

  it('should open calendar view when calendar icon is clicked', () => {
    render(
      <StreakCounter
        streak={0}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={[]}
      />
    );

    const calendarButton = screen.getByLabelText('Open calendar');
    fireEvent.click(calendarButton);

    // CalendarView component should be rendered
    expect(screen.getByText('Your Sobriety Journey')).toBeInTheDocument();
  });

  it('should show correct streak text for different streak values', () => {
    const { rerender } = render(
      <StreakCounter
        streak={0}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={[]}
      />
    );
    expect(screen.getByRole('heading', { name: 'Start your journey today' })).toBeInTheDocument();

    rerender(
      <StreakCounter
        streak={1}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={[]}
      />
    );
    expect(screen.getByRole('heading', { name: '1 day sober' })).toBeInTheDocument();

    rerender(
      <StreakCounter
        streak={5}
        onConfirm={mockOnConfirm}
        isConfirmedToday={false}
        confirmedDates={[]}
      />
    );
    expect(screen.getByRole('heading', { name: '5 days sober' })).toBeInTheDocument();
  });
}); 