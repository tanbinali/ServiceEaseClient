import { motion } from "framer-motion";

const ProfileField = ({ icon: Icon, label, value }) => (
  <motion.div
    className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-200"
    variants={{
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
      },
    }}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
  >
    <Icon className="text-primary text-2xl" />
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  </motion.div>
);

export default ProfileField;
