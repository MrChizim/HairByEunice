import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { ShieldOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminGuard({ children }) {
  const { isAuthenticated, isLoadingAuth, login, logout } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-semibold">Admin Access</h2>
            <p className="text-muted-foreground text-sm mt-1">Enter your password to continue</p>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (!login(password)) setError(true);
                }
              }}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-destructive text-xs">Incorrect password.</p>}
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              onClick={() => { if (!login(password)) setError(true); }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4">
        <Button
          size="sm"
          variant="outline"
          onClick={logout}
          className="text-xs rounded-full"
        >
          Sign out
        </Button>
      </div>
    </>
  );
}
