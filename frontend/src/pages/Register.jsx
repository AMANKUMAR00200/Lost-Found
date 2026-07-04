import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Registration Successful");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div
        className="
w-full
max-w-md
rounded-3xl
bg-white/80
backdrop-blur-xl
shadow-2xl
border
border-white
p-8
"
      >
        <h1 className="text-3xl font-bold text-center text-slate-800">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Register to start reporting lost & found items
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User size={20} className="absolute left-4 top-4 text-gray-400" />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="
w-full
rounded-xl
border
border-gray-300
py-3
pl-12
pr-4
outline-none
focus:ring-2
focus:ring-green-500
"
            />
          </div>

          <div className="relative">
            <Mail size={20} className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="
w-full
rounded-xl
border
border-gray-300
py-3
pl-12
pr-4
outline-none
focus:ring-2
focus:ring-green-500
"
            />
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-4 top-4 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="mt-2">
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  form.password.length < 4
                    ? "w-1/4 bg-red-500"
                    : form.password.length < 8
                      ? "w-2/4 bg-yellow-500"
                      : form.password.length < 12
                        ? "w-3/4 bg-blue-500"
                        : "w-full bg-green-500"
                }`}
              />
            </div>

            <p className="text-xs mt-1 text-gray-500">
              {form.password.length < 4
                ? "Weak Password"
                : form.password.length < 8
                  ? "Medium Password"
                  : form.password.length < 12
                    ? "Strong Password"
                    : "Very Strong Password"}
            </p>
          </div>
          <div className="relative mt-5">
            <CheckCircle
              size={20}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`
    w-full
    rounded-2xl
    py-4
    mt-6
    text-lg
    font-bold
    text-white
    transition-all
    duration-300
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-[1.02] hover:shadow-xl"
    }
  `}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>

            <span className="px-3 text-xs text-gray-500">OR CONTINUE WITH</span>

            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <button
            type="button"
            onClick={() => toast("Google Sign Up Coming Soon")}
            className="w-full rounded-2xl border py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => toast("Microsoft Sign Up Coming Soon")}
            className="w-full rounded-2xl border py-3 mt-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              className="w-5 h-5"
              alt="Microsoft"
            />
            Continue with Microsoft
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="font-bold text-green-600 hover:text-green-700"
          >
            Login
          </Link>
        </p>

        <div className="mt-5 text-center text-xs text-gray-400">
          Secure Registration • Lost & Found Platform
        </div>
      </div>
    </div>
  );
}

export default Register;
