import React, { useState, useRef } from 'react'

const FileUpload = ({ onFileSelect, currentFile, accept = "*" }) => {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <div
        className={`file-upload ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-icon">📁</div>
        <p>
          {currentFile 
            ? `Selected: ${currentFile.name}`
            : 'Click or drag file to upload'
          }
        </p>
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          Supports PDF, Images, Documents (max 15MB)
        </p>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="file-input"
      />
      
      {currentFile && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Remove File
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload