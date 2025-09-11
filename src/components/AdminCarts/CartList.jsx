import { FaBoxOpen } from "react-icons/fa";
import { CartHeader } from "./CartHeader";
import { CartItem } from "./CartItem";

export const CartList = ({
  filteredCarts,
  updatingItem,
  handleUpdateQuantity,
  handleRemoveItem,
  renderTotalDuration,
  setSearchTerm,
  setFilterBy,
  setSortBy,
  searchTerm,
}) => {
  if (filteredCarts.length === 0) {
    return (
      <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300">
        <div className="bg-base-100 rounded-full p-4 inline-block mb-4">
          <FaBoxOpen className="text-4xl text-base-content/60" />
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          No carts found
        </h3>
        <p className="text-base-content/70 mb-6">
          {searchTerm
            ? "Try adjusting your search criteria"
            : "No carts match the current filters"}
        </p>
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterBy("all");
            setSortBy("newest");
          }}
          className="btn btn-primary"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredCarts.map((cart) => (
        <div
          key={cart.id}
          className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6"
        >
          <CartHeader cart={cart} renderTotalDuration={renderTotalDuration} />

          {cart.items.length === 0 ? (
            <div className="text-center py-8 bg-base-200 rounded-xl">
              <FaBoxOpen className="text-3xl text-base-content/60 mx-auto mb-2" />
              <p className="text-base-content/60">This cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  cartId={cart.id}
                  item={item}
                  updatingItem={updatingItem}
                  handleUpdateQuantity={handleUpdateQuantity}
                  handleRemoveItem={handleRemoveItem}
                  formatDuration={renderTotalDuration}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
