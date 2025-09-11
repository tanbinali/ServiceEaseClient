import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import heroVideo from "../../assets/hero-bg.mp4";

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 1.5,
      },
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Badge */}
        <motion.div className="mb-6" variants={itemVariants}>
          <motion.div
            className="inline-block bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/30"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(var(--color-primary) / 0.3)",
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm font-medium">
              Your Shine, Our Priority!
            </span>
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-base-100"
          variants={itemVariants}
        >
          Welcome to{" "}
          <motion.span
            className="text-secondary"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            ServiceEase
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl mb-8 text-base-100/90 max-w-3xl leading-relaxed"
          variants={itemVariants}
        >
          The easiest way to book and manage household services online. Fast,
          reliable, and at your fingertips.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          variants={containerVariants}
        >
          <motion.a
            href="https://serviceease-pi.vercel.app/swagger"
            className="btn btn-secondary btn-lg group flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span>Explore API Docs</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: 0 }}
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
          </motion.a>
          <motion.a
            href="/services"
            className="btn btn-outline btn-lg text-base-100 border-base-100 hover:bg-base-100 hover:text-primary-content"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Get Started
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate={isInView ? ["visible", "bounce"] : "hidden"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-base-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>

      {/* Floating particles/decoration */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-secondary/40"
        animate={{
          y: [0, -20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-accent/40"
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-base-100/50"
        animate={{
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
    </section>
  );
};

export default Hero;
