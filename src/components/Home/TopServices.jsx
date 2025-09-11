import { useEffect, useState } from "react";
import { FaDollarSign, FaClock, FaStar, FaCartPlus } from "react-icons/fa";
import apiClient from "../../services/api-client";
import defaultImage from "../../assets/default-image.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
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
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const TopServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get("/services/");
        const sortedServices = response.data.results.sort(
          (a, b) => (b.rating || 0) - (a.rating || 0)
        );
        setServices(sortedServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex justify-center mb-4">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <motion.span
              key={`full-${i}`}
              custom={i}
              variants={starVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
            >
              <FaStar className="text-warning mr-1" />
            </motion.span>
          ))}
        {halfStar && (
          <motion.span
            key="half"
            custom={fullStars}
            variants={starVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
          >
            <FaStar className="text-warning/60 mr-1" />
          </motion.span>
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <motion.span
              key={`empty-${i}`}
              custom={fullStars + (halfStar ? 1 : 0) + i}
              variants={starVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20px" }}
            >
              <FaStar className="text-base-300 mr-1" />
            </motion.span>
          ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </motion.div>
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
            Our <span className="text-primary">Popular Services</span>
          </h2>
          <motion.p
            className="text-lg text-base-content/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Discover our most sought-after services that customers love
          </motion.p>
        </motion.div>

        {/* Scrollable Carousel */}
        <motion.div
          className="flex overflow-x-auto space-x-6 pb-4 scroll-smooth scrollbar-hide"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="flex-shrink-0 w-72 bg-base-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group"
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={service.image || defaultImage}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute top-4 right-4">
                  <motion.div
                    className="badge badge-primary badge-lg font-semibold py-3"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    viewport={{ once: true }}
                  >
                    ${service.price}
                  </motion.div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <motion.h3
                  className="text-xl font-semibold mb-3 text-base-content group-hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {service.name}
                </motion.h3>

                <motion.div
                  className="flex items-center justify-between mb-4 text-base-content/70"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-secondary" />
                    <span>{service.duration?.slice(0, 5) || "N/A"} hours</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 font-semibold">
                      {service.rating || 0}
                    </span>
                    <FaStar className="text-warning" />
                  </div>
                </motion.div>

                {renderStars(service.rating)}

                <div className="mt-auto pt-4">
                  <Link
                    to={`/service/${service.id}`}
                    className="btn btn-primary btn-block flex items-center justify-center gap-2 group/btn"
                  >
                    <motion.span
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      View Details
                    </motion.span>
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaCartPlus />
                    </motion.span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link
            to="/services"
            className="btn btn-outline btn-primary btn-lg px-8 group/cta"
          >
            <motion.span whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
              View All Services
            </motion.span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover/cta:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </motion.svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TopServices;
