import React, { useEffect, useState } from "react";
import apiClient from "../services/api-client.js";
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
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChartLine,
  FaUsers,
  FaSmile,
  FaFrown,
  FaMeh,
} from "react-icons/fa";

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch services to map IDs to names
  const fetchServices = async () => {
    try {
      const response = await apiClient.get("/services/");
      const map = {};
      (response.data.results || response.data).forEach((s) => {
        map[s.id] = s.name;
      });
      setServicesMap(map);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  useEffect(() => {
    fetchReviews(page);
    fetchServices();
  }, [page]);

  // Delete a review
  const deleteReview = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    )
      return;

    setDeletingId(id);
    try {
      await apiClient.delete(`/reviews/${id}/`);
      setReviews((prev) => prev.filter((review) => review.id !== id));
      setCount((prev) => prev - 1);
    } catch (err) {
      alert("Failed to delete review. Please try again.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(count / pageSize) || 1;

  // Render stars with better styling
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-warning" : "text-base-300"}`}
      />
    ));
  };

  // Get rating icon based on score
  const getRatingIcon = (rating) => {
    if (rating >= 4) return <FaSmile className="text-success" />;
    if (rating >= 3) return <FaMeh className="text-warning" />;
    return <FaFrown className="text-error" />;
  };

  // Filter & sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch =
        review.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (servicesMap[review.service] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRating =
        ratingFilter === "all" || review.rating === parseInt(ratingFilter);
      const matchesService =
        serviceFilter === "all" || review.service === parseInt(serviceFilter);

      return matchesSearch && matchesRating && matchesService;
    })
    .sort((a, b) =>
      dateSort === "newest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  const services = [...new Set(reviews.map((r) => r.service))];

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-base-content mb-2">
          Customer Reviews
        </h2>
        <p className="text-base-content/70">
          Manage and monitor all customer feedback and ratings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
          <div className="flex items-center">
            <div className="rounded-2xl bg-primary/10 p-3 mr-4">
              <FaStar className="text-2xl text-primary" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Total Reviews</p>
              <h3 className="text-2xl font-bold text-base-content">{count}</h3>
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
          <div className="flex items-center">
            <div className="rounded-2xl bg-secondary/10 p-3 mr-4">
              <FaChartLine className="text-2xl text-secondary" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Average Rating</p>
              <h3 className="text-2xl font-bold text-base-content">
                {reviews.length
                  ? (
                      reviews.reduce((acc, r) => acc + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
          <div className="flex items-center">
            <div className="rounded-2xl bg-accent/10 p-3 mr-4">
              <FaUsers className="text-2xl text-accent" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Unique Users</p>
              <h3 className="text-2xl font-bold text-base-content">
                {new Set(reviews.map((r) => r.user)).size}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
          <div className="flex items-center">
            <div className="rounded-2xl bg-info/10 p-3 mr-4">
              <FaCalendarAlt className="text-2xl text-info" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Services Reviewed</p>
              <h3 className="text-2xl font-bold text-base-content">
                {services.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 mb-8 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-base-content/40" />
            </div>
            <input
              type="text"
              placeholder="Search reviews by user, content, or service..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="text-base-content/40 hover:text-base-content/60" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-outline gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Filters
              {(ratingFilter !== "all" || serviceFilter !== "all") && (
                <span className="badge badge-primary badge-sm">
                  {
                    [ratingFilter, serviceFilter].filter((f) => f !== "all")
                      .length
                  }
                </span>
              )}
            </button>

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

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-base-300 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating !== 1 ? "s" : ""}
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
                {services.map((serviceId) => (
                  <option key={serviceId} value={serviceId}>
                    {servicesMap[serviceId] || `Service ${serviceId}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setRatingFilter("all");
                  setServiceFilter("all");
                  setSearchTerm("");
                }}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rating Distribution */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-6 mb-8">
        <h3 className="text-lg font-semibold text-base-content mb-4">
          Rating Distribution
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="text-center">
              <div className="flex justify-center mb-2">
                {getRatingIcon(rating)}
              </div>
              <div className="text-2xl font-bold text-base-content">
                {ratingDistribution[rating] || 0}
              </div>
              <div className="text-sm text-base-content/60">
                {rating} Star{rating !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-base-100 rounded-2xl shadow-sm border border-base-300">
          <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-base-content/70">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error rounded-2xl">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button
            onClick={() => fetchReviews(page)}
            className="btn btn-ghost btn-sm"
          >
            Try Again
          </button>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-300">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No reviews found
          </h3>
          <p className="text-base-content/70 mb-6">
            {searchTerm || ratingFilter !== "all" || serviceFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No reviews have been submitted yet"}
          </p>
          {(searchTerm ||
            ratingFilter !== "all" ||
            serviceFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setRatingFilter("all");
                setServiceFilter("all");
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden border border-base-300 mb-6">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-base-content font-semibold">
                      User & Rating
                    </th>
                    <th className="text-base-content font-semibold">
                      Review Content
                    </th>
                    <th className="text-base-content font-semibold">Service</th>
                    <th className="text-base-content font-semibold">Date</th>
                    <th className="text-base-content font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-base-200/50">
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar placeholder !flex !items-center !justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                            {review.user_profile_picture ? (
                              <img
                                src={review.user_profile_picture}
                                alt={review.user}
                                className="rounded-full object-cover w-12 h-12"
                              />
                            ) : (
                              <FaUser className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-base-content">
                              {review.user || "Anonymous User"}
                            </div>
                            <div className="flex items-center mt-1">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-base-content/60">
                                ({review.rating})
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="text-base-content">
                          {review.text || "No review text provided"}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline badge-primary">
                          {servicesMap[review.service] ||
                            `Service ${review.service}`}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm text-base-content/70">
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-base-content/50">
                          {new Date(review.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteReview(review.id)}
                          disabled={deletingId === review.id}
                          className="btn btn-error btn-sm gap-2"
                        >
                          {deletingId === review.id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  className="join-item btn btn-outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`join-item btn ${
                        page === pageNum ? "btn-primary" : "btn-outline"
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="join-item btn btn-outline"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center mt-6">
            <p className="text-base-content/60 text-sm">
              Showing {filteredReviews.length} of {count} reviews
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardReviews;
