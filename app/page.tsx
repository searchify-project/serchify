"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


export default function Home() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMaterials();
    checkUser();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    // Home page par sirf 'approved' materials dikhenge
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMaterials(data);
    }
    setLoading(false);
  };

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      
      // Direct hardcoded safety check for your email + Database check
      if (session.user.email === "atul114p@gmail.com") {
        setIsAdmin(true);
      }

      // Database ke profiles table se role check karo
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!error && profile && profile.role === "admin") {
        setIsAdmin(true);
      }
    }
  };

  const handleProfileClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push("/profile");
    } else {
      router.push("/login");
    }
    setMenuOpen(false);
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white overflow-x-hidden relative">
      
      {/* Background Red & Blue Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none transition-all duration-700"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none transition-all duration-700"></div>

      {/* --- INITIAL LANDING / SPLASH STATE --- */}
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center absolute inset-0 transition-all duration-500 ease-in-out ${isSearching ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100 z-20'}`}>
        <div className="space-y-6 max-w-md w-full">
          
          {/* Center Logo with Search Icon */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-red-600 p-0.5 shadow-2xl shadow-blue-500/20 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-red-500 bg-clip-text text-transparent">
              Searchify
            </h1>
            <p className="text-slate-400 text-sm mt-2">Your open-source decentralized study hub</p>
          </div>

          {/* Search Anything Button */}
          <div className="pt-4">
            <button
              onClick={() => setIsSearching(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white font-semibold shadow-xl shadow-red-500/15 transition-all transform active:scale-95 flex items-center justify-center gap-3 text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search anything...
            </button>
          </div>

        </div>
      </div>

      {/* --- MAIN SEARCH & DASHBOARD STATE --- */}
      <div className={`max-w-5xl mx-auto px-4 py-8 transition-all duration-500 ease-in-out ${!isSearching ? 'opacity-0 pointer-events-none scale-105 absolute inset-0' : 'opacity-100 scale-100 relative z-10'}`}>
        
        {/* Header with Logo + Name and 3-Lines Hamburger Menu */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-800/80 pb-4 relative">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsSearching(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-red-600 p-0.5 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
              Searchify
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/upload" 
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              + Upload
            </a>

            {/* 3-Lines Hamburger Button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center gap-1.5 shadow-md transition-all text-slate-200 focus:outline-none"
            >
              <span className={`w-5 h-0.5 bg-slate-200 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-slate-200 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-5 h-0.5 bg-slate-200 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </header>

        {/* --- SMOOTH SLIDING DRAWER / MENU --- */}
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)}>
          <div 
            className={`absolute top-0 right-0 w-80 h-full bg-slate-900 border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
                  Navigation Menu
                </h2>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                >
                  ✕ Close
                </button>
              </div>

              {/* User Quick Info Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
                <p className="text-xs text-slate-400">Logged in as:</p>
                <p className="text-sm font-semibold text-slate-200 truncate mt-1">
                  {user ? user.email : "Guest User"}
                </p>
                {isAdmin && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-full">
                    ADMIN ACCOUNT
                  </span>
                )}
              </div>

              {/* Menu Links */}
              <div className="space-y-3">
                <button 
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-sm font-medium transition-all text-left"
                >
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user ? "View Profile" : "Login / Register"}
                </button>

                <a 
                  href="/upload" 
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-sm font-medium transition-all"
                >
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Material
                </a>

                {/* CONDITIONAL ADMIN PANEL LINK: Sirf Admin ko dikhega */}
                {isAdmin && (
                  <a 
                    href="/admin" 
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-red-600/20 hover:from-blue-600/30 hover:to-red-600/30 border border-red-500/30 text-red-300 text-sm font-semibold transition-all shadow-md"
                  >
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin Approval Panel
                  </a>
                )}
              </div>
            </div>

            {/* Footer inside drawer */}
            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
              Searchify Hub • v1.0 PWA
            </div>
          </div>
        </div>

        {/* Big Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-3xl mx-auto">
            <input 
              autoFocus={isSearching}
              type="text" 
              placeholder="Search study materials, subjects, or notes..."
              className="w-full px-6 py-4.5 pl-14 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 shadow-2xl transition-all text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-6 h-6 text-red-500 absolute left-4.5 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading resources...</div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <p className="text-slate-400 text-lg">No results found.</p>
            <p className="text-slate-600 text-sm mt-1">Try a different keyword or check back later.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredMaterials.map((mat) => (
              <div 
                key={mat.id} 
                className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                        {mat.semester}
                      </span>
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full border border-red-500/20">
                        {mat.material_type || "Notes"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(mat.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-1">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Subject: <span className="text-slate-200">{mat.subject}</span></p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">PDF Document</span>
                  <a 
                    href={mat.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-500/10"
                  >
                    Download PDF
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}