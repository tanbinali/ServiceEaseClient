import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import {
  FaStar,
  FaTrash,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaTimes,
  FaUser,
  FaFolderOpen,
  FaExclamationTriangle,
  FaChartLine,
  FaUsers,
  FaSmile,
  FaFrown,
  FaMeh,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const DashboardReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = 10;

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  const buttonVariants = {
    hover: { scale: 1.04 },
    tap: { scale: 0.96 },
  };

  // Fetch reviews
  const fetchReviews = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/reviews/", {
        params: { page: pageNumber, page_size: pageSize },
      });
      setReviews(response.data.results || []);
      setCount(response.data.count || 0);
    } catch (err) {
      setError("Failed to fetch reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch services for mapping
  const fetchServices = async () => {
    try {
      const response = await apiClient.get("/services/");
      const map = {};
      (response.data.results || response.data).forEach((s) => {
        map[s.id] = s.name;
      });
      setServicesMap(map);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchReviews(page);
    fetchServices();
  }, [page]);

  // Delete review
  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((rev) => rev.id !== id));
      setCount((prev) => prev - 1);
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  // Render stars
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-warning" : "text-base-300"}`}
      />
    ));

  // Rating icon
  const getRatingIcon = (rating) => {
    if (rating >= 4) return <FaSmile className="text-success" />;
    if (rating >= 3) return <FaMeh className="text-warning" />;
    return <FaFrown className="text-error" />;
  };

  // Filter & sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesTerm =
        review.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (servicesMap[review.service] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRating =
        ratingFilter === "all" || review.rating === Number(ratingFilter);

      const matchesService =
        serviceFilter === "all" || review.service === Number(serviceFilter);

      return matchesTerm && matchesRating && matchesService;
    })
    .sort((a, b) =>
      dateSort === "newest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  // Unique services on current page
  const servicesInReviews = [...new Set(reviews.map((r) => r.service))];

  // Rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-3xl font-bold text-base-content mb-2"
          variants={itemVariants}
        >
          Customer Reviews
        </motion.h2>
        <motion.p
          className="text-base-content/70"
          variants={itemVariants}
          transition={{ delay: 0.2 }}
        >
          Manage and monitor all feedback and ratings
        </motion.p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="stat bg-base-100 p-4 rounded-2xl shadow border border-base-300"
          variants={itemVariants}
        >
          <div className="stat-figure text-primary">
            <FaStar className="text-2xl" />
          </div>
          <div className="stat-title">Total Reviews</div>
          <div className="stat-value">{count}</div>
        </motion.div>
        <motion.div
          className="stat bg-base-100 p-4 rounded-2xl shadow border border-base-300"
          variants={itemVariants}
        >
          <div className="stat-figure text-secondary">
            <FaChartLine className="text-2xl" />
          </div>
          <div className="stat-title">Average Rating</div>
          <div className="stat-value">
            {reviews.length
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                ).toFixed(1)
              : "0.0"}
          </div>
        </motion.div>
        <motion.div
          className="stat bg-base-100 p-4 rounded-2xl shadow border border-base-300"
          variants={itemVariants}
        >
          <div className="stat-figure text-info">
            <FaUsers className="text-2xl" />
          </div>
          <div className="stat-title">Unique Users</div>
          <div className="stat-value">
            {new Set(reviews.map((r) => r.user)).size}
          </div>
        </motion.div>
        <motion.div
          className="stat bg-base-100 p-4 rounded-2xl shadow border border-base-300"
          variants={itemVariants}
        >
          <div className="stat-figure text-accent">
            <FaFolderOpen className="text-2xl" />
          </div>
          <div className="stat-title">Services Reviewed</div>
          <div className="stat-value">{servicesInReviews.length}</div>
        </motion.div>
      </motion.div>

      {/* Filter & Search*/}
      <motion.div
        className="bg-base-100 rounded-2xl shadow border border-base-300 p-4 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-base-content/40" />
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSearchTerm("")}
              >
                <FaTimes className="text-base-content/50 hover:text-base-content" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.button
              className="btn btn-outline flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filter-options"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <FaFilter /> Filters
            </motion.button>
            <select
              className="select select-bordered"
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              id="filter-options"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-base-300 pt-4"
            >
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Filter by Rating
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>
                      {star} Star{star !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Filter by Service
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="all">All Services</option>
                  {Object.entries(servicesMap).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setRatingFilter("all");
                    setServiceFilter("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reviews Table */}
      {loading ? (
        <motion.div
          className="flex flex-col items-center justify-center py-20 bg-base-100 rounded-xl shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaSpinner className="animate-spin text-4xl mb-4 text-primary" />
          <p className="text-base-content/70">Loading reviews...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          className="alert alert-error rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaExclamationTriangle />
          <span>{error}</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => fetchReviews(page)}
          >
            Retry
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="overflow-x-auto rounded-xl shadow border border-base-300"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User & Rating</th>
                  <th>Review Content</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredReviews.map((review) => (
                    <motion.tr
                      key={review.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar placeholder rounded-full">
                            {review.user_profile_picture ? (
                              <img
                                src={review.user_profile_picture}
                                alt={review.user}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <FaUser className="w-10 h-10 text-base-content/70" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {review.user || "Unknown User"}
                            </div>
                            <div className="flex items-center text-yellow-400">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-base-content/60">
                                ({review.rating})
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{review.text || <em>No review text.</em>}</td>
                      <td>
                        {servicesMap[review.service] ||
                          `Service #${review.service}`}
                      </td>
                      <td>
                        {new Date(review.created_at).toLocaleDateString()}
                        <br />
                        <small className="text-base-content/50">
                          {new Date(review.created_at).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        <button
                          className={`btn btn-error btn-sm flex items-center gap-1 ${
                            deletingId === review.id ? "loading" : ""
                          }`}
                          disabled={deletingId === review.id}
                          onClick={() => deleteReview(review.id)}
                          aria-label={`Delete review by ${
                            review.user || "user"
                          }`}
                        >
                          {deletingId === review.id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>

          {count > pageSize && (
            <motion.div
              className="flex justify-center mt-6 gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                className="btn btn-outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <FaChevronLeft /> Prev
              </button>
              {Array.from({ length: Math.min(count / pageSize, 7) }, (_, i) => {
                const num = i + 1;
                return (
                  <button
                    key={num}
                    className={`btn btn-sm ${
                      num === page ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setPage(num)}
                    aria-current={num === page ? "page" : undefined}
                  >
                    {num}
                  </button>
                );
              })}
              <button
                className="btn btn-outline"
                onClick={() =>
                  setPage((p) => Math.min(Math.ceil(count / pageSize), p + 1))
                }
                disabled={page >= Math.ceil(count / pageSize)}
                aria-label="Next page"
              >
                Next <FaChevronRight />
              </button>
            </motion.div>
          )}

          <motion.div
            className="text-center mt-4 opacity-70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5 }}
          >
            Showing {filteredReviews.length} of {count} reviews
            {searchTerm && <> for "{searchTerm}"</>}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default DashboardReviews;
