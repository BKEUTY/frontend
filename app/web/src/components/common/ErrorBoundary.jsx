import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-white p-6">
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong on our end."
            extra={
              <Button 
                type="primary" 
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary-hover"
              >
                Back Home
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
