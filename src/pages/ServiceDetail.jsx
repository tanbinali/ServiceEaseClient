import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../services/api-client";
import authApiClient from "../services/auth-api-client";
import {
  FaStar,
  FaCartPlus,
  FaClock,
  FaDollarSign,
  FaUser,
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import useCartContext from "../hooks/useCartContext";
import defaultImage from "../assets/default-image.jpg";

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItemToCart } = useCartContext();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await apiClient.get(`/services/${id}/`);
        setService(response.data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const response = await authApiClient.get(
          `/api/services/${id}/reviews/`
        );
        setReviews(response.data.results || []);
      } catch (error) {
        setReviewsError(error);
        toast.error("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      await addItemToCart(service.id, quantity);
      toast.success("Service added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add service to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-warning" : "text-base-300"}`}
        aria-hidden="true"
      />
    ));

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

  if (!service)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-base-100 rounded-2xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <p className="text-base-content/70 mb-6">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/services" className="btn btn-primary gap-2">
            <FaArrowLeft /> Browse Services
          </Link>
        </div>
      </div>
    );

  const isAvailable = service.active !== false;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="text-sm breadcrumbs">
            <ul className="flex space-x-2 text-base-content/60">
              <li>
                <Link to="/" className="text-primary hover:underline">
                  Home
                </Link>
              </li>
              <li className="before:content-['/'] before:mx-2">
                <Link to="/services" className="text-primary hover:underline">
                  Services
                </Link>
              </li>
              <li className="before:content-['/'] before:mx-2 text-base-content/40">
                {service.name}
              </li>
            </ul>
          </div>
        </nav>

        {/* Service Detail Section */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Service Image */}
          <div className="relative group rounded-2xl overflow-hidden shadow-lg w-full h-full">
            <img
              src={service.image || defaultImage}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
            />
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-base-content">
              {service.name}
              {!isAvailable && (
                <span className="ml-4 inline-block px-3 py-1 rounded-full bg-error/20 text-error font-semibold text-sm">
                  Not Available
                </span>
              )}
            </h1>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                {renderStars(service.rating || 0)}
                <span className="text-base-content/60 ml-2">
                  ({service.rating || 0})
                </span>
              </div>
              <span className="text-base-content/40">•</span>
              <span className="text-base-content/60">
                {reviews.length} reviews
              </span>
            </div>

            <p className="text-lg text-base-content/70 leading-relaxed">
              {service.description}
            </p>

            <div className="flex gap-6 py-4 border-y border-base-300 flex-wrap">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary/10 mr-3">
                  <FaDollarSign className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Price</p>
                  <p className="text-2xl font-bold text-primary">
                    ${service.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="p-3 rounded-full bg-secondary/10 mr-3">
                  <FaClock className="text-secondary text-lg" />
                </div>
                <div>
                  <p className="text-sm text-base-content/60">Duration</p>
                  <p className="text-xl font-semibold text-secondary">
                    {service.duration.slice(0, 5)} hours
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="bg-base-200 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <label
                  htmlFor="quantity"
                  className="block mb-2 font-medium text-base-content/80"
                >
                  Select Quantity
                </label>
                <div className="flex items-center border border-base-300 rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-3 bg-base-100 hover:bg-base-300 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    disabled={!isAvailable || quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    id="quantity"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-x border-base-300 bg-base-100"
                    aria-live="polite"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-3 bg-base-100 hover:bg-base-300 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    disabled={!isAvailable}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-base-content/60 mb-1">Total Price</p>
                <p className="text-2xl font-bold text-primary mb-3">
                  ${(service.price * quantity).toFixed(2)}
                </p>
                <button
                  disabled={!isAvailable || addingToCart}
                  onClick={addToCart}
                  className={`btn btn-primary btn-lg flex items-center justify-center gap-2 w-full sm:w-auto ${
                    !isAvailable
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-focus transition"
                  }`}
                  aria-disabled={!isAvailable}
                >
                  {addingToCart ? (
                    <>
                      <FaSpinner className="animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <FaCartPlus />{" "}
                      {isAvailable ? "Add to Cart" : "Not Available"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Service Guarantee */}
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
              <FaCheckCircle className="text-success text-xl" />
              <div>
                <p className="font-semibold text-success">
                  Satisfaction Guaranteed
                </p>
                <p className="text-sm text-success/70">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div
            className="tabs tabs-boxed bg-base-200 w-fit mb-8"
            role="tablist"
          >
            <button
              className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("details")}
              aria-selected={activeTab === "details"}
              role="tab"
              id="tab-details"
              aria-controls="tabpanel-details"
              type="button"
            >
              Service Details
            </button>
            <button
              className={`tab ${activeTab === "reviews" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("reviews")}
              aria-selected={activeTab === "reviews"}
              role="tab"
              id="tab-reviews"
              aria-controls="tabpanel-reviews"
              type="button"
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === "details" && (
            <section
              className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300"
              role="tabpanel"
              aria-labelledby="tab-details"
              id="tabpanel-details"
              tabIndex={0}
            >
              <h3 className="text-xl font-semibold mb-4">
                Service Information
              </h3>
              <div className="prose prose-lg max-w-none text-base-content">
                {service.description}
              </div>
            </section>
          )}

          {activeTab === "reviews" && (
            <section
              role="tabpanel"
              aria-labelledby="tab-reviews"
              id="tabpanel-reviews"
              tabIndex={0}
            >
              {reviewsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : reviewsError ? (
                <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center text-error">
                  Failed to load reviews. Please try again later.
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-base-200 rounded-xl p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="text-5xl mb-4">🌟</div>
                    <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                    <p className="text-base-content/70">
                      Be the first to share your experience with this service!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-300 transition-all hover:shadow-md"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <FaUser className="text-primary text-xl" />
                          </div>
                          <div>
                            <span className="font-semibold block text-base-content">
                              {r.user}
                            </span>
                            <span className="text-sm text-base-content/60">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div
                          className="flex"
                          aria-label={`Rating: ${r.rating} out of 5 stars`}
                        >
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-5 h-5 ${
                                i < r.rating ? "text-warning" : "text-base-300"
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-base-content/80">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
