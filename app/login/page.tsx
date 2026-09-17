"use client";
import { useState, useEffect } from "react";
import { supabase } from "../upload/lib/supabase";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Agar user pehle se logged-in hai, toh use dubara login page mat dikhao, seedha home ya profile bhej do
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else {
        alert("Registration successful! Check your email or login now.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) alert("Google Login Error: " + error.message);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
            Searchify
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isSignUp ? "Create an account to continue" : "Login to access your study hub"}
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium flex items-center justify-center gap-3 transition-all text-sm mb-6 shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.18 21.3 7.28 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.13 0 9.87 0 12s.44 3.87 1.2 5.4l4.08-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.28 0 3.18 2.7 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="px-3 text-xs uppercase text-slate-500 font-semibold">Or email</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white font-semibold shadow-lg shadow-red-500/15 transition-all text-sm mt-2"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
          >
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <a href="/" className="text-xs text-slate-500 hover:text-slate-300">← Back to Home</a>
        </div>

      </div>
    </div>
  );
}