import { FaTrashAlt, FaPlus, FaMinus, FaSpinner } from "react-icons/fa";

export const CartItem = ({
  cartId,
  item,
  updatingItem,
  handleUpdateQuantity,
  handleRemoveItem,
  formatDuration,
}) => {
  const isUnavailable = !item.service_available;

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        isUnavailable
          ? "border-error/30 bg-error/10"
          : "border-base-300 bg-base-200"
      }`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={item.image}
          alt={item.service_name}
          className="w-16 h-16 object-cover rounded-lg border border-base-300"
        />
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold truncate ${
              isUnavailable ? "text-error" : "text-base-content"
            }`}
          >
            {item.service_name}
            {isUnavailable && (
              <span className="badge badge-error ml-2 text-xs">
                Unavailable
              </span>
            )}
          </h4>
          <div className="flex flex-wrap gap-3 text-sm text-base-content/60 mt-1">
            <span>${item.price} each</span>
            <span>•</span>
            <span>{formatDuration(item.duration)}</span>
            <span>•</span>
            <span className="font-semibold">
              Total: ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-base-100 rounded-lg p-1">
          <button
            onClick={() =>
              handleUpdateQuantity(cartId, item, item.quantity - 1)
            }
            disabled={updatingItem === item.id || item.quantity <= 1}
            className="btn btn-xs btn-ghost"
          >
            <FaMinus className="w-3 h-3" />
          </button>
          <span className="font-bold text-base-content w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              handleUpdateQuantity(cartId, item, item.quantity + 1)
            }
            disabled={updatingItem === item.id || !item.service_available}
            className="btn btn-xs btn-ghost"
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={() => handleRemoveItem(cartId, item.id)}
          disabled={updatingItem === item.id}
          className="btn btn-xs btn-error ml-2"
          aria-label="Remove"
        >
          {updatingItem === item.id ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaTrashAlt />
          )}
        </button>
      </div>
    </div>
  );
};
