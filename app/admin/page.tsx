"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Aapka official Admin email
const ADMIN_EMAIL = "atul114p@gmail.com";


export default function AdminPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("Please login first!");
      router.push("/login");
      return;
    }

    // 1. Direct email match check
    if (session.user.email === ADMIN_EMAIL) {
      setIsAdmin(true);
      fetchPendingMaterials();
      return;
    }

    // 2. Database profiles table role check
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      alert("Access Denied: You are not an admin!");
      router.push("/");
      return;
    }

    setIsAdmin(true);
    fetchPendingMaterials();
  };

  const fetchPendingMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMaterials(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("materials")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setMaterials(materials.map(m => m.id === id ? { ...m, status } : m));
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <a href="/" className="text-xs text-slate-400 hover:text-white">← Back to Home</a>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
            Admin Approval Panel
          </h1>
          <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-semibold">
            Admin Mode
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading submissions...</div>
        ) : materials.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400">No study materials found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {materials.map((mat) => (
              <div 
                key={mat.id}
                className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {mat.semester}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {mat.material_type || "Notes"}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
                      mat.status === 'approved' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {mat.status ? mat.status.toUpperCase() : 'PENDING'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{mat.title}</h3>
                  <p className="text-xs text-slate-400">Subject: <span className="text-slate-200">{mat.subject}</span> • Uploaded by ID: {mat.user_id}</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <a 
                    href={mat.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700"
                  >
                    View PDF ↗
                  </a>
                  {mat.status !== 'approved' && (
                    <button 
                      onClick={() => updateStatus(mat.id, 'approved')}
                      className="px-4 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold shadow-md shadow-green-600/20"
                    >
                      Approve
                    </button>
                  )}
                  {mat.status !== 'rejected' && (
                    <button 
                      onClick={() => updateStatus(mat.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}