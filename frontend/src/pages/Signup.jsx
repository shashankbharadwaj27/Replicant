import { useState } from "react";
import { signupUser } from "../utils/userApi.js";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

export default function Signup() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuthStore();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signupUser({
        username: formData.username,
        password: formData.password,
      });

      if (res?.token && res?.username) {
        auth.login(res.token, res.username);
        navigate("/", { replace: true });
      } else {
        setErrorMsg(res?.msg || "Signup failed. Try again.");
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.msg || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14181C] flex items-center justify-center px-4">
      <div className="bg-[#1E2328] p-8 rounded-xl border border-gray-700 max-w-md w-full space-y-4 shadow-xl">
        <h1 className="text-3xl font-bold text-[#00b020] text-center">
          Sign Up
        </h1>

        {errorMsg && (
          <div className="bg-red-900/40 border border-red-600 text-red-400 px-4 py-2 rounded-lg text-center">
            ⚠ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-3 bg-[#111] text-gray-200 rounded border border-gray-700 focus:outline-none focus:border-[#00b020]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 bg-[#111] text-gray-200 rounded border border-gray-700 focus:outline-none focus:border-[#00b020]"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-[#00b020] text-black py-2 rounded font-semibold transition ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#00c030]"
            }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-gray-400 text-sm mt-2">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#00b020] underline"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
