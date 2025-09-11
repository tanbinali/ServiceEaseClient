import {
  FaUsers,
  FaCheckCircle,
  FaDollarSign,
  FaBoxOpen,
} from "react-icons/fa";

export const CartStats = ({ carts }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div className="bg-base-200 p-6 rounded-2xl shadow-sm border border-base-300">
      <div className="flex items-center">
        <div className="rounded-2xl bg-primary/10 p-3 mr-4">
          <FaUsers className="text-2xl text-primary" />
        </div>
        <div>
          <p className="text-sm text-base-content/60">Total Carts</p>
          <h3 className="text-2xl font-bold text-base-content">
            {carts.length}
          </h3>
        </div>
      </div>
    </div>

    <div className="bg-base-200 p-6 rounded-2xl shadow-sm border border-base-300">
      <div className="flex items-center">
        <div className="rounded-2xl bg-secondary/10 p-3 mr-4">
          <FaCheckCircle className="text-2xl text-secondary" />
        </div>
        <div>
          <p className="text-sm text-base-content/60">Active Items</p>
          <h3 className="text-2xl font-bold text-base-content">
            {carts.reduce((sum, cart) => sum + cart.items.length, 0)}
          </h3>
        </div>
      </div>
    </div>

    <div className="bg-base-200 p-6 rounded-2xl shadow-sm border border-base-300">
      <div className="flex items-center">
        <div className="rounded-2xl bg-accent/10 p-3 mr-4">
          <FaDollarSign className="text-2xl text-accent" />
        </div>
        <div>
          <p className="text-sm text-base-content/60">Total Value</p>
          <h3 className="text-2xl font-bold text-base-content">
            ${carts.reduce((sum, cart) => sum + cart.totalPrice, 0).toFixed(2)}
          </h3>
        </div>
      </div>
    </div>

    <div className="bg-base-200 p-6 rounded-2xl shadow-sm border border-base-300">
      <div className="flex items-center">
        <div className="rounded-2xl bg-info/10 p-3 mr-4">
          <FaBoxOpen className="text-2xl text-info" />
        </div>
        <div>
          <p className="text-sm text-base-content/60">Empty Carts</p>
          <h3 className="text-2xl font-bold text-base-content">
            {carts.filter((cart) => cart.items.length === 0).length}
          </h3>
        </div>
      </div>
    </div>
  </div>
);
