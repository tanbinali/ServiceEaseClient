import {
  FaPhoneAlt,
  FaClock,
  FaEnvelope,
  FaHeadset,
  FaComments,
} from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const CallUs = () => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <motion.section
      className="py-16 bg-base-200"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            className="lg:w-1/2 text-center lg:text-left space-y-6"
            variants={itemVariants}
          >
            <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-content">
              Need <span className="text-primary">Assistance</span>?
            </motion.h2>
            <motion.p className="text-lg text-base-content/70 leading-relaxed">
              Our dedicated support team is here to help you with any inquiries,
              bookings, or service-related questions. We value your time and
              guarantee prompt responses.
            </motion.p>

            {/* Additional Info Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
              variants={containerVariants}
            >
              {/* Card 1 */}
              <motion.div
                className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FaHeadset className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">
                      24/7 Support
                    </h4>
                    <p className="text-sm text-base-content/60">
                      Always available
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="bg-base-100 rounded-xl p-4 shadow-sm border border-base-300"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <FaComments className="text-secondary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base-content">
                      Quick Response
                    </h4>
                    <p className="text-sm text-base-content/60">
                      Under 5 minutes
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Card */}
          <motion.div
            className="lg:w-1/2 flex justify-center w-full"
            variants={itemVariants}
          >
            <div
              className="relative w-full max-w-[260px] sm:max-w-[300px] perspective cursor-pointer"
              onClick={toggleFlip}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleFlip();
                }
              }}
            >
              <motion.div
                className="transform-style preserve-3d transition-transform duration-700 w-full aspect-[4/5]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                aria-pressed={flipped}
              >
                {/* Front Side */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary to-primary-focus rounded-xl flex flex-col items-center justify-center text-white backface-hidden shadow-lg p-4 space-y-3"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="p-3 bg-white/20 rounded-full">
                    <FaPhoneAlt className="text-4xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-center">
                    Get in Touch
                  </h3>
                  <p className="text-white/80 text-center text-sm">
                    Tap to see our contact details
                  </p>
                </motion.div>

                {/* Back Side */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary-focus rounded-xl flex flex-col items-center justify-center text-white shadow-lg p-4 space-y-3 rotate-y-180 backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <h3 className="text-xl font-bold mb-1 text-center">
                    Contact Us
                  </h3>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                      <div className="p-2 bg-white/20 rounded-full">
                        <FaPhoneAlt className="text-white text-base" />
                      </div>
                      <div>
                        <p className="font-medium">+880 1234 567890</p>
                        <p className="text-white/70 text-xs">Call us anytime</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                      <div className="p-2 bg-white/20 rounded-full">
                        <FaClock className="text-white text-base" />
                      </div>
                      <div>
                        <p className="font-medium">Sat - Thurs: 9am - 6pm</p>
                        <p className="text-white/70 text-xs">Working hours</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                      <div className="p-2 bg-white/20 rounded-full">
                        <FaEnvelope className="text-white text-base" />
                      </div>
                      <div>
                        <p className="font-medium">support@serviceease.com</p>
                        <p className="text-white/70 text-xs">Email us</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="tel:+8801234567890"
                    className="btn btn-xs btn-outline mt-2 w-full text-white border-white hover:bg-white hover:text-primary flex items-center justify-center gap-1"
                  >
                    <FaPhoneAlt className="group-hover:animate-pulse" />
                    Call Now
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for 3D flip */}
      <style>{`
        .perspective {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style {
          transform-style: preserve-3d;
        }
      `}</style>
    </motion.section>
  );
};

export default CallUs;
