import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaCreditCard,
  FaCalendarAlt,
  FaSyncAlt,
  FaClock,
  FaBoxOpen,
  FaInfoCircle,
  FaClipboardList,
} from "react-icons/fa";
import authApiClient from "../services/auth-api-client";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", color: "badge-warning" },
  { value: "ACCEPTED", label: "Accepted", color: "badge-info" },
  { value: "IN_PROGRESS", label: "In Progress", color: "badge-primary" },
  { value: "COMPLETED", label: "Completed", color: "badge-success" },
  { value: "CANCELLED", label: "Cancelled", color: "badge-error" },
];

const getStatusColor = (status) => {
  const option = STATUS_OPTIONS.find((opt) => opt.value === status);
  return option ? option.color : "badge-neutral";
};

const DashboardOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Determine user role
  const isAdmin = user?.groups?.includes("Admin");

  // Titles and texts based on role
  const pageTitle = isAdmin ? "Orders" : "My Orders";
  const loadingMessage = isAdmin
    ? "Loading all orders..."
    : "Loading your orders...";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await authApiClient.get("api/orders/");
      setOrders(data.results || []);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await authApiClient.patch(`api/orders/${orderId}/`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
      setError("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const parseDurationToHours = (durationStr) => {
    const [hours, minutes, seconds] = durationStr.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <FaSpinner className="animate-spin text-6xl" />
        <p className="text-lg text-base-content/70">{loadingMessage}</p>
      </div>
    );
  }

  if (error)
    return (
      <div className="max-w-md mx-auto mt-16 p-8 rounded-box bg-error/10 text-error-content text-center shadow-lg">
        <FaExclamationTriangle className="mx-auto mb-4 text-4xl" />
        <p className="mb-4 font-semibold">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchOrders();
          }}
          className="btn btn-primary gap-2"
        >
          <FaSyncAlt /> Try Again
        </button>
      </div>
    );

  if (!orders.length)
    return (
      <div className="text-center mt-24 p-6">
        <div className="max-w-md mx-auto">
          <FaBoxOpen className="mx-auto text-6xl text-base-content/30 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
          <p className="text-base-content/70 mb-6">
            You haven't placed any orders yet. Browse our services to get
            started.
          </p>
          <Link to="/services" className="btn btn-primary gap-2">
            Browse Services
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold mb-4 flex items-center justify-center gap-3">
          <FaClipboardList aria-hidden="true" />
          <span>{pageTitle}</span>
        </h1>
        <p className="text-base-content/70">
          {isAdmin ? "Manage all user orders." : "Manage your orders here."}
        </p>
      </header>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-base-100 rounded-box border border-base-300 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 pb-4 border-b border-base-300">
              <div className="space-y-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Order #{order.id}
                  <span
                    className={`badge badge-sm ${getStatusColor(order.status)}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </h2>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-base-content/70">
                    <FaCalendarAlt className="text-base-content/50" />
                    <span>
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-base-content/70">
                    <FaSyncAlt className="text-base-content/50" />
                    <span>
                      Updated: {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-base-content/70">
                    <FaClock className="text-base-content/50" />
                    <span>
                      Duration:{" "}
                      {order.order_items
                        ?.reduce(
                          (sum, item) =>
                            sum +
                            parseDurationToHours(item.duration) * item.quantity,
                          0
                        )
                        .toFixed(2)}{" "}
                      hrs
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-base-content/70">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ${Number(order.total_price).toFixed(2)}
                  </p>
                </div>

                <OrderActions
                  order={order}
                  user={user}
                  updatingOrderId={updatingOrderId}
                  onChange={updateOrderStatus}
                  onPay={handlePayNow}
                />
              </div>
            </div>

            {/* Order items list */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base-content/80 flex items-center gap-2">
                <FaInfoCircle className="text-base-content/60" />
                Order Items
              </h3>
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-3 bg-base-200 rounded-box px-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-base-content">
                      {item.service_name}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Quantity: {item.quantity} × $
                      {Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="font-semibold text-base-content">
                    ${(item.quantity * Number(item.price)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const handlePayNow = async (order) => {
  toast.loading("Redirecting to payment...");
  try {
    const response = await authApiClient.post(`api/payment/initiate/`, {
      amount: order.total_price,
      orderId: order.id,
      numItems: order.order_items?.length,
    });
    if (response.data.payment_url) {
      window.location.href = response.data.payment_url;
    }
  } catch (err) {
    console.log(err);
    toast.error("Failed to initiate payment.");
  }
};

const OrderActions = ({ order, user, updatingOrderId, onChange, onPay }) => {
  const isAdmin = user?.groups?.includes("Admin");
  const isUpdating = updatingOrderId === order.id;

  if (isAdmin) {
    return (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <label className="text-sm text-base-content/70">Update Status</label>
        <select
          className={`select select-bordered select-sm ${
            isUpdating ? "animate-pulse" : ""
          }`}
          value={order.status}
          onChange={(e) => onChange(order.id, e.target.value)}
          disabled={isUpdating}
          aria-label="Change order status"
        >
          {STATUS_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {isUpdating && (
          <span className="text-xs text-base-content/50 flex items-center gap-1">
            <FaSpinner className="animate-spin" /> Updating...
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {order.status === "PENDING" && (
        <div className="flex gap-2">
          <button
            onClick={() => onPay(order)}
            className="btn btn-success btn-sm gap-2"
            aria-label={`Pay now for order ${order.id}`}
          >
            <FaCreditCard /> Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardOrders;
