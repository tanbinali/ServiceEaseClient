import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaSpinner,
  FaEnvelope,
  FaLock,
  FaUserPlus,
  FaKey,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, duration: 0.6 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

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
    clearErrors();
    setLoading(true);
    clearErrors();
    setSuccessMsg("");

    try {
      const res = await loginUser(data);

      if (res.success) {
        setSuccessMsg("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else if (res.fieldErrors?.detail) {
        // Show backend detail as general error
        setError("general", {
          type: "server",
          message: res.fieldErrors.detail,
        });
      } else {
        setError("general", {
          type: "server",
          message: "Login failed. Please check your credentials.",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("general", {
        type: "server",
        message: "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="card w-full max-w-md shadow-2xl bg-base-100 border border-base-300 overflow-hidden"
        variants={itemVariants}
      >
        <motion.div className="card-body p-8" variants={itemVariants}>
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.div
              className="flex justify-center mb-4"
              variants={itemVariants}
            >
              <div className="p-3 bg-primary/10 rounded-2xl">
                <FaSignInAlt className="text-4xl text-primary" />
              </div>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-base-content mb-2"
              variants={itemVariants}
            >
              Welcome Back
            </motion.h2>
            <motion.p className="text-base-content" variants={itemVariants}>
              Sign in to your ServiceEase account
            </motion.p>
          </motion.div>

          {/* General error message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                className="alert alert-error mb-6 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                role="alert"
              >
                <FaExclamationCircle className="text-lg" />
                <span>{errors.general.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                className="alert alert-success mb-6 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                role="alert"
              >
                <FaSignInAlt />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Email */}
            <motion.div className="form-control" variants={itemVariants}>
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
                    onChange: () => clearErrors("general"),
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.email ? "input-error" : ""
                  }`}
                  disabled={loading}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="email-error"
                />
              </div>
              {errors.email && (
                <motion.p
                  id="email-error"
                  className="text-error mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="alert"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div className="form-control" variants={itemVariants}>
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
                    onChange: () => clearErrors("general"),
                  })}
                  className={`input input-bordered w-full pl-12 pr-12 py-3 ${
                    errors.password ? "input-error" : ""
                  }`}
                  disabled={loading}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-base-content/40 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  id="password-error"
                  className="text-error mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="alert"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex justify-center gap-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSignInAlt />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </motion.form>

          {/* Links */}
          <motion.div
            className="mt-8 text-center space-y-4"
            variants={itemVariants}
          >
            <Link
              to="/reset-password"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-focus"
              tabIndex={0}
            >
              <FaKey /> Forgot password?
            </Link>
            <p className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-focus"
                tabIndex={0}
              >
                <FaUserPlus /> Create Account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
