import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("錯誤捕獲於 ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>發生了一些錯誤</h2>
          <p>請重新整理頁面或返回首頁嘗試。</p>
          <p>{this.state.error && this.state.error.toString()}</p>
          <button onClick={() => window.location.href = '/'}>
            返回首頁
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
