import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  
  const { register, error, clearError, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    clearError()
    setLocalError('')
  }, [formData, clearError])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return false
    }
    
    if (formData.username.length < 3) {
      setLocalError('Username must be at least 3 characters long')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const result = await register(formData.username, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else if (result.error) {
      setLocalError(result.error)
    }
    
    setIsLoading(false)
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="container">
      <div className="auth-container">
        <div className="card auth-card">
          <h2>Create User Account 🚀</h2>
          
          {(error || localError) && (
            <div className="alert alert-error">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Choose a username"
                required
                disabled={isLoading}
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
                placeholder="Enter your password"
                required
                disabled={isLoading}
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
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create User Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
              <strong>Demo Accounts:</strong><br />
              Admin: Likith / admin<br />
              User: user1 / user123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register