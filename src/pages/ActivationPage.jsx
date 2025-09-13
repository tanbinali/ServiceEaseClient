import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import authApiClient from "../services/auth-api-client";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaSignInAlt,
  FaEnvelope,
} from "react-icons/fa";

const ActivationPage = () => {
  const { uid, token } = useParams();
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await authApiClient.post("/auth/users/activation/", {
          uid,
          token,
        });
        setStatus("success");
        setMessage("Account activated successfully! You can now log in.");
      } catch (err) {
        setStatus("error");
        setMessage("Activation failed. The link may be invalid or expired.");
      }
    };

    activateAccount();
  }, [uid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-8">
      <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="card-body p-8 text-center">
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`p-4 rounded-2xl ${
                status === "loading"
                  ? "bg-info/10"
                  : status === "success"
                  ? "bg-success/10"
                  : "bg-error/10"
              }`}
            >
              {status === "loading" ? (
                <FaSpinner className="text-4xl text-info animate-spin" />
              ) : status === "success" ? (
                <FaCheckCircle className="text-4xl text-success" />
              ) : (
                <FaTimesCircle className="text-4xl text-error" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="card-title justify-center text-2xl font-bold text-base-content mb-4">
            {status === "loading"
              ? "Activating Account"
              : status === "success"
              ? "Activation Successful"
              : "Activation Failed"}
          </h2>

          {/* Message */}
          <p className="text-base-content/70 mb-6 leading-relaxed">
            {status === "loading"
              ? "Please wait while we activate your account..."
              : message}
          </p>

          {/* Additional Info */}
          {status === "error" && (
            <div className="bg-base-200 rounded-lg p-4 mb-6 text-sm text-base-content/60">
              <FaEnvelope className="inline mr-2" />
              If you need assistance, please contact support.
            </div>
          )}

          {/* Action Buttons */}
          <div className="card-actions justify-center">
            {status === "success" ? (
              <Link to="/login" className="btn btn-primary gap-2 w-full">
                <FaSignInAlt /> Go to Login
              </Link>
            ) : status === "error" ? (
              <div className="flex flex-col gap-3 w-full">
                <Link to="/resend-activation" className="btn btn-outline gap-2">
                  <FaEnvelope /> Resend Activation Email
                </Link>
                <Link to="/" className="btn btn-ghost gap-2">
                  Return to Home
                </Link>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex justify-center mb-4">
                  <span className="loading loading-dots loading-lg text-primary"></span>
                </div>
                <p className="text-sm text-base-content/60">
                  This may take a moment...
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-base-300">
            <p className="text-sm text-base-content/50">
              Having trouble? Contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
