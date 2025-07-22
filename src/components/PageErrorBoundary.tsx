'use client'

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, Home, RefreshCw, Mail } from 'lucide-react';

interface PageErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

// Custom fallback component for page-level errors
function PageErrorFallback({ error, resetError }: PageErrorFallbackProps) {
  const handleReloadApp = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    const subject = encodeURIComponent(`Error Report: ${error.name}`);
    const body = encodeURIComponent(`
Error: ${error.name}
Message: ${error.message}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Time: ${new Date().toISOString()}

Stack Trace:
${error.stack}
    `);
    
    window.open(`mailto:support@sportsnutrition.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Application Error</CardTitle>
            <p className="text-sm text-red-600 mt-2">
              Something went wrong and the page couldn't load properly.
            </p>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div className="bg-white/50 rounded p-3">
              <p className="text-sm text-gray-700 font-mono">
                {error.name}: {error.message}
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button onClick={resetError} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button onClick={handleReloadApp} variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
              
              <Button onClick={handleReportError} variant="ghost" size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              If this problem persists, please contact support with the error details above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Page-level error boundary component
interface PageErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function PageErrorBoundary({ children, onError }: PageErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console in development
    console.error('Page Error Boundary:', error, errorInfo);
    
    // In production, you could send this to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  return (
    <ErrorBoundary
      level="page"
      fallback={PageErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}