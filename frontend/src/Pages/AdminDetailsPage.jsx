import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDetailsPage({ onAuthSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    lang: "English",
    department: "",
    employeeId: "",
    phone: "",
    district: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.department || !form.employeeId) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || "Unable to create admin account.");
        return;
      }

      onAuthSuccess?.({ token: data.token, role: data?.user?.role || "admin" });
      navigate("/admin");
    } catch (requestError) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-stone-800 mb-1">Add Admin Details</h1>
        <p className="text-sm text-stone-500 mb-6">Create a role-based admin account.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Full name*" value={form.name} onChange={handleChange("name")} />
          <input className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Email*" value={form.email} onChange={handleChange("email")} />
          <input className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Password*" type="password" value={form.password} onChange={handleChange("password")} />
          <input className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Department*" value={form.department} onChange={handleChange("department")} />
          <input className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Employee ID*" value={form.employeeId} onChange={handleChange("employeeId")} />
          <input className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Phone" value={form.phone} onChange={handleChange("phone")} />
          <input className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm sm:col-span-2" placeholder="District" value={form.district} onChange={handleChange("district")} />
          <select className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm sm:col-span-2" value={form.lang} onChange={handleChange("lang")}>
            <option>English</option>
            <option>हिंदी</option>
            <option>বাংলা</option>
            <option>தமிழ்</option>
          </select>
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={() => navigate("/")} className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-700">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm">
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}
