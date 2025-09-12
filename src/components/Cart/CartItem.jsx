import {
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";

export const CartItem = ({
  item,
  updatingItem,
  increaseQty,
  decreaseQty,
  removeItem,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md border transition-all flex flex-col md:flex-row md:items-center md:gap-6 p-4 ${
        !item.service_available
          ? "border-error/40 bg-error/10"
          : "border-base-300 hover:shadow-lg"
      }`}
    >
      <img
        src={item.image}
        alt={item.service_name}
        className="w-24 h-24 object-cover rounded-xl shadow-sm border mx-auto md:mx-0"
        style={{ minWidth: 96, minHeight: 96 }}
      />
      <div className="flex-1 flex flex-col gap-2 mt-4 md:mt-0 md:ml-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">
            {item.service_name}
          </h3>
          {!item.service_available && (
            <span className="badge badge-error">Not Available</span>
          )}
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <FaDollarSign className="text-primary" /> ${item.price}
          </span>
          <span className="inline-flex items-center gap-1">
            <FaClock className="text-secondary" /> {item.duration}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => decreaseQty(item)}
              disabled={updatingItem === item.cartItemId || item.quantity <= 1}
              className="btn btn-circle btn-xs btn-outline"
            >
              <FaMinus />
            </button>
            <span className="font-bold text-lg px-2">{item.quantity}</span>
            <button
              onClick={() => increaseQty(item)}
              disabled={
                updatingItem === item.cartItemId || !item.service_available
              }
              className="btn btn-circle btn-xs btn-outline"
            >
              <FaPlus />
            </button>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="font-bold text-primary text-lg">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(item)}
              disabled={updatingItem === item.cartItemId}
              className="btn btn-link btn-xs text-error mt-1 flex items-center gap-1"
            >
              <FaTrashAlt /> Remove
            </button>
          </div>
        </div>
        {updatingItem === item.cartItemId && (
          <div className="mt-2 flex items-center gap-2 text-primary">
            <div className="loading loading-spinner loading-xs"></div>{" "}
            Updating...
          </div>
        )}
      </div>
    </div>
  );
};
