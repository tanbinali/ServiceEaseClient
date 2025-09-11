import { useState } from "react";
import {
  FaShieldAlt,
  FaUserLock,
  FaDatabase,
  FaCookie,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaEnvelope,
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

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [lastUpdated] = useState(new Date().toLocaleDateString());

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content:
        "At ServiceEase, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our views and practices regarding your personal data.",
      icon: FaShieldAlt,
    },
    {
      id: "data-collection",
      title: "Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, use our services, or contact us. This may include: name, email address, phone number, payment information, and any other information you choose to provide. We also automatically collect certain information about your device and usage of our services through cookies and similar technologies.",
      icon: FaDatabase,
    },
    {
      id: "data-use",
      title: "How We Use Your Information",
      content:
        "We use the information we collect to provide, maintain, and improve our services; process transactions and send related information; send you technical notices and support messages; respond to your comments and questions; communicate with you about products and services; monitor and analyze trends and usage; and detect, investigate, and prevent fraudulent transactions and other illegal activities.",
      icon: FaEye,
    },
    {
      id: "data-sharing",
      title: "Information Sharing",
      content:
        "We may share your information with: service providers who perform services on our behalf; professional advisors such as lawyers and accountants; law enforcement agencies when required by law; and other parties in connection with a merger or acquisition. We do not sell your personal information to third parties.",
      icon: FaUserLock,
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      content:
        "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
      icon: FaCookie,
    },
    {
      id: "data-security",
      title: "Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.",
      icon: FaShieldAlt,
    },
    {
      id: "your-rights",
      title: "Your Rights",
      content:
        "You have the right to access, correct, or delete your personal information. You can also object to the processing of your personal information, ask us to restrict processing, or request portability of your personal information. To exercise these rights, please contact us using the contact details provided.",
      icon: FaUserLock,
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. You are advised to review this Privacy Policy periodically for any changes.",
      icon: FaShieldAlt,
    },
  ];

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-accent/5 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Privacy <span className="text-primary">Policy</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            Your privacy is important to us. This policy explains what
            information we collect, how we use it, and your rights regarding
            your personal data.
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
            <div className="badge badge-outline badge-lg p-4">Version 2.0</div>
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

      {/* Privacy Content Section */}
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
              <h3 className="text-lg font-semibold mb-2">
                Transparency Matters
              </h3>
              <p className="text-base-content/80">
                We believe in being clear about how we collect, use, and protect
                your personal information. If you have any questions after
                reading this policy, please don't hesitate to contact us.
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
            <h3 className="text-xl font-bold text-primary mb-4">
              Your Consent
            </h3>
            <p className="text-base-content/80">
              By using our website and services, you consent to our Privacy
              Policy and agree to its terms.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="py-16 bg-base-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-6">
              Questions About Privacy?
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Our team is here to help you understand our privacy practices and
              your rights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="bg-base-100 p-6 rounded-lg shadow-md"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-4">
                <FaEnvelope className="text-2xl text-primary" />
                <h3 className="text-xl font-semibold">Email Us</h3>
              </div>
              <p className="text-base-content/80 mb-4">
                Send us an email with your questions or concerns about privacy.
              </p>
              <a
                href="mailto:privacy@serviceease.com"
                className="btn btn-primary"
              >
                privacy@serviceease.com
              </a>
            </motion.div>

            <motion.div
              className="bg-base-100 p-6 rounded-lg shadow-md"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 mb-4">
                <FaShieldAlt className="text-2xl text-primary" />
                <h3 className="text-xl font-semibold">Data Request</h3>
              </div>
              <p className="text-base-content/80 mb-4">
                Request a copy of your data or ask us to delete your
                information.
              </p>
              <Link to="/" className="btn btn-outline btn-primary">
                Submit Request
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-primary to-accent"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-content mb-6">
            Protecting Your Privacy
          </h2>
          <p className="text-lg md:text-xl text-primary-content/90 mb-8">
            We're committed to transparency and giving you control over your
            personal information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn btn-lg btn-secondary text-secondary-content rounded-full px-8"
            >
              Contact Us
            </Link>
            <Link
              to="/TOS"
              className="btn btn-lg btn-outline btn-primary-content rounded-full px-8"
            >
              View Terms of Service
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy;
