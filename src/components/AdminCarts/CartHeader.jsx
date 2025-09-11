import {
  FaUserCircle,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { CartBadge } from "./CartBadge";

export const CartHeader = ({ cart, renderTotalDuration }) => (
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
    {/* User Info */}
    <div className="flex items-center gap-4">
      <div className="bg-primary/10 p-3 rounded-2xl">
        <FaUserCircle className="text-2xl text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-base-content">
          Cart #{cart.id}
        </h3>
        <p className="text-base-content/60">User ID: {cart.user}</p>
      </div>
    </div>

    {/* Badges */}
    <div className="flex flex-wrap gap-4">
      <CartBadge icon={FaDollarSign} value={`$${cart.totalPrice.toFixed(2)}`} />
      <CartBadge
        icon={FaClock}
        value={renderTotalDuration(cart.totalDuration)}
      />
      <CartBadge
        icon={FaCheckCircle}
        value={`${cart.itemCount} item${cart.itemCount !== 1 ? "s" : ""}`}
      />
    </div>
  </div>
);
