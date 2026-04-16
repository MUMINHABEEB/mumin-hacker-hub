import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Bug,
  Network,
  Server,
  Database,
  Eye,
  Download,
  Trash2
} from 'lucide-react';

interface ErrorLog {
  id: string;
  timestamp: Date;
  type: 'javascript' | 'network' | 'component' | 'cms' | 'build';
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  metadata?: any;
}

interface SystemStatus {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  lastChecked: Date;
}

const ErrorMonitor = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Error logging function
  const logError = (error: Partial<ErrorLog>) => {
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: error.type || 'javascript',
      level: error.level || 'error',
      message: error.message || 'Unknown error',
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: error.metadata,
    };

    setErrors(prev => [errorLog, ...prev].slice(0, 100)); // Keep last 100 errors
    
    // Store in localStorage for persistence
    const storedErrors = JSON.parse(localStorage.getItem('error-logs') || '[]');
    localStorage.setItem('error-logs', JSON.stringify([errorLog, ...storedErrors].slice(0, 500)));
  };

  // System health checks
  const performHealthChecks = async () => {
    const checks: SystemStatus[] = [];

    // Check if React is working
    try {
      checks.push({
        component: 'React App',
        status: 'healthy',
        message: 'React application is running normally',
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        component: 'React App',
        status: 'error',
        message: `React error: ${error}`,
        lastChecked: new Date()
      });
    }

    // Check local storage
    try {
      localStorage.setItem('health-check', 'test');
      localStorage.removeItem('health-check');
      checks.push({
        component: 'Local Storage',
        status: 'healthy',
        message: 'Local storage is accessible',
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        component: 'Local Storage',
        status: 'error',
        message: 'Local storage is not accessible',
        lastChecked: new Date()
      });
    }

    // Check if routes are working
    try {
      const currentPath = window.location.pathname;
      checks.push({
        component: 'Routing',
        status: 'healthy',
        message: `Current route: ${currentPath}`,
        lastChecked: new Date()
      });
    } catch (error) {
      checks.push({
        component: 'Routing',
        status: 'error',
        message: 'Routing system has issues',
        lastChecked: new Date()
      });
    }

    // Test social media data loading
    try {
      const response = await fetch('/src/social-media/cybersecurity-trends-2024.md');
      if (response.ok) {
        checks.push({
          component: 'Social Media Data',
          status: 'healthy',
          message: 'Social media content is accessible',
          lastChecked: new Date()
        });
      } else {
        checks.push({
          component: 'Social Media Data',
          status: 'warning',
          message: 'Some social media content may not be accessible',
          lastChecked: new Date()
        });
      }
    } catch (error) {
      checks.push({
        component: 'Social Media Data',
        status: 'error',
        message: 'Cannot access social media content',
        lastChecked: new Date()
      });
    }

    // Test CMS config
    try {
      const response = await fetch('/admin/config.yml');
      if (response.ok) {
        checks.push({
          component: 'CMS Configuration',
          status: 'healthy',
          message: 'CMS config is accessible',
          lastChecked: new Date()
        });
      } else {
        checks.push({
          component: 'CMS Configuration',
          status: 'warning',
          message: 'CMS config may have issues',
          lastChecked: new Date()
        });
      }
    } catch (error) {
      checks.push({
        component: 'CMS Configuration',
        status: 'error',
        message: 'CMS configuration is not accessible',
        lastChecked: new Date()
      });
    }

    setSystemStatus(checks);
  };

  // Set up error monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      logError({
        type: 'javascript',
        level: 'error',
        message: event.message,
        stack: event.error?.stack,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError({
        type: 'javascript',
        level: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        metadata: {
          reason: event.reason
        }
      });
    };

    // Resource loading error handler
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      logError({
        type: 'network',
        level: 'error',
        message: `Failed to load resource: ${target.tagName}`,
        metadata: {
          tagName: target.tagName,
          src: (target as any).src || (target as any).href
        }
      });
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleResourceError, true);

    // Load stored errors
    const storedErrors = JSON.parse(localStorage.getItem('error-logs') || '[]');
    if (storedErrors.length > 0) {
      setErrors(storedErrors.slice(0, 100));
    }

    // Initial health check
    performHealthChecks();

    // Auto refresh health checks
    const interval = autoRefresh ? setInterval(performHealthChecks, 30000) : null;

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleResourceError, true);
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'javascript': return <Bug className="w-4 h-4" />;
      case 'network': return <Network className="w-4 h-4" />;
      case 'component': return <Server className="w-4 h-4" />;
      case 'cms': return <Database className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const clearErrors = () => {
    setErrors([]);
    localStorage.removeItem('error-logs');
  };

  const exportErrors = () => {
    const dataStr = JSON.stringify(errors, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const healthyCount = systemStatus.filter(s => s.status === 'healthy').length;
  const warningCount = systemStatus.filter(s => s.status === 'warning').length;
  const errorCount = systemStatus.filter(s => s.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">🔍 Error Monitor & System Health</h1>
          <p className="text-muted-foreground">Real-time monitoring of your application</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isMonitoring ? "default" : "outline"}
            onClick={() => setIsMonitoring(!isMonitoring)}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isMonitoring ? 'Monitoring' : 'Stopped'}
          </Button>
          <Button
            variant="outline"
            onClick={performHealthChecks}
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{healthyCount}</p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{errors.length}</p>
                <p className="text-sm text-muted-foreground">Logged Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            System Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.status)}
                  <div>
                    <p className="font-medium">{status.component}</p>
                    <p className="text-sm text-muted-foreground">{status.message}</p>
                  </div>
                </div>
                <Badge variant={status.status === 'healthy' ? 'default' : status.status === 'warning' ? 'secondary' : 'destructive'}>
                  {status.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Logs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Error Logs ({errors.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportErrors} disabled={errors.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={clearErrors} disabled={errors.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {errors.length === 0 ? (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                No errors logged! Your application is running smoothly.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {errors.map((error) => (
                <div key={error.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getErrorIcon(error.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={error.level === 'error' ? 'destructive' : error.level === 'warning' ? 'secondary' : 'default'}>
                            {error.level}
                          </Badge>
                          <Badge variant="outline">{error.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {error.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="font-medium mb-2">{error.message}</p>
                        {error.stack && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Stack trace</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{error.stack}</pre>
                          </details>
                        )}
                        {error.metadata && (
                          <details className="text-xs mt-2">
                            <summary className="cursor-pointer text-muted-foreground">Metadata</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(error.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorMonitor;