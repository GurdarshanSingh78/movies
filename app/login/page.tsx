'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // NEW: The Google OAuth Handler
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Send them to our secure callback route after Google approves them
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else { router.push('/'); router.refresh(); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else alert("Success! Check your email for the confirmation link.");
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
      <p className="text-zinc-400 text-sm mb-8">Sign in to save movies and dramas to your watchlist.</p>
      
      {/* Google Sign In Button */}
      <Button 
        onClick={handleGoogleLogin} 
        className="w-full bg-white text-black hover:bg-zinc-200 font-bold mb-6 flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </Button>

      <div className="relative flex items-center py-2 mb-6">
        <div className="flex-grow border-t border-zinc-800"></div>
        <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase font-bold">Or continue with email</span>
        <div className="flex-grow border-t border-zinc-800"></div>
      </div>

      <form className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-4 mt-4">
          <Button onClick={handleLogin} className="flex-1 bg-zinc-800 text-white hover:bg-zinc-700 font-bold border border-zinc-700">
            Sign In
          </Button>
          <Button onClick={handleSignUp} variant="outline" className="flex-1 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white">
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}