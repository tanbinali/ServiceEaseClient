import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import authApiClient from "../services/auth-api-client";
import {
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await authApiClient.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password: data.new_password,
        re_new_password: data.confirm_password,
      });

      setMessage("Password reset successfully! Redirecting to login...");
      reset();

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.new_password?.[0] ||
          "Failed to reset password. The link may be invalid or expired."
      );
      console.error(err);
    } finally {
      setLoading(false);
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
                <FaKey className="text-4xl text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-base-content mb-2">
              Set New Password
            </h2>
            <p className="text-base-content/70">
              Create a strong new password for your account
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="alert alert-success mb-6">
              <div className="flex-1">
                <FaCheckCircle className="w-6 h-6" />
                <label>{message}</label>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error mb-6">
              <div className="flex-1">
                <FaExclamationTriangle className="w-6 h-6" />
                <label>{error}</label>
              </div>
            </div>
          )}

          {/* Password Reset Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">New Password</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-base-content/40">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("new_password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`input input-bordered w-full pl-12 pr-12 py-3 ${
                    errors.new_password ? "input-error" : ""
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
              {errors.new_password && (
                <p className="text-error text-sm mt-2">
                  {errors.new_password.message}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.confirm_password ? "input-error" : ""
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.confirm_password && (
                <p className="text-error text-sm mt-2">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-base-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-base-content mb-2">
                Password Requirements:
              </h4>
              <ul className="text-xs text-base-content/60 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Use a combination of letters, numbers, and symbols</li>
                <li>• Avoid common words or patterns</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full gap-2 py-3 text-lg ${
                loading ? "loading" : ""
              }`}
            >
              {!loading && <FaKey />}
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-base-content/50">
              For your security, please choose a strong password that you
              haven't used before.
            </p>
          </div>

          {/* Redirect Notice */}
          {message && (
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
                <FaSignInAlt className="w-4 h-4" />
                <span>Redirecting to login page...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
