import { FaBolt, FaStar, FaGift } from "react-icons/fa";
import { Link } from "react-router-dom";
import offerSticker from "../../assets/discount.png";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stickerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const floatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const PromoSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-base-100 rounded-3xl shadow-xl overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="flex flex-col lg:flex-row items-center">
            {/* Left Content - Text */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 order-2 lg:order-1">
              <div className="max-w-lg mx-auto lg:mx-0 lg:ml-auto text-center lg:text-left">
                <motion.div
                  className="inline-flex items-center bg-primary/10 px-4 py-2 rounded-full mb-6"
                  variants={itemVariants}
                >
                  <FaGift className="text-primary mr-2" />
                  <span className="text-sm font-semibold text-primary">
                    Limited Time Offer
                  </span>
                </motion.div>

                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-4 text-base-content"
                  variants={itemVariants}
                >
                  Get <span className="text-primary">30% OFF</span> Your First
                  Service
                </motion.h2>

                <motion.p
                  className="text-lg text-base-content/70 mb-6 leading-relaxed"
                  variants={itemVariants}
                >
                  Experience the quality of our services with an exclusive
                  discount for new customers. Professional results at an
                  unbeatable price!
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  variants={itemVariants}
                >
                  <Link to="/services">
                    <button className="btn btn-primary btn-lg group flex items-center gap-2">
                      <FaBolt className="group-hover:animate-pulse" />
                      Claim Offer Now
                    </button>
                  </Link>
                  <Link to="/about">
                    <button className="btn btn-outline btn-lg">
                      Learn More
                    </button>
                  </Link>
                </motion.div>

                <motion.div
                  className="mt-8 flex items-center justify-center lg:justify-start text-sm text-base-content/60"
                  variants={itemVariants}
                >
                  <FaStar className="text-warning mr-1" />
                  <span>Trusted by thousands of satisfied customers</span>
                </motion.div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="flex-1 relative order-1 lg:order-2">
              <div className="relative h-64 lg:h-96 flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <motion.img
                  src={offerSticker}
                  alt="30% Discount Offer"
                  className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
                  variants={stickerVariants}
                  animate={floatAnimation}
                />

                {/* Decorative elements */}
                <motion.div
                  className="absolute top-6 right-6 w-16 h-16 rounded-full bg-primary/20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
                <motion.div
                  className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-secondary/20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PromoSection;
