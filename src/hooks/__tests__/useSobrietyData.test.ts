import { renderHook, act } from '@testing-library/react';
import { useSobrietyData } from '../useSobrietyData';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useSobrietyData', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSobrietyData());

    expect(result.current.data).toEqual({
      startDate: expect.any(String),
      lastConfirmation: new Date(0).toISOString(),
      streak: 0,
      history: [],
    });
  });

  it('should confirm a day and update streak', () => {
    const { result } = renderHook(() => useSobrietyData());

    act(() => {
      result.current.confirmDay();
    });

    expect(result.current.data.streak).toBe(1);
    expect(result.current.data.history).toHaveLength(1);
    expect(result.current.isConfirmedToday).toBe(true);
  });

  it('should not allow multiple confirmations in the same day', () => {
    const { result } = renderHook(() => useSobrietyData());

    act(() => {
      result.current.confirmDay();
      result.current.confirmDay();
    });

    expect(result.current.data.streak).toBe(1);
    expect(result.current.data.history).toHaveLength(1);
  });

  it('should reset streak when more than one day has passed', () => {
    const { result } = renderHook(() => useSobrietyData());

    // First confirmation
    act(() => {
      result.current.confirmDay();
    });

    // Simulate time passing (2 days)
    act(() => {
      jest.advanceTimersByTime(2 * 24 * 60 * 60 * 1000);
      // Force effect to run
      jest.runOnlyPendingTimers();
    });

    // Re-render to trigger the effect
    act(() => {
      // Force a re-render by confirming the day
      result.current.confirmDay();
    });

    expect(result.current.data.streak).toBe(1); // Should be 1 because we just confirmed
  });

  it('should maintain streak for consecutive days', () => {
    const { result } = renderHook(() => useSobrietyData());

    // First confirmation
    act(() => {
      result.current.confirmDay();
    });

    // Simulate time passing (1 day)
    act(() => {
      jest.advanceTimersByTime(24 * 60 * 60 * 1000);
    });

    // Second confirmation
    act(() => {
      result.current.confirmDay();
    });

    expect(result.current.data.streak).toBe(2);
    expect(result.current.data.history).toHaveLength(2);
  });

  it('should export and import data correctly', () => {
    const { result } = renderHook(() => useSobrietyData());

    // Set up some data
    act(() => {
      result.current.confirmDay();
    });

    const exportedData = result.current.exportData();
    
    act(() => {
      result.current.importData(exportedData);
    });

    expect(result.current.data.streak).toBe(1);
    expect(result.current.data.history).toHaveLength(1);
  });

  it('should handle invalid import data', () => {
    const { result } = renderHook(() => useSobrietyData());

    let importSuccess = false;
    act(() => {
      importSuccess = result.current.importData('invalid json');
    });

    expect(importSuccess).toBe(false);
    expect(result.current.data.streak).toBe(0);
    expect(result.current.data.history).toHaveLength(0);
  });

  it('should reset streak when resetStreak is called', () => {
    const { result } = renderHook(() => useSobrietyData());

    // Set up some data
    act(() => {
      result.current.confirmDay();
    });

    act(() => {
      result.current.resetStreak();
    });

    expect(result.current.data.streak).toBe(0);
    expect(result.current.data.history).toHaveLength(0);
    expect(result.current.isConfirmedToday).toBe(false);
  });
}); 