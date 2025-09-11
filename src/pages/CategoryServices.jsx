import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";
import ServicesList from "../components/Services/ServiceList";
import {
  FaArrowLeft,
  FaSpinner,
  FaTags,
  FaHome,
  FaExclamationTriangle,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const CategoryService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search Query state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch category details
        const resCategory = await apiClient.get(`/categories/${id}/`);
        setCategory(resCategory.data);

        // Fetch services for this category only
        const resServices = await apiClient.get(`/categories/${id}/services/`);
        setServices(Array.isArray(resServices.data) ? resServices.data : []);

        // Fetch all categories for mapping
        const resCategories = await apiClient.get("/categories/");
        const map = {};
        (resCategories.data.results || resCategories.data).forEach((cat) => {
          map[cat.id] = cat.name;
        });
        setCategoriesMap(map);
      } catch (err) {
        console.error(err);
        setError("Failed to load category or services.");
        setCategory(null);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoryData();
  }, [id]);

  const handleView = (service) => {
    navigate(`/service/${service.id}`);
  };

  const filteredServices = useMemo(() => {
    const loweredQuery = searchQuery.toLowerCase().trim();

    return services.filter((s) => {
      const nameMatch = s.name.toLowerCase().includes(loweredQuery);
      const descMatch = s.description
        ? s.description.toLowerCase().includes(loweredQuery)
        : false;
      return nameMatch || descMatch;
    });
  }, [services, searchQuery]);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="max-w-xl mx-auto mt-6 mb-4 flex items-center gap-2 p-3 bg-red-100 text-error border border-error rounded-xl">
            <FaExclamationTriangle className="text-lg" />
            <span>{error}</span>
            <button
              className="btn btn-xs btn-ghost ml-auto"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <div className="text-sm breadcrumbs">
            <ul className="flex flex-wrap gap-2 items-center">
              <li>
                <Link
                  to="/"
                  className="text-primary flex items-center gap-1 hover:underline"
                >
                  <FaHome />
                  <span className="sr-only">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-primary hover:underline">
                  Categories
                </Link>
              </li>
              <li aria-current="page" className="text-base-content/60">
                {category?.name || "Loading..."}
              </li>
            </ul>
          </div>
        </nav>

        {/* Loading */}
        {loading && (
          <div className="min-h-[50vh] flex items-center justify-center bg-base-100 rounded-xl shadow-lg p-6">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
              <p className="text-base-content/60">Loading services...</p>
            </div>
          </div>
        )}

        {/* No category */}
        {!loading && !category && !error && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-base-200 p-8 rounded-xl shadow text-center max-w-md">
              <div className="text-5xl mb-2">🔍</div>
              <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
              <p className="mb-6 text-base-content/70">
                The category you're looking for doesn't exist.
              </p>
              <Link to="/services" className="btn btn-primary">
                Browse All Services
              </Link>
            </div>
          </div>
        )}

        {/* Valid category */}
        {!loading && category && (
          <>
            {/* Header */}
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl inline-block">
                  <FaTags className="text-4xl text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
                {category.name} Services
              </h1>
              {category.description && (
                <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                  {category.description}
                </p>
              )}
              <div className="mt-4 text-base-content/60 font-medium">
                {filteredServices.length} service
                {filteredServices.length !== 1 ? "s" : ""} available
              </div>
            </div>

            {/* Search Input */}
            <div className="max-w-md mx-auto mb-8 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search services by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10"
                aria-label="Search services"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content/60"
                  aria-label="Clear search input"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Services List or empty message */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300 max-w-lg mx-auto">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  No services found
                </h3>
                <p className="text-base-content/70 mb-6">
                  {searchQuery
                    ? `No services found for "${searchQuery}" in ${category.name}.`
                    : `No services available in ${category.name} at the moment.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setSearchQuery("")}
                    className="btn btn-primary"
                  >
                    Clear Search
                  </button>
                  <Link to="/services" className="btn btn-outline">
                    Browse All Services
                  </Link>
                </div>
              </div>
            ) : (
              <ServicesList
                services={filteredServices}
                categories={categoriesMap}
                onView={handleView}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryService;
