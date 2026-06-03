import React, { useState, useEffect } from 'react'
import { notesAPI, authAPI } from '../utils/api'
import NoteCard from '../components/NoteCard'
import FileUpload from '../components/FileUpload'
import CreateAdmin from '../components/CreateAdmin'

const AdminDashboard = () => {
  const [notes, setNotes] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topic: '',
    category: 'general',
    tags: '',
    isPublished: true
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('notes') // 'notes' or 'users'

  useEffect(() => {
    fetchNotes()
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await notesAPI.getNotes()
      setNotes(response.data.notes)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
      setError('Failed to load notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers()
      setUsers(response.data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load users.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      topic: '',
      category: 'general',
      tags: '',
      isPublished: true
    })
    setSelectedFile(null)
    setEditingNote(null)
    setShowForm(false)
    setError('')
    setSuccess('')
  }

  const handleEdit = (note) => {
    setFormData({
      title: note.title,
      description: note.description,
      topic: note.topic,
      category: note.category || 'general',
      tags: note.tags?.join(', ') || '',
      isPublished: note.isPublished
    })
    setEditingNote(note)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return
    }

    try {
      await notesAPI.deleteNote(noteId)
      setNotes(notes.filter(note => note._id !== noteId))
      setSuccess('Note deleted successfully!')
    } catch (error) {
      console.error('Failed to delete note:', error)
      setError('Failed to delete note. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const submitData = {
        ...formData,
        tags: formData.tags
      }

      if (selectedFile) {
        submitData.file = selectedFile
      }

      let response
      if (editingNote) {
        response = await notesAPI.updateNote(editingNote._id, submitData)
        setNotes(notes.map(note => 
          note._id === editingNote._id ? response.data.note : note
        ))
        setSuccess('Note updated successfully!')
      } else {
        response = await notesAPI.createNote(submitData)
        setNotes([response.data.note, ...notes])
        setSuccess('Note created successfully!')
      }

      resetForm()
    } catch (error) {
      console.error('Failed to save note:', error)
      setError(error.response?.data?.message || 'Failed to save note. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    }))
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleAdminCreated = () => {
    fetchUsers() // Refresh users list
    setSuccess('New admin user created successfully!')
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Admin Dashboard 🛠️</h1>
        <p>Manage notes, users, and admin accounts</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('notes')}
          className={`btn ${activeTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📝 Manage Notes
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          👥 Manage Users
        </button>
      </div>

      {/* NOTES MANAGEMENT TAB */}
      {activeTab === 'notes' && (
        <>
          {/* Create/Edit Note Form */}
          {showForm && (
            <div className="admin-form card">
              <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter note title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Topic *</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., Mathematics, Physics"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter note description"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="general">General</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="programming">Programming</option>
                      <option value="business">Business</option>
                      <option value="arts">Arts</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., advanced, tutorial, basics"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    File Upload (Optional)
                    {selectedFile && (
                      <span style={{ color: '#28a745', marginLeft: '0.5rem' }}>
                        ✓ {selectedFile.name}
                      </span>
                    )}
                  </label>
                  <FileUpload 
                    onFileSelect={handleFileSelect}
                    currentFile={selectedFile}
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,.xls,.xlsx"
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                    />
                    Publish immediately
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (editingNote ? 'Update Note' : 'Create Note')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes Management Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="section-title">
              Manage Notes ({notes.length} total)
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={fetchNotes}
                className="btn btn-secondary"
              >
                Refresh
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                + Add New Note
              </button>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3>No Notes Yet</h3>
              <p>Start by creating your first note to share with users!</p>
              <button 
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Create Your First Note
              </button>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <NoteCard 
                  key={note._id} 
                  note={note}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* USERS MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <>
          <CreateAdmin onAdminCreated={handleAdminCreated} />
          
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3>User Management</h3>
            <p>Total Users: {users.length}</p>
            
            <div style={{ marginTop: '1rem' }}>
              {users.map(user => (
                <div key={user._id} style={{ 
                  padding: '1rem', 
                  border: '1px solid #e9ecef', 
                  borderRadius: '8px', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{user.username}</strong>
                    <span style={{ 
                      marginLeft: '1rem', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      background: user.role === 'admin' ? '#667eea' : '#6c757d',
                      color: 'white'
                    }}>
                      {user.role}
                    </span>
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminDashboard