import {
  FaCheckCircle,
  FaListOl,
  FaDollarSign,
  FaPlus,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { SummaryRow } from "./SummaryRow";
import { Link } from "react-router-dom";

export const OrderSummary = ({
  totalItems,
  totalPrice,
  totalDuration,
  unavailableItems,
  placingOrder,
  handlePlaceOrder,
}) => (
  <div className="lg:col-span-1 flex flex-col gap-4 sticky top-6">
    <div className="bg-white rounded-2xl shadow-md border border-base-300 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaCheckCircle className="text-success" /> Order Summary
      </h2>
      <div className="space-y-2 mb-4">
        <SummaryRow
          label={`Items (${totalItems})`}
          value={`$${totalPrice.toFixed(2)}`}
          icon={<FaListOl className="text-base-content/60" />}
        />
        <SummaryRow
          label="Service Fee"
          value="Free"
          icon={<FaPlus className="text-primary" />}
        />
        <SummaryRow
          label="Total Duration"
          value={`${totalDuration} hrs`}
          icon={<FaClock className="text-secondary" />}
        />
        <SummaryRow
          label="Total"
          value={`$${totalPrice.toFixed(2)}`}
          icon={<FaDollarSign className="text-orange-600" />}
          bold
        />
      </div>
      <button
        className="btn btn-primary btn-lg w-full gap-2 mt-4"
        disabled={
          unavailableItems.length > 0 || totalItems === 0 || placingOrder
        }
        onClick={handlePlaceOrder}
      >
        <FaCheckCircle /> {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
      <Link to="/services" className="btn btn-outline btn-lg w-full gap-2 mt-2">
        Continue Shopping <FaArrowRight />
      </Link>
      <div className="mt-6 pt-4 border-t flex items-center justify-center gap-2 text-sm text-base-content/60">
        <FaCheckCircle className="text-success" />{" "}
        <span>Secure checkout · SSL encrypted</span>
      </div>
    </div>
  </div>
);
