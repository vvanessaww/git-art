import { Component } from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                Reload Page
              </button>
              <a 
                href="https://github.com/vvanessaww/git-art/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="report-button"
              >
                Report Issue
              </a>
            </div>
            <details className="error-details">
              <summary>Technical Details</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
