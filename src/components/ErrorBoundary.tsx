'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Bug, 
  Home,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  ArrowLeft
} from 'lucide-react';
import { errorHandler, ErrorType, ErrorSeverity } from '@/lib/utils/errorHandler';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
  errorId: string | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showReload?: boolean;
  level?: 'page' | 'section' | 'component';
  enableRetry?: boolean;
  maxRetries?: number;
  context?: {
    component?: string;
    feature?: string;
    userId?: string;
  };
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  resetError: () => void;
  showDetails: boolean;
  toggleDetails: () => void;
  level: 'page' | 'section' | 'component';
  retryCount: number;
  maxRetries: number;
  onRetry?: () => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Create standardized error with our error handler
    const appError = errorHandler.handleError(
      error,
      ErrorType.UNKNOWN,
      {
        component: this.props.context?.component || 'Unknown Component',
        action: 'component_render',
        userId: this.props.context?.userId,
        metadata: {
          componentStack: errorInfo.componentStack,
          errorBoundaryLevel: this.props.level || 'component',
          feature: this.props.context?.feature
        }
      },
      this.props.level === 'page' ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM
    );

    this.setState({
      error,
      errorInfo,
      errorId: appError.id
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: null,
      retryCount: 0
    });
  };

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
        errorId: null,
        retryCount: prevState.retryCount + 1
      }));

      // Auto-reset retry count after success
      this.retryTimeoutId = setTimeout(() => {
        this.setState({ retryCount: 0 });
      }, 30000);
    }
  };

  toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      const { fallback: CustomFallback, enableRetry = true, maxRetries = 3 } = this.props;
      
      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error!}
            errorInfo={this.state.errorInfo!}
            resetError={this.resetError}
            showDetails={this.state.showDetails}
            toggleDetails={this.toggleDetails}
            level={this.props.level || 'component'}
            retryCount={this.state.retryCount}
            maxRetries={maxRetries}
            onRetry={enableRetry ? this.handleRetry : undefined}
          />
        );
      }
      
      return (
        <DefaultErrorFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo!}
          resetError={this.resetError}
          showDetails={this.state.showDetails}
          toggleDetails={this.toggleDetails}
          level={this.props.level || 'component'}
          retryCount={this.state.retryCount}
          maxRetries={maxRetries}
          onRetry={enableRetry ? this.handleRetry : undefined}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  resetError, 
  showDetails, 
  toggleDetails,
  level,
  retryCount,
  maxRetries,
  onRetry
}: ErrorFallbackProps) {
  const getErrorSeverity = () => {
    if (error.name === 'ChunkLoadError') return 'warning';
    if (error.message?.includes('Network')) return 'warning';
    return 'error';
  };

  const getErrorTitle = () => {
    switch (level) {
      case 'page': return 'Page Error';
      case 'section': return 'Section Error';
      default: return 'Component Error';
    }
  };

  const getErrorMessage = () => {
    if (error.name === 'ChunkLoadError') {
      return 'Failed to load application resources. This usually happens after an app update.';
    }
    if (error.message?.includes('Network')) {
      return 'Network connection issue. Please check your internet connection.';
    }
    return 'An unexpected error occurred. This has been logged and will be investigated.';
  };

  const severity = getErrorSeverity();
  const borderColor = severity === 'error' ? 'border-red-200' : 'border-yellow-200';
  const bgColor = severity === 'error' ? 'bg-red-50' : 'bg-yellow-50';
  const iconColor = severity === 'error' ? 'text-red-600' : 'text-yellow-600';
  const textColor = severity === 'error' ? 'text-red-800' : 'text-yellow-800';

  return (
    <div className="flex items-center justify-center p-6">
      <Card className={`w-full max-w-2xl ${borderColor} ${bgColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
              <div>
                <CardTitle className={textColor}>{getErrorTitle()}</CardTitle>
                <p className={`text-sm ${textColor} opacity-80 mt-1`}>
                  {getErrorMessage()}
                </p>
              </div>
            </div>
            <Badge variant={severity === 'error' ? 'destructive' : 'secondary'}>
              {error.name}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Actions */}
          <div className="flex flex-wrap gap-2">
            {onRetry && retryCount < maxRetries ? (
              <Button 
                onClick={onRetry} 
                size="sm"
                variant={severity === 'error' ? 'destructive' : 'default'}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry ({maxRetries - retryCount} left)
              </Button>
            ) : (
              <Button 
                onClick={resetError} 
                size="sm"
                variant={severity === 'error' ? 'destructive' : 'default'}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            
            {error.name === 'ChunkLoadError' && (
              <Button 
                onClick={() => window.location.reload()} 
                size="sm" 
                variant="outline"
              >
                <Home className="h-4 w-4 mr-2" />
                Reload App
              </Button>
            )}
            
            <Button 
              onClick={toggleDetails} 
              size="sm" 
              variant="ghost"
            >
              {showDetails ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>

          {/* Retry Count Display */}
          {retryCount > 0 && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Retry Attempts</AlertTitle>
              <AlertDescription>
                {retryCount} of {maxRetries} attempts used
              </AlertDescription>
            </Alert>
          )}

          {/* Error Details */}
          {showDetails && (
            <div className="space-y-3">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Error Details</span>
                </div>
                <div className="text-xs font-mono bg-gray-100 p-2 rounded border overflow-auto max-h-32">
                  <div className="text-red-600 font-semibold">{error.name}: {error.message}</div>
                  {error.stack && (
                    <pre className="mt-1 text-gray-600 whitespace-pre-wrap">
                      {error.stack.split('\n').slice(0, 10).join('\n')}
                      {error.stack.split('\n').length > 10 && '\n... (truncated)'}
                    </pre>
                  )}
                </div>
              </div>

              {errorInfo?.componentStack && (
                <div className="bg-white/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Component Stack</span>
                  </div>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded border overflow-auto max-h-24">
                    <pre className="text-gray-600 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-800">
                  💡 <strong>For Developers:</strong> Check the browser console for additional details. 
                  Error boundary level: <code className="bg-blue-200 px-1 rounded">{level}</code>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Higher-order component for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Specialized error boundaries for meal plan features
 */
export function MealPlanErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'context'>) {
  return (
    <ErrorBoundary
      context={{
        component: 'MealPlan',
        feature: 'meal-plan-management'
      }}
      level="section"
      enableRetry={true}
      maxRetries={3}
      {...props}
    >
      {children}
    </ErrorBoundary>
  );
}

export function PlayerManagementErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'context'>) {
  return (
    <ErrorBoundary
      context={{
        component: 'PlayerManagement', 
        feature: 'player-management'
      }}
      level="section"
      enableRetry={true}
      maxRetries={3}
      {...props}
    >
      {children}
    </ErrorBoundary>
  );
}

export function AIGenerationErrorBoundary({ children, ...props }: Omit<ErrorBoundaryProps, 'context'>) {
  return (
    <ErrorBoundary
      context={{
        component: 'AIGeneration',
        feature: 'ai-meal-generation'
      }}
      level="component"
      enableRetry={true}
      maxRetries={2}
      {...props}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;