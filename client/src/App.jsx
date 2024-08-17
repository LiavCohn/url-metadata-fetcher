import React, { useState } from 'react';
import axios from 'axios';
import UrlInput from './components/UrlInput';
import Loader from "./components/Loader"
import './styles/app.css';

function App() {
  const [urls, setUrls] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleDeleteUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  //helper function to determine if the input is a valid url
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const deployment = true
  const url = deployment ? "https://url-metadata-fetcher-backend.vercel.app" : "http://localhost:5000"
  const canSubmit = urls.length >= 3 && urls.every((url) => isValidUrl(url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMetadata([]);
    setLoading(true)

    try {
      const response = await axios.post(`${url}/fetch-metadata`, { urls });
      if (!response.ok) {
        const result = await response.json();
        setError(result?.error || 'An unexpected error occurred');
      }
      else {
        setMetadata(response.data);
      }
    } catch (err) {
      setError('An error occurred while fetching metadata.');
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div>
      <div className="form-container">
        <h1>URL Metadata Fetcher</h1>
        <br></br>
          {urls.map((url, index) => (
            <UrlInput
              key={index}
              index={index}
              value={url}
              onChange={handleUrlChange}
              onDelete={handleDeleteUrl}
              isValid={isValidUrl(url)}
            />
          ))}
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={handleAddUrl}>
            Add URL
          </button>
          <button type="submit" disabled={!canSubmit}>
            Submit
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
      {loading && <Loader></Loader>}
        <div className="metadata-container">
          {metadata.map((item, index) => (
            <div key={index} className="metadata-item">
              <h2>{item.title || 'No Title Available'}</h2>
              <br></br>
              <p>{item.description || 'No Description Available'}</p>
              {item.image && <img src={item.image} alt="Preview" />}
              {item.error && <p className="error">{item.error}</p>}
            </div>
          ))}
        </div>
    </div>
  );
}

export default App;
