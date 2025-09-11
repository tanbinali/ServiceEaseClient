import { motion } from "framer-motion";
import { FaHistory } from "react-icons/fa";

const ServiceHistory = ({ history }) => (
  <motion.div
    className="bg-base-100 p-6 rounded-3xl shadow-lg border border-base-300 mt-12"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
  >
    <div className="flex items-center gap-3 mb-8">
      <FaHistory className="text-3xl text-primary" />
      <h3 className="text-3xl font-bold text-base-content">Service History</h3>
    </div>
    <div className="space-y-6">
      {history.map((order, index) => (
        <motion.div
          key={order.order_id}
          className="border border-base-300 p-6 rounded-2xl bg-base-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.6, duration: 0.4 }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="font-bold text-base-content text-lg">
                Order #{order.order_id}
              </p>
              <p className="text-base-content/60 text-sm">
                {new Date(order.ordered_at).toLocaleDateString()}
              </p>
            </div>
            <motion.div
              className="badge badge-primary badge-lg uppercase"
              whileHover={{ scale: 1.05 }}
            >
              {order.order_status}
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-base-content">
            <div>
              <p className="text-sm text-base-content/60">Total Amount</p>
              <p className="font-semibold text-xl text-primary">
                ${order.total_price}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Services</p>
              <p className="font-semibold">
                {order.services.length} service
                {order.services.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-base-content/60">Order Date</p>
              <p className="font-semibold">
                {new Date(order.ordered_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default ServiceHistory;
