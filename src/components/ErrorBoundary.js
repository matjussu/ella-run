/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the app
 */

import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: ${props => props.theme.spacing.xxl};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.error};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ErrorTitle = styled.h2`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fonts.sizes.xxl};
  font-weight: ${props => props.theme.fonts.weights.bold};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.fonts.sizes.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
  max-width: 600px;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.pill};
  font-size: ${props => props.theme.fonts.sizes.md};
  font-weight: ${props => props.theme.fonts.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowHover};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorDetails = styled.details`
  margin-top: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.medium};
  max-width: 800px;

  summary {
    cursor: pointer;
    font-weight: ${props => props.theme.fonts.weights.medium};
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  pre {
    background: #f8f9fa;
    padding: ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.small};
    overflow: auto;
    font-size: ${props => props.theme.fonts.sizes.sm};
    color: ${props => props.theme.colors.text.primary};
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. Please try refreshing the page 
            or click the button below to retry. If the problem persists, please contact support.
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>
            Try Again
          </RetryButton>
          
          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <ErrorDetails>
              <summary>Technical Details (Development)</summary>
              <div>
                <h4>Error:</h4>
                <pre>{this.state.error.toString()}</pre>
                
                {this.state.errorInfo && (
                  <>
                    <h4>Component Stack:</h4>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </>
                )}
              </div>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;