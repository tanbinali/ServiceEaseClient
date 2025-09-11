import { useState } from "react";
import {
  FaFileContract,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaUsers,
  FaRocket,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [lastUpdated] = useState(new Date().toLocaleDateString());

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content:
        "By accessing or using ServiceEase, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.",
      icon: FaCheckCircle,
    },
    {
      id: "accounts",
      title: "User Accounts",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.",
      icon: FaUsers,
    },
    {
      id: "usage",
      title: "Service Usage",
      content:
        "You may use our services only for lawful purposes. You agree not to misuse the platform or interfere with its normal operation.",
      icon: FaRocket,
    },
    {
      id: "payments",
      title: "Payments & Refunds",
      content:
        "All payments are processed securely through our platform. Refunds are handled according to our refund policy.",
      icon: FaFileContract,
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content:
        "ServiceEase is not liable for any indirect, incidental, or consequential damages arising from the use of the services.",
      icon: FaShieldAlt,
    },
    {
      id: "termination",
      title: "Termination",
      content:
        "We may suspend or terminate your access to ServiceEase at any time for violations of these Terms or other policies.",
      icon: FaClock,
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content:
        "We reserve the right to modify these Terms at any time. Updates will be posted on this page, and continued use indicates acceptance of the updated terms.",
      icon: FaCheckCircle,
    },
  ];

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/5 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Terms of <span className="text-primary">Service</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            Please read these terms carefully before using our platform. By
            using ServiceEase, you agree to these terms.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          >
            <div className="badge badge-primary badge-lg p-4">
              Last Updated: {lastUpdated}
            </div>
            <div className="badge badge-outline badge-lg p-4">Version 2.1</div>
          </motion.div>

          <motion.div
            className="animate-bounce mt-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <div className="w-6 h-6 rounded-full bg-primary mx-auto"></div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <motion.section
        className="py-8 bg-base-200 sticky top-0 z-20 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-lg font-semibold text-center mb-4"
            variants={itemVariants}
          >
            Quick Navigation
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-2">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                className="btn btn-xs btn-outline btn-primary"
                onClick={() =>
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                variants={itemVariants}
              >
                {section.title}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Terms Content Section */}
      <motion.section
        className="py-16 bg-base-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-base-200 p-6 rounded-lg mb-12 flex items-start gap-4"
            variants={itemVariants}
          >
            <FaQuestionCircle className="text-2xl text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
              <p className="text-base-content/80">
                These Terms of Service govern your use of ServiceEase. It's
                important to read them carefully as they affect your legal
                rights.
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                className="bg-base-200 p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={itemVariants}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setActiveSection(
                      activeSection === section.id ? null : section.id
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="text-2xl text-primary flex-shrink-0" />
                    <h3 className="text-xl font-bold text-base-content">
                      {index + 1}. {section.title}
                    </h3>
                  </div>
                  <button className="btn btn-ghost btn-sm">
                    {activeSection === section.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                </div>

                <div
                  className={`mt-4 pl-11 ${
                    activeSection === section.id ? "block" : "hidden"
                  }`}
                >
                  <p className="text-base-content/80 text-lg leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 p-6 border border-primary/20 rounded-lg bg-primary/5"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-primary mb-4">Agreement</h3>
            <p className="text-base-content/80">
              By using ServiceEase, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-primary to-secondary"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-content mb-6">
            Need More Information?
          </h2>
          <p className="text-lg md:text-xl text-primary-content/90 mb-8">
            If you have questions about our Terms of Service, feel free to
            contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn btn-lg btn-accent text-accent-content rounded-full px-8"
            >
              Contact Support
            </Link>
            <Link
              to="/privacy"
              className="btn btn-lg btn-outline btn-primary-content rounded-full px-8"
            >
              View Privacy Policy
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default TermsOfService;
