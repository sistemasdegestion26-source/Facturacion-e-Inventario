import React from 'react';
import type { PropsWithChildren, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class AppErrorBoundary extends React.Component<PropsWithChildren, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[v0] App render error:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <main style={{ padding: 24, fontFamily: 'system-ui' }}><h1>No se pudo cargar la aplicación</h1><p>{this.state.error.message}</p></main>;
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');
createRoot(root!).render(<AppErrorBoundary><App /></AppErrorBoundary>);
