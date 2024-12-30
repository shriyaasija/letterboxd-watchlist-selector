import React, {useState} from "react";

function App() {
  const [result, setResult] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Inside handle submit")

    const fileInput = document.getElementById("fileInput");

    if(!fileInput.files.length){
      setResult("Please upload file");
      return;
    }

    const formData = new FormData()
    formData.append('file', fileInput.files[0]);
    console.log(formData);

    try {
      const response = await fetch('/upload', {
        method: 'POST', 
        body: formData,
      });

      if(!response.ok){
        throw new Error("Failed to Upload File");
      }

      const data = await response.json();
      console.log(data.movie);
      setResult(`you should watch ${data.movie}!`);
      setLink(`${data.link}`)
    } catch (error) {
      setResult("Error: ", error.message)
    }
  };

  return (
    <div className="App">
      <h1>Upload watchlist.csv</h1>
      <form id="uploadForm" onSubmit={handleSubmit}>
        <input type="file" id="fileInput" accept=".csv" required/>
        <button type="submit">Upload</button>
      </form>
      <div id="result">{result}</div>
      <div>Letterboxd Link: 
      <a id="link" href={link}> {link}</a>
      </div>
    </div>
  );
}

export default App;
