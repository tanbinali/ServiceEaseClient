import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import apiClient from "../services/api-client";

// Default image
import defaultImage from "../assets/default-image.jpg";
import { Link } from "react-router-dom";

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

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

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

  // Render stars for rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-warning" : "text-base-300"
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-base-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div variants={slideUp} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Our Services
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover a wide range of professional services tailored to your
            needs.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-base-content/40" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
            {/* Sort */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-base-content/40" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered w-full pl-10"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner className="text-3xl text-primary" />
            </motion.div>
          </div>
        ) : filteredServices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-base-100 rounded-2xl border border-base-300"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No services found
            </h3>
            <p className="text-base-content/60 mb-6">
              Try adjusting your search criteria or filters.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchQuery("");
                setSortBy("");
              }}
              className="btn btn-primary gap-2"
            >
              <FaFilter />
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredServices.map((s) => (
                <motion.div
                  key={s.id}
                  variants={slideUp}
                  whileHover={{ y: -5 }}
                  className="bg-base-100 rounded-2xl shadow-lg border border-base-300 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      src={s.image || defaultImage}
                      alt={s.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="badge badge-primary badge-lg font-semibold">
                        ${s.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-base-content">
                      {s.name}
                    </h3>
                    <p className="text-base-content/70 mb-4 line-clamp-2">
                      {s.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="badge badge-outline">
                        {s.duration.slice(0, 5)} hours
                      </span>

                      <div className="flex items-center gap-1">
                        {s.rating ? (
                          <>
                            {renderStars(s.rating)}
                            <span className="text-sm text-base-content/70 ml-1">
                              ({s.rating.toFixed(1)})
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-base-content/60 italic">
                            No reviews
                          </span>
                        )}
                      </div>
                    </div>

                    <Link to={`/service/${s.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn btn-primary btn-block mt-2"
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <AnimatePresence>
              {(prevPageUrl || nextPageUrl) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center mt-12 gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => prevPageUrl && fetchServices(prevPageUrl)}
                    disabled={!prevPageUrl}
                    className="btn btn-outline gap-2"
                  >
                    <FaArrowLeft /> Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => nextPageUrl && fetchServices(nextPageUrl)}
                    disabled={!nextPageUrl}
                    className="btn btn-outline gap-2"
                  >
                    Next <FaArrowRight />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-base-content/60">
                Showing {filteredServices.length} of {count} services
              </p>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Services;
