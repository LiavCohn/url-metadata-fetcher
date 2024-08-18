import React, { useState } from 'react';
import axios from 'axios';
import UrlInput from './components/UrlInput';
import Loader from "./components/Loader"
import MetedataItem from "./components/MetedataItem"

import { ENV } from './env';
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

  const canSubmit = urls.length >= 3 && urls.every((url) => isValidUrl(url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMetadata([]);
    setLoading(true)
    
    try {
      const response = await axios.post(`${ENV}/fetch-metadata`, { urls });
      setMetadata(response.data);
    } catch (err) {
        // The error message can be found in err.response.data.error
        const errorMessage = err?.response?.data?.error || 'An unexpected error occurred';
        setError('An error occurred while fetching metadata: ' + errorMessage);
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
        {metadata.map((item, index) =>
          (<MetedataItem
            index={index}
            description={item.description}
            title={item.title}
            image={item.image} />
          ))}
        </div>
    </div>
  );
}

export default App;
