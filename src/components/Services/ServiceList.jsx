import { useState, useMemo } from "react";
import ServiceCard from "./ServiceCard";

const ServicesList = ({ services, categories, onView }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const sortOptions = [
    { value: "name", label: "Sort by Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        service.category === parseInt(selectedCategory);

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [services, searchQuery, sortBy, selectedCategory]);

  if (!services.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          No Services Available
        </h3>
        <p className="text-base-content/60">
          Check back later for new services!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-2xl border border-base-300">
          <div className="text-5xl mb-4">🤔</div>
          <h3 className="text-lg font-semibold text-base-content mb-2">
            No services found
          </h3>
          <p className="text-base-content/60 mb-4">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              categoryName={categories[service.category]}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesList;
