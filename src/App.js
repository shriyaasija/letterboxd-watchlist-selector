import { useState } from "react";

function App() {
  const [result, setResult] = useState('');
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileUploadForm');

    if(!fileInput.files.length){
      setResult('');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if(!response.ok){
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setResult(`${data.movie}`);
    } catch (error) {
      setResult(error.message);
    }
  };

  return (
    <div className="App">
      <h1>Upload file</h1>
      <form id='fileUploadForm' onSubmit={handleSubmit}>
        <input type='file' accept='.csv' id='uploadedFile' required/>
        <button type='submit'>Upload</button>
      </form>
      <div id='result'></div>
    </div>
  );
}

export default App;
