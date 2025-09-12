import { useEffect, useState, useMemo } from "react";
import { FaSpinner, FaArrowLeft, FaArrowRight, FaFilter } from "react-icons/fa";
import apiClient from "../services/api-client";

// Default image
import defaultImage from "../assets/default-image.jpg";
import { Link } from "react-router";

// Helper to convert "HH:MM:SS" to seconds
const durationToSeconds = (duration) => {
  if (!duration) return 0;
  const parts = duration.split(":");
  if (parts.length !== 3) return 0;
  return (
    parseInt(parts[0], 10) * 3600 +
    parseInt(parts[1], 10) * 60 +
    parseInt(parts[2], 10)
  );
};

const sortOptions = [
  { value: "", label: "Default" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "price-asc", label: "Price (Low → High)" },
  { value: "price-desc", label: "Price (High → Low)" },
  { value: "rating-asc", label: "Rating (Low → High)" },
  { value: "rating-desc", label: "Rating (High → Low)" },
  { value: "duration-asc", label: "Duration (Short → Long)" },
  { value: "duration-desc", label: "Duration (Long → Short)" },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [count, setCount] = useState(0);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  // Fetch services from API
  const fetchServices = async (customUrl = null) => {
    setLoading(true);
    try {
      let url = customUrl || "/services/";
      const params = new URLSearchParams();

      if (!customUrl) {
        params.append("page_size", 12);
        if (searchQuery) params.append("search", searchQuery);
        if (sortBy) params.append("ordering", sortBy.replace("-", ""));
        url = `${url}?${params.toString()}`;
      }

      const res = await apiClient.get(url);
      const data = res.data;

      setServices(data.results || []);
      setCount(data.count || 0);
      setNextPageUrl(data.next);
      setPrevPageUrl(data.previous);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [searchQuery, sortBy]);

  // Client-side filtering and sorting for current page
  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy) {
      const [key, order] = sortBy.split("-");
      filtered.sort((a, b) => {
        let valA = a[key] ?? 0;
        let valB = b[key] ?? 0;

        if (key === "price" || key === "rating") {
          valA = Number(valA);
          valB = Number(valB);
        }
        if (key === "duration") {
          valA = durationToSeconds(valA);
          valB = durationToSeconds(valB);
        }
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [services, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Our Services
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover a wide range of professional services tailored to your
            needs.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full"
            />
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered w-full"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-2xl text-primary" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-300">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No services found
            </h3>
            <p className="text-base-content/60 mb-6">
              Try adjusting your search criteria or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortBy("");
              }}
              className="btn btn-primary gap-2"
            >
              <FaFilter />
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((s) => (
                <div
                  key={s.id}
                  className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-5 flex flex-col justify-between"
                >
                  <img
                    src={s.image || defaultImage}
                    alt={s.name}
                    className="h-48 w-full object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg mb-2">{s.name}</h3>
                  <p className="text-sm text-base-content/70 mb-2 line-clamp-2">
                    {s.description}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-primary">
                      ${s.price}
                    </span>
                    <span className="text-sm text-base-content/60">
                      {s.duration.slice(0, 5)} hrs
                    </span>
                  </div>
                  <Link to={`/service/${s.id}`}>
                    <button className="btn btn-primary btn-block mt-auto">
                      View Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {(prevPageUrl || nextPageUrl) && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => prevPageUrl && fetchServices(prevPageUrl)}
                  disabled={!prevPageUrl}
                  className="btn btn-outline"
                >
                  <FaArrowLeft /> Previous
                </button>
                <button
                  onClick={() => nextPageUrl && fetchServices(nextPageUrl)}
                  disabled={!nextPageUrl}
                  className="btn btn-outline"
                >
                  Next <FaArrowRight />
                </button>
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-sm text-base-content/60">
                Showing {filteredServices.length} of {count} services
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
