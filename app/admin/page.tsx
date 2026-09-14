"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard() {
  const [pendingMaterials, setPendingMaterials] = useState<any[]>([]);

  useEffect(() => {
    fetchPendingMaterials();
  }, []);

  const fetchPendingMaterials = async () => {
    // Sirf wahi files layenge jo abhi 'pending' hain
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (data) {
      setPendingMaterials(data);
    }
  };

  const handleApprove = async (id: string) => {
    // Database me file ka status 'pending' se 'approved' kar denge
    const { error } = await supabase
      .from("materials")
      .update({ status: "approved" })
      .eq("id", id);

    if (!error) {
      alert("Material Approved! Ab yeh main page par dikhega.");
      fetchPendingMaterials(); // List ko turant refresh karne ke liye
    } else {
      alert("Error: " + error.message);
    }
  };

  const handleReject = async (id: string) => {
    // Agar file theek nahi hai, toh use database se delete kar denge
    const { error } = await supabase
      .from("materials")
      .delete()
      .eq("id", id);

    if (!error) {
      alert("Material Rejected and Deleted.");
      fetchPendingMaterials();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-red-400 mb-8">Admin Moderation Queue</h1>
        
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-2">
            Pending Approvals ({pendingMaterials.length})
          </h2>

          {pendingMaterials.length === 0 ? (
            <p className="text-gray-500 text-lg">Koi naya material pending nahi hai.</p>
          ) : (
            <div className="space-y-4">
              {pendingMaterials.map((mat) => (
                <div key={mat.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium text-lg">{mat.title}</h3>
                    <a href={mat.file_url} target="_blank" className="text-blue-400 text-sm hover:underline">
                      Preview Document
                    </a>
                  </div>
                  <div className="space-x-3">
                    <button 
                      onClick={() => handleApprove(mat.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(mat.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}