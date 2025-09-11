import { motion } from "framer-motion";

const InputField = ({
  label,
  type = "text",
  fullWidth = false,
  error,
  ...rest
}) => (
  <motion.div
    className={fullWidth ? "md:col-span-2" : ""}
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    }}
  >
    <label className="label">
      <span className="label-text font-semibold">{label}</span>
    </label>
    <input
      type={type}
      className={`input input-bordered w-full ${error ? "input-error" : ""}`}
      {...rest}
    />
    {error && <p className="text-error text-xs mt-1">{error.message}</p>}
  </motion.div>
);

export default InputField;
