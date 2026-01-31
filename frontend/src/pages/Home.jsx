import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="container">
      <section className="hero">
        <h1>📚 Notes Sharing Platform</h1>
        <p>
          A modern platform for sharing educational notes, resources, and materials. 
          Perfect for students, teachers, and learning communities.
        </p>
        
        {isAuthenticated ? (
          <div>
            <h3>Welcome back, {user?.username}! 🎉</h3>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="btn btn-secondary">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
          </div>
        )}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
          <h3>Easy Note Access</h3>
          <p>Browse and download notes in various formats including PDF, images, and documents.</p>
        </div>
        
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</div>
          <h3>Admin Management</h3>
          <p>Admins can easily upload, organize, and manage educational materials.</p>
        </div>
        
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
          <h3>Modern Interface</h3>
          <p>Clean, responsive design that works perfectly on all devices.</p>
        </div>
      </div>
    </div>
  )
}

export default Home