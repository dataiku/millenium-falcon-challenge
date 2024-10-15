import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setResult('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const jsonContent = event.target.result;

      try {
        const response = await fetch('http://localhost:8080/millennium/traverse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonContent,
        });

        if (response.ok) {
          const data = await response.json();
          setResult(`result: ${data}`);
        } else {
          setResult('Error: Could not process file');
        }
      } catch (error) {
        if (error.message === 'Failed to fetch') {
          setResult('Network error: Failed to connect to the server. Please ensure the backend is running.');
        } else {
          setResult(`Error: ${error.message}`);
        }
      }
    };
    reader.readAsText(file);
  }
  return (
    <div className="App">
      <h1>Upload JSON file</h1>
      <form onSubmit={handleSubmit}>
        <input type={"file"} accept={".json"} onChange={handleFileChange} />
        <button type={"submit"}>Submit</button>
      </form>
      <p>{result}</p> {/* Display the result here */}
    </div>
  );
}

export default App;
