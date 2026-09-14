"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
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

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
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
              Serchify
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
        
        {/* Header with Logo + Name and Profile Circle */}
        <header className="flex justify-between items-center mb-8 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsSearching(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-red-600 p-0.5 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
              Serchify
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/upload" 
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              + Upload
            </a>
            {/* Profile Circle Sign */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-red-500 p-0.5 shadow-md flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-slate-200">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Big Search Bar (Auto-focused for Mobile/PC) */}
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
                    <span className="px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full border border-red-500/20">
                      Verified Note
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(mat.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-4">
                    {mat.title}
                  </h3>
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