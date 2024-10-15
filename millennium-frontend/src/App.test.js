import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  test('submit button is disabled when no file is selected', () => {
    // Render the component
    render(<App />);

    // Find the submit button
    const submitButton = screen.getByText(/submit/i);

    // Verify that the submit button is disabled when no file is selected
    expect(submitButton).toBeDisabled();
  });

  test('file input updates when a file is selected', () => {
    render(<App />);
    const fileInput = screen.getByTestId('file-input');
    const file = new File([JSON.stringify({ test: 'data' })], 'test.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    // The file input state is updated
    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files[0].name).toBe('test.json');
  });

  test('loading state shows when file is submitted', async () => {
    // Mock the fetch API call
    global.fetch = jest.fn(() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: () => Promise.resolve('Success response')
            });
          }, 2000);
        })
    );

    render(<App />);
    // Find the file input by its exact data-testid value
    const fileInput = screen.getByTestId('file-input');
    const file = new File([JSON.stringify({ test: 'data' })], 'test.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/submit/i));

    // Expect loading message
    await waitFor(() => expect(screen.getByText(/Processing.../i)).toBeInTheDocument());

    // Reset fetch mock
    global.fetch.mockClear();
  });

  test('Shows result on successful response', async() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve('Success response')
        })
    );

    render(<App />);
    // Find the file input by its exact data-testid value
    const fileInput = screen.getByTestId('file-input');
    const file = new File([JSON.stringify({ test: 'data' })], 'test.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => expect(screen.getByText(/result:/i)).toBeInTheDocument());
  })

  test('Displays error message when API call fails', async () => {
    // Mock a failed fetch response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      text: async () => 'Failed to process file',
    });

    render(<App />);
    const fileInput = screen.getByTestId('file-input');
    const file = new File([JSON.stringify({ test: 'data' })], 'test.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/submit/i));

    // Wait for the error to be displayed
    await waitFor(() => expect(screen.getByText(/Error: Could not process file/i)).toBeInTheDocument());
  });
});

