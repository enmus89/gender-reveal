import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Last-resort guard: if anything on the page throws (an animation, a browser
 * quirk on an old phone), show the reveal message as plain text instead of a
 * blank white screen.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('App crashed, showing fallback:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          background: '#0B132B',
          color: '#E2E8F0',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: '3rem' }}>👶💙</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#93C5FD' }}>
          It&apos;s a Boy!
        </h1>
        <p style={{ maxWidth: '28rem', color: '#94A3B8' }}>
          Thank you for playing! (Your device had trouble with the animation, but
          the big news is above.)
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            border: '1px solid rgba(147,197,253,0.4)',
            background: 'rgba(37,99,235,0.4)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}
