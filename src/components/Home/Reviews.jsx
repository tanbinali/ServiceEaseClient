import { useEffect, useState } from "react";
import {
  FaStar,
  FaUser,
  FaConciergeBell,
  FaSpinner,
  FaQuoteLeft,
} from "react-icons/fa";
import apiClient from "../../services/api-client";
import { motion } from "framer-motion";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both reviews and services
        const [reviewsRes, servicesRes] = await Promise.all([
          apiClient.get("/reviews/"),
          apiClient.get("/services/"),
        ]);

        setReviews(reviewsRes.data.results);
        setServices(servicesRes.data.results);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const renderStars = (rating) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={starVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
        >
          <FaStar
            className={`${i < rating ? "text-warning" : "text-base-300"}`}
          />
        </motion.span>
      ));

  const getServiceName = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.name : "Unknown Service";
  };

  if (loading) {
    return (
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">
            What Our <span className="text-primary">Customers Say</span>
          </h2>
          <motion.p
            className="text-lg text-base-content/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Discover why thousands of customers trust ServiceEase for their
            service needs
          </motion.p>
        </motion.div>

        <motion.div
          className="flex space-x-6 overflow-x-auto pb-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              className="min-w-[300px] md:min-w-[350px] flex-shrink-0 bg-base-100 rounded-2xl p-6 flex flex-col shadow-lg hover:shadow-xl transition-all group"
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              {/* Quote icon */}
              <motion.div
                className="mb-4 text-primary/30"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <FaQuoteLeft className="text-3xl" />
              </motion.div>

              {/* Review text */}
              <motion.p
                className="text-base-content/80 mb-6 flex-1 italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                "{review.text}"
              </motion.p>

              {/* Rating */}
              <div className="flex justify-center mb-4 gap-1">
                {renderStars(review.rating)}
              </div>

              {/* User info */}
              <motion.div
                className="flex items-center justify-between border-t border-base-300 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaUser className="text-primary" />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-base-content">
                      {review.user.split("@")[0]}
                    </div>
                    <div className="flex items-center text-sm text-base-content/60">
                      <FaConciergeBell className="mr-1 text-xs" />
                      <span>{getServiceName(review.service)}</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="text-sm text-base-content/50"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {new Date(review.created_at).toLocaleDateString()}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {reviews.length === 0 && !loading && (
          <motion.div
            className="text-center py-12 bg-base-100 rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-5xl mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              🌟
            </motion.div>
            <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
            <p className="text-base-content/70">
              Be the first to share your experience!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
