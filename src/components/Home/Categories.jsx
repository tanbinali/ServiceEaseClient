import { useEffect, useState } from "react";
import apiClient from "../../services/api-client";
import { FaBoxOpen, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TbWorld } from "react-icons/tb";
import { motion } from "framer-motion";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories/");
        setCategories(response.data.results);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            style={{
              display: "inline-block",
              transformOrigin: "center center",
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1], // slight, smooth scale in place
            }}
            transition={{
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <FaSpinner className="text-4xl text-primary" />
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">
            Explore Our <span className="text-primary">Categories</span>
          </h2>
          <motion.p
            className="text-lg text-base-content/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Discover a wide range of services tailored to your needs
          </motion.p>
        </motion.div>

        {/* Scrollable Carousel */}
        <div className="overflow-x-auto pb-6">
          <motion.div
            className="flex space-x-6 min-w-max px-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                className="w-72 flex-shrink-0"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-base-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full p-6 text-center border border-base-300 hover:border-primary/20">
                  <div className="mb-5 flex justify-center">
                    <motion.div
                      className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                      variants={iconVariants}
                      whileHover="hover"
                    >
                      <FaBoxOpen className="text-4xl text-primary" />
                    </motion.div>
                  </div>

                  <motion.h3
                    className="text-xl font-semibold mb-3 text-base-content group-hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.name}
                  </motion.h3>

                  <motion.p
                    className="text-base-content/70 mb-5 flex-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {category.description ||
                      "Explore our premium services in this category"}
                  </motion.p>

                  <div className="mt-auto">
                    <Link
                      to={`/category/${category.id}`}
                      className="btn btn-outline btn-primary btn-sm group/view w-full"
                    >
                      <motion.span
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        Browse Services
                      </motion.span>
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TbWorld />
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
