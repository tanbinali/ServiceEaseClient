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
import emailjs from "emailjs-com";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    // Simple form validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setStatus({
        type: "error",
        message: "❌ Please fill in all fields.",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "❌ Please enter a valid email address.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send email using EmailJS
      const result = await emailjs.send(
        "service_tla9bey",
        "template_g2j3dj5",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "tanbinali@gmail.com",
        },
        "HmfKJtpDpLzCsJfV1"
      );

      if (result.status === 200) {
        setStatus({
          type: "success",
          message:
            "✅ Thank you! Your message has been sent successfully. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Email sending failed");
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus({
        type: "error",
        message:
          "❌ Failed to send message. Please try again later or contact us directly at support@serviceease.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
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
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", color: "text-blue-600", name: "Facebook" },
    { icon: FaTwitter, href: "#", color: "text-blue-400", name: "Twitter" },
    { icon: FaInstagram, href: "#", color: "text-pink-500", name: "Instagram" },
    { icon: FaLinkedin, href: "#", color: "text-blue-700", name: "LinkedIn" },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section with Image */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/5 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Contact <span className="text-primary">ServiceEase</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Have questions or need support? Reach out to us and we'll get back
            to you as soon as possible.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="badge badge-primary badge-lg p-4">24/7 Support</div>
            <div className="badge badge-outline badge-lg p-4">
              Quick Response
            </div>
          </motion.div>

          <motion.div
            className="mt-10 mx-auto rounded-2xl shadow-2xl overflow-hidden max-w-4xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/017/055/715/non_2x/contact-us-button-web-banner-templates-illustration-free-vector.jpg"
              alt="Contact Us - Team Collaboration"
              className="w-full h-64 md:h-80 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 md:py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Get in Touch
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                className="bg-base-100 p-4 md:p-6 rounded-xl shadow-sm border border-base-300 text-center"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover="hover"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <info.icon className="text-xl md:text-2xl text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  {info.title}
                </h3>
                {info.lines.map((line, i) => (
                  <p
                    key={i}
                    className={`${
                      i === 0
                        ? "text-base-content/70 text-sm md:text-base"
                        : "text-xs md:text-sm text-base-content/60 mt-1"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-base-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-base-100 p-6 md:p-8 rounded-xl shadow-sm border border-base-300"
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Send Us a Message
              </h2>
              <p className="text-base-content/70">
                Fill out the form below and our team will get back to you
                shortly.
              </p>
            </div>

            {status.message && (
              <motion.div
                className={`alert ${
                  status.type === "success" ? "alert-success" : "alert-error"
                } mb-6`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{status.message}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="input input-bordered w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Your Email *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subject *</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="input input-bordered w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Your Message *</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows={5}
                  className="textarea textarea-bordered w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control pt-2">
                <motion.button
                  type="submit"
                  className="btn btn-primary gap-2 w-full"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-12 md:py-16 bg-base-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Follow Us
          </motion.h2>
          <motion.p
            className="text-base-content/70 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Stay connected with us on social media for updates, news, and more.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                className="btn btn-circle btn-outline hover:btn-primary transition-all duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.name}
              >
                <social.icon className={`text-xl ${social.color}`} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Find Us
          </motion.h2>
          <motion.div
            className="rounded-xl overflow-hidden shadow-sm border border-base-300"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58953.45423993322!2d91.778841!3d22.325854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd8a64095dfd3%3A0x5015cc5bcb6905d9!2sChattogram!5e0!3m2!1sen!2sbd!4v1623930601321!5m2!1sen!2sbd"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ServiceEase Location"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
