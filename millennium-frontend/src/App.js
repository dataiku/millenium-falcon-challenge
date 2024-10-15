import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    // Reset the result after selecting a new file.
    setResult('')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = async (event) => {
      const jsonContent = event.target.result;

      try {
        setLoading(true);
        setResult("Processing...")
        const response = await fetch('http://localhost:8080/millennium/traverse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonContent,
        });

        if (response.ok) {
          const data = await response.json();
          setResult(`Survival chances: ${data}%`);
        } else {
          setResult('Error: Could not process file');
        }
      } catch (error) {
        if (error.message === 'Failed to fetch') {
          setResult('Network error: Failed to connect to the server. Please ensure the backend is running.');
        } else {
          setResult(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false)
      }
    };
    reader.readAsText(file);
  }
  return (
      <div className="App">
        <div className="background-container">
          <h1>Welcome to the Star Wars Universe</h1>
          <p>May the force be with you!</p>
          <div className="form-container">
            <h2>Bring on the bounty hunters!</h2>
            <form onSubmit={handleSubmit}>
              <input type={"file"} accept={".json"} onChange={handleFileChange} data-testid="file-input"/>
              <button type={"submit"} disabled={!file || loading}>Submit</button>
            </form>
            <p>{result}</p> {/* Display the result here */}
          </div>
        </div>
      </div>
  )
      ;
}

export default App;
