"use client";
import { useEffect, useState } from "react";
import { supabase } from "../upload/lib/supabase";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myMaterials, setMyMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push("/login"); // Agar logged in nahi hai toh login page bhej do
      return;
    }

    setUser(session.user);

    // User ke apne upload kiye hue materials fetch karo
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("user_id", session.user.id) // Sirf current user ke materials
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMyMaterials(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      setMyMaterials(myMaterials.filter(m => m.id !== id));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 relative overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </a>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
            User Profile
          </h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-all"
          >
            Logout
          </button>
        </div>

        {/* User Card */}
        <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-red-600 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-blue-400">
              {user?.email ? user.email[0].toUpperCase() : "U"}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Signed in as</p>
            <p className="text-lg font-bold text-slate-100 mt-1">{user?.email}</p>
            <p className="text-xs text-slate-500 mt-0.5">Account ID: {user?.id}</p>
          </div>
        </div>

        {/* My Uploaded Materials Section */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-200">My Uploaded Materials</h2>
          <a 
            href="/upload" 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 text-white text-xs font-semibold shadow-md"
          >
            + Upload New
          </a>
        </div>

        {myMaterials.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <p className="text-slate-400 text-sm">You haven't uploaded any study materials yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {myMaterials.map((mat) => (
              <div 
                key={mat.id}
                className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                      mat.status === 'approved' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'yellow-500 bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {mat.status ? mat.status.toUpperCase() : 'PENDING'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(mat.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-2">{mat.title}</h3>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
                  <a 
                    href={mat.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline"
                  >
                    View File ↗
                  </a>
                  <button 
                    onClick={() => handleDelete(mat.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}