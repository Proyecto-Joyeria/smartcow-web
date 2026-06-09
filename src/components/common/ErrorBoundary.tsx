import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props  { children: ReactNode; }
interface State  { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="p-6 flex flex-col gap-3">
          <p className="text-red-400 font-semibold text-heading-md">Error al cargar la página</p>
          <pre className="bg-surface-elevated text-red-300 text-small p-4 rounded-lg overflow-auto whitespace-pre-wrap break-all">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
