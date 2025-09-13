import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import {
  FaUserPlus,
  FaEnvelope,
  FaUser,
  FaLock,
  FaKey,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    clearErrors();
    setSuccessMsg("");

    try {
      const { confirmPassword, ...payload } = data;

      await registerUser(payload);

      setLoading(false);
      setSuccessMsg(
        "Registration successful! Please check your email to activate your account."
      );
    } catch (err) {
      setLoading(false);
      const res = err.response?.data;
      if (res) {
        for (const [field, messages] of Object.entries(res)) {
          setError(field, {
            type: "server",
            message: Array.isArray(messages) ? messages.join(" ") : messages,
          });
        }
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 px-4"
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
                <FaUserPlus className="text-4xl text-primary" />
              </div>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-center mb-2"
              variants={itemVariants}
            >
              Create Account
            </motion.h2>
            <motion.p
              className="text-center text-base-content/70"
              variants={itemVariants}
            >
              Join ServiceEase and discover amazing services
            </motion.p>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {(errorMsg || errors.general) && (
              <motion.div
                className="alert alert-error mb-6 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                role="alert"
              >
                <FaExclamationTriangle className="text-lg" />
                <span>{errorMsg || errors.general?.message}</span>
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
                role="alert"
              >
                <FaCheckCircle className="text-lg" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
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
                      value: /^\S+@\S+$/,
                      message: "Please enter a valid email address",
                    },
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
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Username */}
            <motion.div className="form-control" variants={itemVariants}>
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
                      message: "Only letters, numbers and @/./+/-/_ allowed",
                    },
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.username ? "input-error" : ""
                  }`}
                  disabled={loading}
                  aria-invalid={errors.username ? "true" : "false"}
                  aria-describedby="username-error"
                />
              </div>
              {errors.username && (
                <motion.p
                  id="username-error"
                  className="text-error mt-2"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.username.message}
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
                  type="password"
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters required",
                    },
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.password ? "input-error" : ""
                  }`}
                  disabled={loading}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby="password-error"
                />
              </div>
              {errors.password && (
                <motion.p
                  id="password-error"
                  className="text-error mt-2"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div className="form-control" variants={itemVariants}>
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
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`input input-bordered w-full pl-12 pr-4 py-3 ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  disabled={loading}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby="confirmPassword-error"
                />
              </div>
              {errors.confirmPassword && (
                <motion.p
                  id="confirmPassword-error"
                  className="text-error mt-2"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full py-3 text-lg flex justify-center items-center gap-2 ${
                loading ? "loading" : ""
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {!loading && <FaUserPlus />}
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </motion.form>

          {/* Additional info and links */}
          {/* Additional info and links */}
          <motion.div
            className="mt-8 text-center space-y-4"
            variants={itemVariants}
          >
            {successMsg && (
              <motion.div
                className="alert alert-success flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaCheckCircle />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Only show this after user pressed submit (success or error) */}
            {(successMsg || errorMsg) && (
              <Link
                to="/resend-activation"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-focus"
                tabIndex={0}
              >
                <FaEnvelope /> Resend Activation Email
              </Link>
            )}

            <p className="text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-focus"
                tabIndex={0}
              >
                <FaArrowLeft /> Sign In
              </Link>
            </p>

            <p className="text-xs mt-4 text-base-content/50">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
