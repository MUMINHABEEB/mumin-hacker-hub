import { useState, useEffect } from 'react';
import { authApi, getAdminToken, setAdminToken, clearAdminToken } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  User, 
  Key, 
  Shield, 
  LogOut, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Terminal
} from 'lucide-react';

interface AdminAuthProps {
  onAuthSuccess: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function AdminAuth({ onAuthSuccess, isAuthenticated, onLogout }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if a token already exists in localStorage
    const token = getAdminToken();
    if (token) {
      // Decode email from JWT payload (no signature verification needed client-side)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || 'admin');
        onAuthSuccess();
      } catch {
        clearAdminToken();
      }
    }
  }, [onAuthSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { token } = await authApi.login(email, password);
      setAdminToken(token);
      setUserEmail(email);
      onAuthSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setUserEmail(null);
    onLogout();
  };

  if (isAuthenticated && userEmail) {
    return (
      <div className="mb-6 flex items-center justify-between p-6 bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm border border-primary/30 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary" />
            <Terminal className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm font-cyber text-foreground font-medium">
                {userEmail}
              </p>
              <Badge className="bg-primary/20 text-primary border-primary/40 text-xs font-mono">
                ADMIN
              </Badge>
            </div>
            <p className="text-xs text-primary font-mono">
              <span className="text-accent">//</span> Authenticated session active
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary font-mono"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all duration-500">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Database className="w-16 h-16 text-primary" />
                <Terminal className="w-6 h-6 text-secondary absolute -bottom-1 -right-1" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-cyber text-foreground mb-2">
              <span className="text-primary">&lt;</span>
              Admin
              <span className="text-transparent bg-gradient-primary bg-clip-text"> Access</span>
              <span className="text-primary">/&gt;</span>
            </CardTitle>
            <p className="text-muted-foreground font-mono text-sm">
              <span className="text-accent">//</span> Secure authentication required
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6 border-destructive/50 bg-destructive/10">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <AlertDescription className="text-destructive font-mono text-sm">
                  <span className="text-destructive">[ERROR]:</span> {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground font-mono">
                  <span className="text-accent">&gt;</span> Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input/50 border-border/50 focus:border-primary font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground font-mono">
                  <span className="text-accent">&gt;</span> Access Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-input/50 border-border/50 focus:border-primary font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:glow-green transition-all duration-300 font-mono shadow-lg" 
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    <span className="font-mono">Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="font-mono">Initialize Session</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-primary font-cyber mb-1">Security Protocol</h4>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    Protected by JWT authentication with bcrypt password hashing
                    and secure token storage.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-4 h-4 text-secondary mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-secondary font-cyber mb-1">Access Control</h4>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    Unauthorized access attempts are logged. 
                    Contact system administrator for credential recovery.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminAuth;