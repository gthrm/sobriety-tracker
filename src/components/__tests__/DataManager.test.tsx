import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataManager } from '../DataManager';

// Mock URL and Blob APIs
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
const mockBlob = jest.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;
global.Blob = mockBlob;

// Mock File API
interface MockFileReader extends FileReader {
  fileContent?: string;
}

const mockFileReader: MockFileReader = {
  readAsText: jest.fn(),
  onload: null,
  result: '',
  EMPTY: 0,
  LOADING: 1,
  DONE: 2,
  readyState: 0,
  error: null,
  abort: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  readAsBinaryString: jest.fn(),
  readAsDataURL: jest.fn(),
};

global.FileReader = jest.fn(() => mockFileReader);

describe('DataManager', () => {
  const mockOnExport = jest.fn();
  const mockOnImport = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('mock-url');
    mockBlob.mockImplementation((data) => ({ data }));
    mockFileReader.readAsText.mockImplementation(function(this: MockFileReader) {
      this.result = this.fileContent || '';
      this.onload?.();
    });
  });

  it('should render export and import buttons', () => {
    render(
      <DataManager
        onExport={mockOnExport}
        onImport={mockOnImport}
      />
    );

    expect(screen.getByText('Export Data')).toBeInTheDocument();
    expect(screen.getByText('Import Data')).toBeInTheDocument();
  });

  it('should call onExport when export button is clicked', () => {
    mockOnExport.mockReturnValue('{"test": "data"}');
    
    render(
      <DataManager
        onExport={mockOnExport}
        onImport={mockOnImport}
      />
    );

    fireEvent.click(screen.getByText('Export Data'));
    expect(mockOnExport).toHaveBeenCalledTimes(1);
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('should handle file import', async () => {
    mockOnImport.mockReturnValue(true);
    const fileContent = '{"test": "data"}';
    
    render(
      <DataManager
        onExport={mockOnExport}
        onImport={mockOnImport}
      />
    );

    const file = new File([fileContent], 'test.json', { type: 'application/json' });
    const input = screen.getByLabelText('Import Data');
    
    // Set up the file content for the FileReader
    mockFileReader.fileContent = fileContent;
    
    await fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(mockOnImport).toHaveBeenCalledWith(fileContent);
    });
  });

  it('should show error message when import fails', async () => {
    mockOnImport.mockReturnValue(false);
    const fileContent = 'invalid json';
    
    render(
      <DataManager
        onExport={mockOnExport}
        onImport={mockOnImport}
      />
    );

    const file = new File([fileContent], 'test.json', { type: 'application/json' });
    const input = screen.getByLabelText('Import Data');
    
    // Set up the file content for the FileReader
    mockFileReader.fileContent = fileContent;
    
    await fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('Invalid data format. Please try again.')).toBeInTheDocument();
    });
  });

  it('should clear error message on successful import', async () => {
    mockOnImport.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const invalidContent = 'invalid json';
    const validContent = '{"test": "data"}';
    
    render(
      <DataManager
        onExport={mockOnExport}
        onImport={mockOnImport}
      />
    );

    const input = screen.getByLabelText('Import Data');
    
    // First try with invalid data
    const invalidFile = new File([invalidContent], 'test.json', { type: 'application/json' });
    mockFileReader.fileContent = invalidContent;
    await fireEvent.change(input, { target: { files: [invalidFile] } });
    await waitFor(() => {
      expect(screen.getByText('Invalid data format. Please try again.')).toBeInTheDocument();
    });

    // Then try with valid data
    const validFile = new File([validContent], 'test.json', { type: 'application/json' });
    mockFileReader.fileContent = validContent;
    await fireEvent.change(input, { target: { files: [validFile] } });
    await waitFor(() => {
      expect(screen.queryByText('Invalid data format. Please try again.')).not.toBeInTheDocument();
    });
  });
}); 