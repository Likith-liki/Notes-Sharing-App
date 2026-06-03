import React, { useState } from 'react'
import { authAPI } from '../utils/api'

const CreateAdmin = ({ onAdminCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setMessage('')
    setError('')
  }

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.createAdmin({
        username: formData.username,
        password: formData.password
      })
      
      setMessage('Admin user created successfully!')
      setFormData({ username: '', password: '', confirmPassword: '' })
      
      if (onAdminCreated) {
        onAdminCreated()
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create admin user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h3>Create New Admin User</h3>
      
      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter username for new admin"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Admin...' : 'Create Admin User'}
        </button>
      </form>
    </div>
  )
}

export default CreateAdmin