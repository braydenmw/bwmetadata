import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error } as ErrorBoundaryState;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    // Also log to console for dev
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
          <h2 style={{ color: '#9b1c1c' }}>An application error occurred</h2>
          <p style={{ color: '#444' }}>The app encountered a runtime error while rendering. The details are shown below.</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#111827', color: '#f8fafc', padding: 12, borderRadius: 6, overflow: 'auto' }}>
            {this.state.error?.message}
            {this.state.info ? `\n\nComponent Stack:\n${this.state.info.componentStack}` : ''}
          </pre>
          <p style={{ color: '#444' }}>Open the browser console or check the terminal for more details.</p>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

