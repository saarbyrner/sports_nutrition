/**
 * Centralized Error Handling System
 * 
 * Production-ready error handling with proper logging, user feedback,
 * and recovery strategies for the meal plan management system.
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION', 
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  DATABASE = 'DATABASE',
  AI_GENERATION = 'AI_GENERATION',
  FILE_UPLOAD = 'FILE_UPLOAD',
  UNKNOWN = 'UNKNOWN'
}

export enum ErrorSeverity {
  LOW = 'LOW',       // Minor issues, fallback available
  MEDIUM = 'MEDIUM', // Feature degradation
  HIGH = 'HIGH',     // Core functionality affected
  CRITICAL = 'CRITICAL' // System failure
}

export interface ErrorContext {
  userId?: string;
  playerId?: string;
  mealPlanId?: string;
  action?: string;
  component?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  title: string;
  message: string;
  userMessage: string;
  context: ErrorContext;
  retryable: boolean;
  recoveryActions?: string[];
}

export interface ErrorHandlerOptions {
  logToConsole?: boolean;
  logToService?: boolean;
  showNotification?: boolean;
  trackAnalytics?: boolean;
}

class ErrorHandler {
  private errors: Map<string, AppError> = new Map();
  private listeners: ((error: AppError) => void)[] = [];
  private options: ErrorHandlerOptions;

  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      logToConsole: true,
      logToService: false,
      showNotification: true,
      trackAnalytics: false,
      ...options
    };
  }

  /**
   * Create a standardized error from various input types
   */
  createError(
    error: Error | string | any,
    type: ErrorType = ErrorType.UNKNOWN,
    context: Partial<ErrorContext> = {},
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): AppError {
    const id = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let title: string;
    let message: string;
    let userMessage: string;
    let retryable = false;
    let recoveryActions: string[] = [];

    // Parse different error types
    if (error instanceof Error) {
      message = error.message;
      title = error.name || type;
    } else if (typeof error === 'string') {
      message = error;
      title = type;
    } else if (error?.message) {
      message = error.message;
      title = error.name || type;
    } else {
      message = 'An unknown error occurred';
      title = 'Unknown Error';
    }

    // Generate user-friendly messages and recovery actions based on error type
    switch (type) {
      case ErrorType.NETWORK:
        userMessage = 'Connection issue. Please check your internet connection.';
        retryable = true;
        recoveryActions = ['Check internet connection', 'Try again', 'Refresh page'];
        break;
        
      case ErrorType.VALIDATION:
        userMessage = 'Please check your input and try again.';
        retryable = true;
        recoveryActions = ['Review form fields', 'Fix validation errors'];
        break;
        
      case ErrorType.AUTHENTICATION:
        userMessage = 'Please log in again to continue.';
        retryable = false;
        recoveryActions = ['Log in again', 'Clear browser data'];
        break;
        
      case ErrorType.AUTHORIZATION:
        userMessage = 'You don\'t have permission to perform this action.';
        retryable = false;
        recoveryActions = ['Contact administrator', 'Check permissions'];
        break;
        
      case ErrorType.RATE_LIMIT:
        userMessage = 'Too many requests. Please wait a moment and try again.';
        retryable = true;
        recoveryActions = ['Wait 30 seconds', 'Try again later'];
        break;
        
      case ErrorType.SERVER_ERROR:
        userMessage = 'Server error. Our team has been notified.';
        retryable = true;
        recoveryActions = ['Try again', 'Contact support if persists'];
        break;
        
      case ErrorType.NOT_FOUND:
        userMessage = 'The requested item could not be found.';
        retryable = false;
        recoveryActions = ['Go back', 'Search for item', 'Refresh page'];
        break;
        
      case ErrorType.AI_GENERATION:
        userMessage = 'AI generation failed. Please try again or create manually.';
        retryable = true;
        recoveryActions = ['Try AI generation again', 'Create manually', 'Use template'];
        break;
        
      case ErrorType.DATABASE:
        userMessage = 'Data save failed. Please try again.';
        retryable = true;
        recoveryActions = ['Try saving again', 'Check network', 'Contact support'];
        break;
        
      default:
        userMessage = 'Something went wrong. Please try again.';
        retryable = true;
        recoveryActions = ['Try again', 'Refresh page'];
    }

    const appError: AppError = {
      id,
      type,
      severity,
      title,
      message,
      userMessage,
      context: {
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        stackTrace: error instanceof Error ? error.stack : undefined,
        ...context
      },
      retryable,
      recoveryActions
    };

    return appError;
  }

  /**
   * Handle an error with full processing
   */
  handleError(
    error: Error | string | any,
    type: ErrorType = ErrorType.UNKNOWN,
    context: Partial<ErrorContext> = {},
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): AppError {
    const appError = this.createError(error, type, context, severity);
    
    // Store error
    this.errors.set(appError.id, appError);
    
    // Log error
    this.logError(appError);
    
    // Notify listeners
    this.notifyListeners(appError);
    
    return appError;
  }

  /**
   * Log error based on configuration
   */
  private logError(error: AppError): void {
    if (this.options.logToConsole) {
      const logLevel = this.getSeverityLogLevel(error.severity);
      console[logLevel](`[${error.type}] ${error.title}:`, {
        message: error.message,
        userMessage: error.userMessage,
        context: error.context,
        severity: error.severity,
        retryable: error.retryable
      });
    }

    if (this.options.logToService) {
      // Send to logging service (implement based on your logging provider)
      this.sendToLoggingService(error);
    }

    if (this.options.trackAnalytics) {
      // Track error in analytics (implement based on your analytics provider)
      this.trackErrorAnalytics(error);
    }
  }

  private getSeverityLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'warn';
    }
  }

  private sendToLoggingService(error: AppError): void {
    // Implement based on your logging service (e.g., Sentry, LogRocket, etc.)
    // This is a placeholder for external logging integration
    console.log('Would send to logging service:', error);
  }

  private trackErrorAnalytics(error: AppError): void {
    // Implement based on your analytics service (e.g., Google Analytics, Mixpanel)
    console.log('Would track error analytics:', error);
  }

  /**
   * Notify error listeners
   */
  private notifyListeners(error: AppError): void {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error listener failed:', listenerError);
      }
    });
  }

  /**
   * Subscribe to error events
   */
  subscribe(listener: (error: AppError) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get error by ID
   */
  getError(id: string): AppError | undefined {
    return this.errors.get(id);
  }

  /**
   * Clear specific error
   */
  clearError(id: string): void {
    this.errors.delete(id);
  }

  /**
   * Clear all errors
   */
  clearAllErrors(): void {
    this.errors.clear();
  }

  /**
   * Get all errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return Array.from(this.errors.values()).filter(error => error.severity === severity);
  }

  /**
   * Get recent errors (last N)
   */
  getRecentErrors(count: number = 10): AppError[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.context.timestamp - a.context.timestamp)
      .slice(0, count);
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Specific error creators for common meal plan errors
export const MealPlanErrors = {
  playerNotFound: (playerId: string) => 
    errorHandler.createError(
      `Player with ID ${playerId} not found`,
      ErrorType.NOT_FOUND,
      { playerId, action: 'player_lookup' },
      ErrorSeverity.MEDIUM
    ),

  mealPlanNotFound: (mealPlanId: string) =>
    errorHandler.createError(
      `Meal plan with ID ${mealPlanId} not found`,
      ErrorType.NOT_FOUND,
      { mealPlanId, action: 'meal_plan_lookup' },
      ErrorSeverity.MEDIUM
    ),

  aiGenerationFailed: (reason?: string) =>
    errorHandler.createError(
      `AI meal plan generation failed${reason ? `: ${reason}` : ''}`,
      ErrorType.AI_GENERATION,
      { action: 'ai_generation' },
      ErrorSeverity.MEDIUM
    ),

  validationFailed: (field: string, message: string) =>
    errorHandler.createError(
      `Validation failed for ${field}: ${message}`,
      ErrorType.VALIDATION,
      { action: 'form_validation', field },
      ErrorSeverity.LOW
    ),

  databaseError: (operation: string, details?: string) =>
    errorHandler.createError(
      `Database operation failed: ${operation}${details ? ` - ${details}` : ''}`,
      ErrorType.DATABASE,
      { action: operation },
      ErrorSeverity.HIGH
    ),

  networkError: (endpoint: string) =>
    errorHandler.createError(
      `Network request failed: ${endpoint}`,
      ErrorType.NETWORK,
      { action: 'network_request', endpoint },
      ErrorSeverity.MEDIUM
    )
};

export default errorHandler;