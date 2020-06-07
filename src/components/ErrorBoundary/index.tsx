import React from 'react';
import * as Sentry from '@sentry/browser';
import Error from '../Error';

class ErrorBoundary extends React.Component {
  state: {
    error: Error;
    hasError: false;
    eventId: '';
  };

  static getDerivedStateFromError(/*error*/) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId, error });
    });
  }

  render() {
    if (this.state.hasError && process.env.NODE_ENV === 'development') {
      throw this.state.error;
    }

    if (this.state.hasError) {
      return <Error statusCode={500} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
