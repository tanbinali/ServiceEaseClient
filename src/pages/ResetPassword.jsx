import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import authApiClient from "../services/auth-api-client";
import {
  FaEnvelope,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaKey,
} from "react-icons/fa";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await authApiClient.post("/auth/users/reset_password/", data);
      setMessage("Password reset instructions have been sent to your email!");
    } catch (err) {
      setError(
        err.response?.data?.email?.[0] ||
          "Failed to send password reset email. Please try again."
      );
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
              Reset Password
            </h2>
            <p className="text-base-content/70">
              Enter your email address to receive password reset instructions
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

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  placeholder="Enter your email address"
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

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full gap-2 py-3 text-lg ${
                loading ? "loading" : ""
              }`}
            >
              {!loading && <FaPaperPlane />}
              {loading ? "Sending Instructions..." : "Send Reset Instructions"}
            </button>
          </form>

          {/* Additional Information */}
          <div className="bg-base-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-base-content mb-2">
              What to expect:
            </h3>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• Check your inbox for a password reset link</li>
              <li>• The link will expire for security reasons</li>
              <li>• If you don't see the email, check your spam folder</li>
            </ul>
          </div>

          {/* Links Section */}
          <div className="space-y-4 mt-8 pt-6 border-t border-base-300">
            <div className="text-center">
              <Link
                to="/login"
                className="text-primary hover:text-primary-focus font-semibold text-sm flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>

            <div className="text-center">
              <p className="text-base-content/70 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-focus font-semibold"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-base-content/50">
              For security reasons, password reset links expire after a short
              time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
