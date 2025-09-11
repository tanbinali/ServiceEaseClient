import { motion } from "framer-motion";

const TextAreaField = ({ label, error, ...rest }) => (
  <motion.div
    className="md:col-span-2"
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
    <textarea
      className={`textarea textarea-bordered w-full h-28 resize-y ${
        error ? "input-error" : ""
      }`}
      {...rest}
    />
    {error && <p className="text-error text-xs mt-1">{error.message}</p>}
  </motion.div>
);

export default TextAreaField;
