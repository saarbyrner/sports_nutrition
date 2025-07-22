'use client'

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

interface SectionErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  description?: string;
  showDismiss?: boolean;
}

// Custom fallback component for section-level errors
function SectionErrorFallback({ 
  error, 
  resetError, 
  title = "Section Error",
  description = "This section encountered an error and couldn't load properly.",
  showDismiss = false 
}: SectionErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          <div className="text-sm mt-1">{description}</div>
          <div className="text-xs mt-1 font-mono opacity-75">
            {error.name}: {error.message}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button 
            onClick={resetError} 
            size="sm" 
            variant="outline"
            className="whitespace-nowrap"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
          {showDismiss && (
            <Button 
              onClick={resetError} 
              size="sm" 
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Section-level error boundary component
interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showDismiss?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export default function SectionErrorBoundary({ 
  children, 
  title,
  description,
  showDismiss = false,
  onError 
}: SectionErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.warn('Section Error Boundary:', error, errorInfo);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  };

  const CustomFallback = (props: any) => (
    <SectionErrorFallback 
      {...props} 
      title={title}
      description={description}
      showDismiss={showDismiss}
    />
  );

  return (
    <ErrorBoundary
      level="section"
      fallback={CustomFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}

// HOC for wrapping components with section error boundaries
export function withSectionErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<SectionErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <SectionErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </SectionErrorBoundary>
  );

  WrappedComponent.displayName = `withSectionErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}