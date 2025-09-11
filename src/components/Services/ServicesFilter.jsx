import { FaSearch, FaSort, FaTimes } from "react-icons/fa";

const ServicesFilter = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOptions,
  totalResults,
  filteredResults,
}) => {
  const hasActiveFilters = searchQuery || sortBy;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSortBy("");
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
          <FaSort className="text-primary" />
          Filter Services
        </h3>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="btn btn-ghost btn-sm text-error gap-2"
            aria-label="Clear all filters"
          >
            <FaTimes />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="label">
            <span className="label-text font-medium">Search Services</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-12 pr-4"
              aria-label="Search services"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content/60"
                aria-label="Clear search input"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="label">
            <span className="label-text font-medium">Sort By</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40">
              <FaSort className="w-4 h-4" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered w-full pl-12"
              aria-label="Sort services"
            >
              <option value="">Default</option>
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count and Active Filters */}
      <div className="mt-6 pt-4 border-t border-base-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-base-content/60">
            Showing {filteredResults} of {totalResults} services
          </p>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="badge badge-primary badge-lg gap-2">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-error"
                  aria-label="Clear search filter"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}

            {sortBy && (
              <span className="badge badge-accent badge-lg gap-2">
                Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label}
                <button
                  onClick={() => setSortBy("")}
                  className="hover:text-error"
                  aria-label="Clear sort filter"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesFilter;
