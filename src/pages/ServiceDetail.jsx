import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../services/api-client";
import authApiClient from "../services/auth-api-client";
import { toast } from "react-hot-toast";
import useCartContext from "../hooks/useCartContext";
import useAuth from "../hooks/useAuth";
import defaultImage from "../assets/default-image.jpg";
import {
  FaStar,
  FaCartPlus,
  FaClock,
  FaDollarSign,
  FaUser,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItemToCart } = useCartContext();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [addingToCart, setAddingToCart] = useState(false);

  // User review states
  const [hasPurchased, setHasPurchased] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await apiClient.get(`/services/${id}/`);
        setService(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await apiClient.get(`/services/${id}/reviews/`);
        setReviews(res.data.results || []);
      } catch (err) {
        console.error(err);
        setReviewsError(err);
        toast.error("Failed to load reviews");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // Check purchase history
  useEffect(() => {
    if (!user?.profile?.service_history) return;

    const purchased = user.profile.service_history.some(
      (order) =>
        order.order_status === "COMPLETED" &&
        order.services.some((s) => s.service_id === parseInt(id))
    );
    setHasPurchased(purchased);
  }, [user, id]);

  // Quantity handlers
  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      await addItemToCart(service.id, quantity);
      toast.success("Service added to cart!");
    } catch (err) {
      toast.error("Failed to add service to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rating, size = "w-4 h-4") =>
    Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={`${size} ${i < rating ? "text-warning" : "text-base-300"}`}
      />
    ));

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
        ></motion.div>
      </div>
    );

  if (!service)
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex justify-center items-center min-h-screen"
      >
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
      </motion.div>
    );

  const isAvailable = service.active !== false;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-base-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav variants={slideUp} className="mb-8">
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
        </motion.nav>

        {/* Service Detail */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group rounded-2xl overflow-hidden shadow-lg w-full h-full"
          >
            <img
              src={service.image || defaultImage}
              alt={service.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
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

            {/* Quantity & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-base-200 p-6 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            >
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
                  >
                    -
                  </button>
                  <input
                    type="text"
                    id="quantity"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border-x border-base-300 bg-base-100"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-3 bg-base-100 hover:bg-base-300 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    disabled={!isAvailable}
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
                <motion.button
                  whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                  whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                  onClick={addToCart}
                  disabled={!isAvailable || addingToCart}
                  className={`btn btn-primary btn-lg flex items-center justify-center gap-2 w-full sm:w-auto ${
                    !isAvailable
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-focus transition"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <FaSpinner className="animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <FaCartPlus /> Add to Cart
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Service Guarantee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3"
            >
              <FaCheckCircle className="text-success text-xl" />
              <div>
                <p className="font-semibold text-success">
                  Satisfaction Guaranteed
                </p>
                <p className="text-sm text-success/70">
                  30-day money-back guarantee
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div
            className="tabs tabs-boxed bg-base-200 w-fit mb-8"
            role="tablist"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Service Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`tab ${activeTab === "reviews" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.section
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300"
              >
                <h3 className="text-xl font-semibold mb-4">
                  Service Information
                </h3>
                <div className="prose prose-lg max-w-none text-base-content">
                  {service.description}
                </div>
              </motion.section>
            )}

            {activeTab === "reviews" && (
              <motion.section
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Add/Edit Review Form */}
                {activeTab === "reviews" && (
                  <p className="mb-4 text-sm text-base-content/60">
                    To add a review, you must have an order with{" "}
                    <strong>COMPLETED</strong> status.
                  </p>
                )}

                {hasPurchased &&
                  (editingReview ||
                    !reviews.some((r) => r.user === user?.email)) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-base-200 p-6 rounded-xl mb-6"
                    >
                      <h3 className="text-xl font-semibold mb-2">
                        {editingReview ? "Edit Your Review" : "Add a Review"}
                      </h3>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaStar
                              className={`w-6 h-6 cursor-pointer ${
                                i < reviewRating
                                  ? "text-warning"
                                  : "text-base-300"
                              }`}
                              onClick={() => setReviewRating(i + 1)}
                            />
                          </motion.span>
                        ))}
                      </div>
                      <textarea
                        className="w-full border border-base-300 rounded-lg p-3 mb-4"
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                      />
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            if (!reviewText)
                              return toast.error("Review cannot be empty");
                            setSubmittingReview(true);
                            try {
                              if (editingReview) {
                                const res = await authApiClient.patch(
                                  `/api/services/${id}/reviews/${editingReview.id}/`,
                                  { rating: reviewRating, text: reviewText }
                                );
                                setReviews(
                                  reviews.map((r) =>
                                    r.id === res.data.id ? res.data : r
                                  )
                                );
                                toast.success("Review updated!");
                                setEditingReview(null);
                              } else {
                                const res = await authApiClient.post(
                                  `/api/services/${id}/reviews/`,
                                  { rating: reviewRating, text: reviewText }
                                );
                                setReviews([res.data, ...reviews]);
                                toast.success("Review added!");
                              }
                              setReviewText("");
                              setReviewRating(0);
                            } catch (err) {
                              console.error(err);
                              toast.error("Failed to submit review");
                            } finally {
                              setSubmittingReview(false);
                            }
                          }}
                          disabled={submittingReview}
                          className="btn btn-primary"
                        >
                          {submittingReview
                            ? "Saving..."
                            : editingReview
                            ? "Update Review"
                            : "Add Review"}
                        </motion.button>

                        {editingReview && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingReview(null);
                              setReviewText("");
                              setReviewRating(0);
                            }}
                            className="btn btn-outline"
                          >
                            Cancel
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="flex justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"
                    ></motion.div>
                  </div>
                ) : reviewsError ? (
                  <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center text-error">
                    Failed to load reviews. Please try again later.
                  </div>
                ) : reviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-base-200 rounded-xl p-12 text-center"
                  >
                    <div className="max-w-md mx-auto">
                      <div className="text-5xl mb-4">🌟</div>
                      <h3 className="text-xl font-medium mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-base-content/70">
                        Be the first to share your experience with this service!
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {reviews.map((r) => (
                      <motion.div
                        key={r.id}
                        variants={slideUp}
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
                          <div className="flex">
                            {renderStars(r.rating, "w-5 h-5")}
                          </div>
                        </div>
                        <p className="text-base-content/80 mb-3">{r.text}</p>

                        {/* Edit/Delete buttons for logged-in user's review */}
                        {user?.email && r.user === user.email && (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setEditingReview(r);
                                setReviewRating(r.rating);
                                setReviewText(r.text);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="btn btn-sm btn-outline flex items-center gap-1"
                            >
                              <FaEdit /> Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    "Are you sure you want to delete your review?"
                                  )
                                )
                                  return;
                                try {
                                  await authApiClient.delete(
                                    `/api/services/${id}/reviews/${r.id}/`
                                  );
                                  setReviews(
                                    reviews.filter((rev) => rev.id !== r.id)
                                  );
                                  toast.success("Review deleted!");
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Failed to delete review");
                                }
                              }}
                              className="btn btn-sm btn-error flex items-center gap-1"
                            >
                              <FaTrash /> Delete
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceDetail;
