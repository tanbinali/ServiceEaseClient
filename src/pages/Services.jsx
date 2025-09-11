import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";
import ServicesFilter from "../components/Services/ServicesFilter";
import ServicesList from "../components/Services/ServiceList";
import { FaSpinner, FaArrowLeft, FaArrowRight, FaFilter } from "react-icons/fa";

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

// Helper function to convert "HH:MM:SS" into seconds
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

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // Fetch categories once
  const fetchCategories = async () => {
    try {
      const categoriesResponse = await apiClient.get("/categories/");
      const categoriesMap = {};
      (categoriesResponse.data.results || categoriesResponse.data).forEach(
        (cat) => {
          categoriesMap[cat.id] = cat.name;
        }
      );
      setCategories(categoriesMap);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchServices = async (page = 1) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      const servicesResponse = await apiClient.get(`/services/?${params}`);
      const data = servicesResponse.data;

      setServices(data.results || []);
      setCount(data.count || 0);
      setCurrentPage(page);
      setTotalPages(Math.ceil((data.count || 0) / pageSize));
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset current page to 1 and fetch services when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
    fetchServices(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleView = (service) => {
    navigate(`/service/${service.id}`);
  };

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Apply sorting on the current page's services
    if (sortBy) {
      const [key, order] = sortBy.split("-");

      filtered.sort((a, b) => {
        let valA = a[key] ?? 0;
        let valB = b[key] ?? 0;

        if (key === "duration") {
          valA = durationToSeconds(a.duration);
          valB = durationToSeconds(b.duration);
        }
        if (key === "rating") {
          valA = a.rating ?? 0;
          valB = b.rating ?? 0;
        }
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [services, sortBy]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchServices(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-base-content/60">Loading services...</p>
        </div>
      </div>
    );
  }

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
            needs. From home maintenance to professional consultations, we've
            got you covered.
          </p>
        </div>

        {/* Filters */}
        <ServicesFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          totalResults={count}
          filteredResults={filteredServices.length}
        />

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-2xl text-primary" />
          </div>
        ) : (
          <>
            <ServicesList
              services={filteredServices}
              categories={categories}
              onView={handleView}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="join">
                  <button
                    className="join-item btn btn-outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaArrowLeft />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`join-item btn ${
                          currentPage === pageNum
                            ? "btn-primary"
                            : "btn-outline"
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="join-item btn btn-outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="text-center mt-6">
              <p className="text-base-content/60 text-sm">
                Showing {filteredServices.length} of {count} services
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== "all" &&
                  categories[selectedCategory] &&
                  ` in ${categories[selectedCategory]}`}
              </p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-300">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No services found
            </h3>
            <p className="text-base-content/60 mb-6">
              Try adjusting your search criteria or filters to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSortBy("");
              }}
              className="btn btn-primary gap-2"
            >
              <FaFilter />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
