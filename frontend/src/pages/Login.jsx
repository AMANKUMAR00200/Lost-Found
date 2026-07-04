import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";


function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      // Save Token
      localStorage.setItem("token", res.data.token);

      // Save User
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful");

      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div
        className="
w-full
max-w-md
rounded-3xl
bg-white/80
backdrop-blur-xl
border
border-white
shadow-2xl
p-8
"
      >
        <h1 className="text-4xl font-extrabold text-center text-slate-800">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to continue using Lost & Found
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-4 text-gray-400" />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
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
focus:ring-blue-500
"
            />
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-4 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="
w-full
rounded-xl
border
border-gray-300
py-3
pl-12
pr-12
outline-none
focus:ring-2
focus:ring-blue-500
"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>

            <Link
              to="/forgot-password"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
  type="submit"
  disabled={loading}
  className={`
    w-full
    rounded-2xl
    py-4
    font-bold
    text-lg
    text-white
    transition-all
    duration-300
    flex
    items-center
    justify-center
    gap-3
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] hover:shadow-xl"
    }
  `}
>
  {loading ? (
    <>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      Signing In...
    </>
  ) : (
    <>
      Login
      →
    </>
  )}
</button>
<div className="flex items-center my-7">

<div className="flex-1 h-px bg-gray-300"></div>

<span className="px-4 text-gray-500 text-sm">
OR CONTINUE WITH
</span>

<div className="flex-1 h-px bg-gray-300"></div>

</div>
<button
  type="button"
  onClick={() => toast("Google Login Coming Soon")}
  className="
    w-full
    border
    rounded-2xl
    py-3
    font-semibold
    flex
    items-center
    justify-center
    gap-3
    hover:bg-gray-50
    transition
"
>

<img
src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
className="w-6"
/>

Continue with Google

</button>
<button
type="button"
onClick={()=>toast("Microsoft Login Coming Soon")}
className="
w-full
mt-4
border
rounded-2xl
py-3
font-semibold
flex
items-center
justify-center
gap-3
hover:bg-gray-50
transition
"
>

<img
src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
className="w-6"
/>

Continue with Microsoft

</button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="
font-bold
text-indigo-600
hover:text-indigo-700
transition
"
          >
            Register
          </Link>
        </p>
        <div className="mt-8 text-center text-xs text-gray-400">

Protected by Secure Authentication

</div>
        
      </div>
    </div>
  );
}

export default Login;
