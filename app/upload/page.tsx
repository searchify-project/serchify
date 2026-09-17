"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("Semester 1");
  const [subject, setSubject] = useState("");
  const [materialType, setMaterialType] = useState("Notes");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        alert("Please login first to upload study materials!");
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file || !subject) {
      alert("Please fill all fields and select a PDF file.");
      return;
    }

    setLoading(true);

    try {
      // 1. Unique file name banao
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Supabase Storage mein file upload karo
      const { error: uploadError } = await supabase.storage
        .from("materials")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. File ka Public URL nikalo
      const { data: publicUrlData } = supabase.storage
        .from("materials")
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      // 4. Database mein record save karo (with material_type)
      const { error: dbError } = await supabase.from("materials").insert([
  {
    title,
    semester,
    subject,
    material_type: materialType,
    file_url: fileUrl,
    user_id: user.id,
    status: "pending", // <-- Yahan pending kar do
  },
]);

      if (dbError) throw dbError;

      alert("PDF uploaded and published successfully!");
      router.push("/");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-lg relative z-10">
        
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <a href="/" className="text-xs text-slate-400 hover:text-white">← Back to Home</a>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
            Upload BCA PDF Notes
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Material Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 1 C Programming Notes"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Semester Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Semester</label>
              <select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
              </select>
            </div>

            {/* Material Type Dropdown */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Material Type</label>
              <select 
                value={materialType} 
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="Notes">Study Notes</option>
                <option value="Syllabus">Syllabus</option>
                <option value="Assignment">Assignment</option>
                <option value="PYQs">PYQs (Previous Years)</option>
                <option value="Question Bank">Question Bank</option>
              </select>
            </div>
          </div>

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Subject Name</label>
            <input 
              type="text" 
              required
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Data Structures, DBMS, Software Eng."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Direct File Picker (PDF Only) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Upload PDF Document</label>
            <input 
              type="file" 
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">Only PDF files are allowed.</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white font-semibold shadow-lg shadow-red-500/15 transition-all text-sm mt-4"
          >
            {loading ? "Uploading PDF to Server..." : "Publish Material"}
          </button>

        </form>

      </div>
    </div>
  );
}