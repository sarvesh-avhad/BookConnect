import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import { GoogleLogin } from "@react-oauth/google";
import Logo from "../../assets/images/Logo.png";

// Shared SVGs
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
  </svg>
);

const DiscoverIcon = () => (
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
  </svg>
);

const ExchangeIcon = () => (
  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
  </svg>
);

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login clicked", form);

    try {
      const res = await api.post("/users/login", form);
      console.log("Response:", res.data);

      login(res.data);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      showToast(err.response?.data?.message || "Invalid email or password", "error");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/users/google", {
        token: credentialResponse.credential,
      });
      login(res.data);
      navigate("/");
    } catch (err) {
      console.error("Google Login Error:", err);
      showToast("Google Login failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE2D4] flex items-center justify-center p-4 sm:p-8 font-sans">

      {/* Outer Most Container */}
      <div className="w-full max-w-[1200px] border border-black rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-none">

        {/* Left Side: Branding (Off-White Cream) */}
        <div className="w-full md:w-1/2 bg-[#F7F3E8] flex flex-col justify-between py-12 px-6 sm:px-12 relative min-h-[600px] border-r border-black md:border-r-0">

          {/* Top Logo Area */}
          <div className="flex flex-col items-center pt-2 w-full text-center">
            <div className="mb-3 flex items-center justify-center">
              <img src={Logo} alt="Book Connect Logo" className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-sm" />
            </div>

            <div className="flex items-center space-x-3 mb-1 justify-center">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-[0.2em] text-[#111]">BOOK CONNECT</h1>
            </div>
            <p className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.3em] text-gray-500 uppercase mt-1">READ • SHARE • EXCHANGE</p>
          </div>

          {/* Middle Image Area */}
          <div className="w-full flex-grow flex items-center justify-center py-6">
            <img
              src="/images/auth-bg.png"
              alt="Aesthetic Books"
              className="w-full max-w-[550px] object-cover drop-shadow-sm mix-blend-multiply aspect-[4/3] sm:aspect-auto"
            />
          </div>

          {/* Bottom 3 Icons Area */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center w-full px-2">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#F3D59D] rounded-xl flex items-center justify-center mb-3">
                <DiscoverIcon />
              </div>
              <h3 className="text-xs font-bold text-[#111] mb-1 leading-tight">Discover Books</h3>
              <p className="text-[0.65rem] text-gray-600 leading-tight">Explore recommendations</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#C9EBD2] rounded-xl flex items-center justify-center mb-3">
                <ShareIcon />
              </div>
              <h3 className="text-xs font-bold text-[#111] mb-1 leading-tight">Share Thoughts</h3>
              <p className="text-[0.65rem] text-gray-600 leading-tight">Engage with readers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#C3DEFA] rounded-xl flex items-center justify-center mb-3">
                <ExchangeIcon />
              </div>
              <h3 className="text-xs font-bold text-[#111] mb-1 leading-tight">Exchange Books</h3>
              <p className="text-[0.65rem] text-gray-600 leading-tight">Request & trade easily</p>
            </div>
          </div>

        </div>

        {/* Right Side: Form Container (Beige Wrapper) */}
        <div className="w-full md:w-1/2 bg-[#EBE2D4] p-6 lg:p-12 flex flex-col justify-center items-center relative">

          {/* Inner White Form Card */}
          <div className="bg-[#F7F3E8] rounded-2xl border border-black p-8 sm:p-10 w-full max-w-[450px]">

            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-[#111] mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-gray-600 font-medium tracking-wide">Sign in to continue your reading journey</p>
            </div>

            <form onSubmit={handleSubmit} className="text-left space-y-5">

              <div>
                <label className="block text-xs font-bold text-[#111] mb-2 tracking-wide">Email or Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserIcon />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email or username"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-black/30 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500 font-medium text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111] mb-2 tracking-wide">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-black/30 rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500 font-medium text-black"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer">
                    <EyeIcon />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-black/30 text-[#E78B00] focus:ring-[#E78B00] cursor-pointer accent-[#E78B00]" defaultChecked />
                  <span className="text-[0.8rem] font-bold text-[#111]">Remember me</span>
                </label>
                <a href="#" className="text-[0.8rem] font-bold text-[#D96B00] hover:text-[#111] transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E58500] hover:bg-[#D97900] text-[#111] border border-black font-bold py-3 rounded-lg shadow-[3px_3px_0px_#000] active:shadow-[0px_0px_0px_#000] active:translate-y-[3px] active:translate-x-[3px] transition-all tracking-wider text-[0.9rem] mt-4"
              >
                LOGIN
              </button>

            </form>

            <div className="my-6 flex items-center justify-center relative">
              <div className="absolute w-full border-t border-black/20"></div>
              <span className="bg-[#F7F3E8] px-4 text-[0.75rem] text-gray-500 relative z-10 font-bold">or continue with</span>
            </div>

            <div className="w-full mb-6">
              <div className="relative overflow-hidden rounded-lg h-[44px] border border-black flex items-center justify-center font-bold text-[0.8rem] tracking-wide bg-transparent transition-colors cursor-pointer hover:bg-black/5 w-full">
                <div className="absolute inset-0 opacity-0 z-20 cursor-pointer flex justify-center items-center overflow-hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => alert("Google Login failed")}
                    width="100%"
                  />
                </div>
                <div className="flex items-center justify-center w-full h-full relative z-10 pointer-events-none transition-colors px-4">
                  <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-[#111] text-center mt-4">
              Don't have an account? <Link to="/signup" className="text-[#D96B00] hover:text-[#111] transition-colors ml-1">Create Account</Link>
            </p>

          </div>

          <div className="mt-8 text-center text-[0.65rem] text-gray-600 font-medium px-4">
            By continuing, you agree to our <a href="#" className="font-bold text-[#D96B00]">Terms of Service</a> and <a href="#" className="font-bold text-[#D96B00]">Privacy Policy</a>.
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
