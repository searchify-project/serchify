"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert("Title aur File dono zaroori hain!");

    setLoading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage.from("study-materials").upload(`public/${fileName}`, file);

    if (uploadError) {
      alert("File upload fail: " + uploadError.message);
      setLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase
      .storage.from("study-materials").getPublicUrl(`public/${fileName}`);

    const { error: dbError } = await supabase
      .from("materials").insert([{ 
          title: title, 
          file_url: publicUrlData.publicUrl,
          status: "pending" 
      }]);

    setLoading(false);
    if (dbError) {
      alert("Database error: " + dbError.message);
    } else {
      alert("Material successfully upload ho gaya (Admin approval ke liye pending)!");
      setTitle("");
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form onSubmit={handleUpload} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Study Material</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Topic / Title</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="e.g. BCA Semester 1 Notes"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload PDF</label>
          <input 
            type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {loading ? "Uploading..." : "Submit Material"}
        </button>
      </form>
    </div>
  );
}