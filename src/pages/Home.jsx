import CallUs from "../components/Home/CallUs.jsx";
import Cards from "../components/Home/Cards.jsx";
import Categories from "../components/Home/Categories.jsx";
import Hero from "../components/Home/Hero.jsx";
import PromoSection from "../components/Home/PromoSection.jsx";
import Reviews from "../components/Home/Reviews.jsx";
import TopServices from "../components/Home/TopServices.jsx";
import { motion } from "framer-motion";

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

const Home = () => {
  return (
    <motion.div
      className="overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section className="relative" variants={itemVariants}>
        <Hero />
      </motion.section>

      {/* Features Cards */}
      <motion.section className="relative z-10" variants={itemVariants}>
        <Cards />
      </motion.section>

      {/* Top Services */}
      <motion.section className="relative" variants={itemVariants}>
        <TopServices />
      </motion.section>

      {/* Promo Section */}
      <motion.section className="relative" variants={itemVariants}>
        <PromoSection />
      </motion.section>

      {/* Categories */}
      <motion.section className="relative" variants={itemVariants}>
        <Categories />
      </motion.section>

      {/* Reviews */}
      <motion.section className="relative" variants={itemVariants}>
        <Reviews />
      </motion.section>

      {/* Call to Action */}
      <motion.section className="relative" variants={itemVariants}>
        <CallUs />
      </motion.section>
    </motion.div>
  );
};

export default Home;
