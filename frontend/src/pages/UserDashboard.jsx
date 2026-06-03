import React, { useState, useEffect } from 'react'
import { notesAPI } from '../utils/api'
import NoteCard from '../components/NoteCard'

const UserDashboard = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTopic, setFilterTopic] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

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

  // Get unique topics for filter
  const topics = [...new Set(notes.map(note => note.topic))]

  // Filter notes based on search and topic
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = !filterTopic || note.topic === filterTopic
    return matchesSearch && matchesTopic
  })

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
        <h1>My Notes Dashboard 📚</h1>
        <p>Access all available notes and resources</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group">
            <label className="form-label">Search Notes</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Search by title or description..."
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Filter by Topic</label>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="form-input"
            >
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ color: '#666' }}>
            Showing {filteredNotes.length} of {notes.length} notes
          </span>
          <button 
            onClick={fetchNotes}
            className="btn btn-secondary"
            style={{ padding: '8px 16px' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="notes-section">
        <h2 className="section-title">Available Notes</h2>
        
        {filteredNotes.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <h3>No Notes Found</h3>
            <p>
              {notes.length === 0 
                ? "No notes have been uploaded yet. Check back later!"
                : "No notes match your search criteria. Try adjusting your filters."
              }
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => (
              <NoteCard 
                key={note._id} 
                note={note}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard