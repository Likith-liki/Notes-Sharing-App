import React from 'react'
import { useAuth } from '../context/AuthContext'
import { notesAPI } from '../utils/api'

const NoteCard = ({ note, onEdit, onDelete, showActions = false }) => {
  const { isAdmin } = useAuth()

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📕',
      image: '🖼️',
      document: '📄',
      spreadsheet: '📊',
      text: '📝'
    }
    return icons[fileType] || '📁'
  }

  const handleDownload = async () => {
    try {
      const response = await notesAPI.downloadFile(note._id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', note.title + (note.fileType === 'pdf' ? '.pdf' : ''))
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download file')
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <div className="card note-card">
      <div className="note-header">
        <div style={{ flex: 1 }}>
          <h3 className="note-title">{note.title}</h3>
          <span className="note-topic">{note.topic}</span>
        </div>
        {note.file && (
          <div 
            className={`file-icon ${note.fileType}`}
            title={note.fileType?.toUpperCase()}
          >
            {getFileIcon(note.fileType)}
          </div>
        )}
      </div>

      <p className="note-description">{note.description}</p>

      <div className="note-footer">
        <div className="note-meta">
          {note.file && (
            <div>
              <strong>{note.fileType?.toUpperCase()}</strong>
              {note.fileSize && ` • ${formatFileSize(note.fileSize)}`}
            </div>
          )}
          <div>By {note.createdBy?.username}</div>
        </div>

        <div className="note-actions">
          {note.file && (
            <button 
              onClick={handleDownload}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Download
            </button>
          )}
          {showActions && isAdmin && (
            <>
              <button 
                onClick={() => onEdit(note)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(note._id)}
                className="btn btn-danger"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoteCard