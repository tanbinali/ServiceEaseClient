import { FaSearch } from "react-icons/fa";

export const CartFilters = ({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
}) => (
  <div className="bg-base-200 rounded-2xl shadow-sm border border-base-300 p-6 mb-8">
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="relative w-full lg:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-base-content/40" />
        </div>
        <input
          type="text"
          placeholder="Search carts by ID, user, or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full pl-10"
        />
      </div>

      <div className="flex gap-2 w-full lg:w-auto">
        <select
          className="select select-bordered"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <option value="all">All Carts</option>
          <option value="hasItems">With Items</option>
          <option value="empty">Empty Carts</option>
        </select>

        <select
          className="select select-bordered"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="itemsHigh">Most Items</option>
          <option value="itemsLow">Fewest Items</option>
        </select>
      </div>
    </div>
  </div>
);
