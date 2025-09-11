import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaKey,
} from "react-icons/fa";

const Login = () => {
  const { loginUser } = useAuthContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    clearErrors();
    setSuccessMsg("");

    const res = await loginUser(data);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else if (res.fieldErrors) {
      Object.entries(res.fieldErrors).forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
    } else if (res.message) {
      setError("general", { type: "server", message: res.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-4 py-8">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <FaSignInAlt className="text-4xl text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-base-content mb-2">
              Welcome Back
            </h2>
            <p className="text-base-content/70">
              Sign in to your ServiceEase account
            </p>
          </div>

          {/* Messages */}
          {errors.general && (
            <div className="alert alert-error mb-6">
              <div className="flex-1">
                <FaKey className="w-6 h-6" />
                <label>{errors.general.message}</label>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success mb-6">
              <div className="flex-1">
                <FaSignInAlt className="w-6 h-6" />
                <label>{successMsg}</label>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-base-content/40">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.email ? "input-error" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-error text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-base-content/40">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`input input-bordered w-full pl-12 pr-12 py-3 ${
                    errors.password ? "input-error" : ""
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-base-content/40 hover:text-base-content/60"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full gap-2 py-3 text-lg"
            >
              <FaSignInAlt className="mr-2" />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Links Section */}
          <div className="space-y-4 mt-8 pt-6 border-t border-base-300">
            <div className="text-center">
              <Link
                to="/reset-password"
                className="text-primary hover:text-primary-focus font-semibold text-sm flex items-center justify-center gap-2"
              >
                <FaKey className="w-4 h-4" />
                Forgot your password?
              </Link>
            </div>

            <div className="text-center">
              <p className="text-base-content/70 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-focus font-semibold flex items-center justify-center gap-2 mt-2"
                >
                  <FaUserPlus className="w-4 h-4" />
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
