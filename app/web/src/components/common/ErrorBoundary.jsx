import React from 'react';
import { Result, Button } from 'antd';
import { useLanguage } from '@/store/LanguageContext';

class ErrorBoundaryInternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError = /Failed to fetch dynamically imported module|Loading chunk|Loading CSS chunk/.test(error.message);
    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { isChunkError } = this.state;
      return (
        <div className="flex items-center justify-center min-h-screen bg-white p-6">
          <Result
            status={isChunkError ? "info" : "500"}
            title={isChunkError ? this.props.t('error_chunk_title') : this.props.t('error_500_title')}
            subTitle={isChunkError 
              ? this.props.t('error_chunk_desc') 
              : this.props.t('error_500_desc')
            }
            extra={
              <Button 
                type="primary" 
                onClick={() => window.location.reload()}
                className="bg-[#A10550] hover:bg-[#8E0443] border-none h-11 px-8 rounded-xl"
              >
                {isChunkError ? this.props.t('error_chunk_btn') : this.props.t('error_reload_btn')}
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = (props) => {
  const context = useLanguage();
  const t = context?.t || ((key) => key);
  return <ErrorBoundaryInternal {...props} t={t} />;
};

export default ErrorBoundary;
