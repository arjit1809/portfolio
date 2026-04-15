import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          backgroundColor: '#000',
          color: '#ff4d4d',
          fontFamily: 'monospace',
          height: '100vh',
          overflow: 'auto'
        }}>
          <h1>Critical Error</h1>
          <pre>{this.state.error?.message}</pre>
          <pre style={{ fontSize: '12px', color: '#888' }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              backgroundColor: '#333', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px' 
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.children
  }
}
