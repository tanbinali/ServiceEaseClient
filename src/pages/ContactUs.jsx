import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
  FaClock,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
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

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset submission status after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
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
            Contact <span className="text-primary">ServiceEase</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            Have questions or need support? Reach out to us and we'll get back
            to you as soon as possible.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          >
            <div className="badge badge-primary badge-lg p-4">24/7 Support</div>
            <div className="badge badge-outline badge-lg p-4">
              Quick Response
            </div>
          </motion.div>

          <motion.img
            src="https://static.vecteezy.com/system/resources/previews/017/055/715/non_2x/contact-us-button-web-banner-templates-illustration-free-vector.jpg"
            alt="Contact Hero"
            className="mt-10 mx-auto rounded-2xl shadow-2xl w-full max-w-4xl object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          />
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Get in Touch
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              {
                icon: FaMapMarkerAlt,
                title: "Our Location",
                lines: ["123 ServiceEase Blvd", "Chattogram, Bangladesh"],
              },
              {
                icon: FaPhoneAlt,
                title: "Call Us",
                lines: ["+880 1234 567890", "Mon-Fri, 9am-5pm"],
              },
              {
                icon: FaEnvelope,
                title: "Email",
                lines: ["support@serviceease.com", "We reply within 24 hours"],
              },
              {
                icon: FaClock,
                title: "Response Time",
                lines: ["Within 24 hours", "For all inquiries"],
              },
            ].map((info, idx) => (
              <motion.div
                key={idx}
                className="bg-base-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-base-300"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="text-2xl text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-base-content/70"
                        : "text-sm text-base-content/60 mt-1"
                    }
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-base-200">
        <motion.div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="bg-base-100 p-8 md:p-10 rounded-2xl shadow-lg border border-base-300"
            variants={scaleVariants}
          >
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                Send Us a Message
              </h2>
              <p className="text-lg text-base-content/70">
                Fill out the form below and our team will get back to you
                shortly.
              </p>
            </motion.div>

            {submitted && (
              <motion.div
                className="alert alert-success mb-6 animate-fade-in"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <label>
                    Thank you! Your message has been sent successfully.
                  </label>
                </div>
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="input input-bordered w-full"
                    required
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="input input-bordered w-full"
                    required
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="input input-bordered w-full"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={6}
                  className="textarea textarea-bordered w-full"
                  required
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full flex items-center justify-center gap-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-base-content mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Follow Us
          </motion.h2>
          <motion.p
            className="text-lg text-base-content/70 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Stay connected with us on social media for updates, news, and more.
          </motion.p>

          <motion.div
            className="flex justify-center gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              { icon: FaFacebook, href: "#", color: "text-blue-600" },
              { icon: FaTwitter, href: "#", color: "text-blue-400" },
              { icon: FaInstagram, href: "#", color: "text-pink-500" },
              { icon: FaLinkedin, href: "#", color: "text-blue-700" },
            ].map(({ icon: Icon, href, color }, idx) => (
              <motion.a
                key={idx}
                href={href}
                className="btn btn-circle btn-lg btn-outline"
                variants={itemVariants}
              >
                <Icon className={`text-2xl ${color}`} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Find Us
          </motion.h2>

          <motion.div
            className="rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58953.45423993322!2d91.778841!3d22.325854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd8a64095dfd3%3A0x5015cc5bcb6905d9!2sChattogram!5e0!3m2!1sen!2sbd!4v1623930601321!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ServiceEase Location"
              className="rounded-2xl"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
