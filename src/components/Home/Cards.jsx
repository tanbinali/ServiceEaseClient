import { motion } from "framer-motion";

const cardData = [
  {
    title: "Fast Delivery",
    description: "Book services instantly with minimal waiting time.",
    icon: "🚀",
  },
  {
    title: "100% Trusted",
    description:
      "We only work with verified and professional service providers.",
    icon: "✅",
  },
  {
    title: "Affordable Pricing",
    description: "Get top-notch services without breaking the bank.",
    icon: "💰",
  },
  {
    title: "24/7 Support",
    description: "Our support team is always here to assist you.",
    icon: "📞",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
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
  hidden: { opacity: 0, y: 10 },
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
    scale: 1.2,
    rotate: 360,
    transition: { duration: 0.5 },
  },
};

const Cards = () => {
  return (
    <section className="py-16 md:py-24 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-base-content">
            Why Choose <span className="text-primary">ServiceEase</span>?
          </h2>
          <motion.p
            className="text-lg text-base-content/70 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Discover what makes us the preferred choice for all your service
            needs
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              className="group relative bg-base-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-base-300 hover:border-primary/20 hover:-translate-y-2"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              {/* Decorative element */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <span className="text-2xl">{card.icon}</span>
                </motion.div>
              </div>

              <div className="pt-8 pb-4">
                <motion.h3
                  className="text-xl font-semibold mb-3 text-base-content group-hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  className="text-base-content/70 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {card.description}
                </motion.p>
              </div>

              {/* Hover indicator */}
              <motion.div
                className="mt-auto w-12 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <a
            href="/services"
            className="btn btn-primary btn-lg px-8 rounded-full group/btn"
          >
            <motion.span whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              Explore Our Services
            </motion.span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform"
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
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Cards;
