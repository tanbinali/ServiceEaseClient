import defaultImage from "../../assets/default-image.jpg";
import {
  FaCartPlus,
  FaClock,
  FaDollarSign,
  FaStar,
  FaEye,
} from "react-icons/fa";

const ServiceCard = ({ service, categoryName, onView }) => {
  const imgSrc = service?.image || defaultImage;
  const rating = service?.rating ?? 0;

  // Generate star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <FaStar
            key={index}
            className={`w-3 h-3 ${
              index < fullStars
                ? "text-warning"
                : index === fullStars && hasHalfStar
                ? "text-warning/60"
                : "text-base-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="group bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 overflow-hidden hover:-translate-y-1">
      {/* Image Container */}
      <figure className="relative overflow-hidden">
        <img
          src={imgSrc}
          alt={service?.name}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <div
            className={`badge badge-lg ${
              service?.active ? "badge-success" : "badge-error"
            }`}
          >
            {service?.active ? "Available" : "Unavailable"}
          </div>
        </div>

        {/* Category Badge */}
        {service?.category && (
          <div className="absolute top-3 left-3">
            <div className="badge badge-primary badge-lg">
              {categoryName || "Unknown"}
            </div>
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </figure>

      {/* Card Content */}
      <div className="p-5">
        {/* Title and Rating */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors line-clamp-1">
            {service?.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {renderStars(rating)}
            <span className="text-sm text-base-content/60">({rating})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-base-content/70 text-sm line-clamp-2 mb-4">
          {service?.description}
        </p>

        {/* Price and Duration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FaDollarSign className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Price</p>
              <p className="font-bold text-primary">${service?.price}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <FaClock className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">Duration</p>
              <p className="font-semibold text-secondary">
                {service?.duration.slice(0, 5)} hrs
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onView(service)}
          className="btn btn-primary btn-block group/btn gap-2"
        >
          <FaEye className="group-hover/btn:scale-110 transition-transform" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
