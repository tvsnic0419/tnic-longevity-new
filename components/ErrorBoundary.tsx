'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  STORAGE_KEYS,
  purgeAllHealthData,
  removeStorageItem,
  getPrivacyMode,
} from '@/lib/privacy';

const ERROR_LOG_KEY = 'tnic-client-errors';
const TOOLS_STORE_KEY = 'tnic-tools-preferences';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
  isRecovering: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error, isRecovering: false };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('TNiC client error:', error, errorInfo);

    try {
      const errors = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]') as Array<{
        timestamp: string;
        message: string;
        stack?: string;
        componentStack?: string;
      }>;
      errors.push({
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack?.slice(0, 500),
        componentStack: errorInfo.componentStack?.slice(0, 500),
      });
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(errors.slice(-10)));
    } catch {
      /* storage unavailable */
    }
  }

  handleRetry = () => {
    const newCount = this.state.retryCount + 1;

    if (newCount === 1) {
      this.setState({ hasError: false, retryCount: newCount, isRecovering: false, error: undefined });
      return;
    }

    this.setState({ isRecovering: true, retryCount: newCount });

    if (newCount === 2) {
      try {
        const mode = getPrivacyMode();
        removeStorageItem(STORAGE_KEYS.stack, mode);
        removeStorageItem(STORAGE_KEYS.stack, mode === 'local' ? 'session' : 'local');
      } catch {
        /* ignore */
      }
      window.location.reload();
      return;
    }

    try {
      purgeAllHealthData();
      localStorage.removeItem(TOOLS_STORE_KEY);
      sessionStorage.removeItem(TOOLS_STORE_KEY);
    } catch {
      /* ignore */
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <Card
            variant="elevated"
            className="max-w-lg w-full text-center border-accent-rose/30"
          >
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-accent-amber" aria-hidden="true" />
            </div>

            <h2 className="heading-section text-2xl md:text-3xl mb-3">Something went wrong</h2>

            <p className="text-body-sm text-muted-foreground mb-8 leading-relaxed">
              {this.props.fallbackMessage ??
                "Don't worry — your longevity data stays in your browser. Try recovery below."}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <p className="text-left text-xs font-mono text-accent-rose bg-muted/50 rounded-lg p-3 mb-6 break-all">
                {this.state.error.message}
              </p>
            )}

            {this.state.isRecovering && (
              <p className="text-sm text-accent-cyan mb-6">Attempting recovery…</p>
            )}

            <Button
              onClick={this.handleRetry}
              fullWidth
              size="lg"
              className="flex items-center justify-center gap-2"
              disabled={this.state.isRecovering}
            >
              <RefreshCw
                className={`w-5 h-5 ${this.state.isRecovering ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Try recovery
              {this.state.retryCount > 0 ? ` (attempt ${this.state.retryCount + 1})` : ''}
            </Button>

            <p className="text-caption text-muted-foreground mt-8">
              Error logged locally (last 10). If this continues, note the date/time and visit{' '}
              <a href="/trust/disclaimers" className="text-accent-cyan hover:underline">
                /trust/disclaimers
              </a>
              .
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}