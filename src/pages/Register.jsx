import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApiClient from "../services/auth-api-client";
import {
  FaUserPlus,
  FaEnvelope,
  FaUser,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...payload } = data;

      await authApiClient.post("/auth/users/", payload);

      setLoading(false);
      setSuccessMsg(
        "Registration successful! Please check your email to activate your account."
      );
    } catch (err) {
      setLoading(false);
      if (err.response?.data) {
        Object.entries(err.response.data).forEach(([key, val]) => {
          setError(key, {
            type: "server",
            message: Array.isArray(val) ? val.join(" ") : val,
          });
        });
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-4 py-20">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <FaUserPlus className="text-4xl text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-base-content mb-2">
              Create Account
            </h2>
            <p className="text-base-content/70">
              Join ServiceEase and discover amazing services
            </p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="alert alert-error mb-6">
              <div className="flex-1">
                <FaExclamationTriangle className="w-6 h-6" />
                <label>{errorMsg}</label>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success mb-6">
              <div className="flex-1">
                <FaCheckCircle className="w-6 h-6" />
                <label>{successMsg}</label>
              </div>
            </div>
          )}

          {/* Registration Form */}
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

            {/* Username Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Username</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-base-content/40">
                  <FaUser />
                </span>
                <input
                  type="text"
                  placeholder="Choose a username"
                  {...register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^[\w.@+-]+$/,
                      message:
                        "Username can only contain letters, numbers, and @/./+/-/_",
                    },
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.username ? "input-error" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.username && (
                <p className="text-error text-sm mt-2">
                  {errors.username.message}
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
                  type="password"
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.password ? "input-error" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-error text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-base-content/40">
                  <FaLock />
                </span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full gap-2 py-3 text-lg ${
                loading ? "loading" : ""
              }`}
            >
              {!loading && <FaUserPlus />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Links Section */}
          {successMsg && (
            <div className="space-y-4 mt-8 pt-6 border-t border-base-300">
              <div className="text-center">
                <Link
                  to="/resend-activation"
                  className="text-primary hover:text-primary-focus font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <FaEnvelope className="w-4 h-4" />
                  Resend Activation Email
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-4 mt-4 text-center">
            <p className="text-base-content/70 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-focus font-semibold flex items-center justify-center gap-2 mt-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                Sign In
              </Link>
            </p>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-base-content/50">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
