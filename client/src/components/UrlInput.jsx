import React from 'react';
import "../styles/url.css"
function UrlInput({ index, value, onChange, onDelete, isValid }) {
  return (
    <div className="url-input-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`URL ${index + 1}`}
        className={`url-input ${isValid ? '' : 'invalid'}`}
      />
      <button type="button" onClick={() => onDelete(index)} className="delete-button">
        Delete
          </button>
      </div>
  );
}

export default UrlInput;
