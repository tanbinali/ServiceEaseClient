import {
  FaHandsHelping,
  FaRocket,
  FaUsers,
  FaShieldAlt,
  FaHeart,
  FaLightbulb,
  FaGlobe,
  FaAward,
  FaChartLine,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import bannerImage from "../assets/banner.png";
import tanbin from "../assets/tanbin.jpg";
import enam from "../assets/enam.jpg";
import jb from "../assets/jb.jpg";
import adidas from "../assets/adidas.jpg";

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

const AboutUs = () => {
  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "20+", label: "Verified Providers" },
    { number: "50+", label: "Service Categories" },
    { number: "24/7", label: "Support" },
  ];

  const team = [
    {
      name: "MD Tanbin Ali",
      role: "CEO & Founder",
      image: tanbin,
    },
    {
      name: "Jewel Bhowmik",
      role: "Head of Operations",
      image: jb,
    },
    {
      name: "Arindoal Das",
      role: "Community & Quality Manager",
      image: adidas,
    },
    {
      name: "Enam Hassan",
      role: "Technical Support",
      image: enam,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-base-content mb-6">
            About <span className="text-primary">ServiceEase</span>
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8 leading-relaxed">
            Revolutionizing the way you discover, book, and manage services.
            We're building a community where quality meets convenience.
          </p>
          <div className="animate-bounce">
            <div className="w-6 h-6 rounded-full bg-primary mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-100">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-base-content/70 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-base-200">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-base-content mb-4"
              variants={itemVariants}
            >
              Our Story
            </motion.h2>
            <motion.div
              className="w-20 h-1 bg-primary mx-auto mb-6"
              variants={itemVariants}
            ></motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl rotate-2"></div>
                <img
                  src={bannerImage}
                  alt="ServiceEase Team"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>
            </motion.div>

            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.p
                className="text-lg text-base-content/80 leading-relaxed"
                variants={itemVariants}
              >
                ServiceEase was born from a simple observation: finding reliable
                service providers shouldn't be complicated. What started as a
                mission to simplify service discovery has evolved into a
                comprehensive platform connecting thousands of customers with
                trusted professionals.
              </motion.p>
              <motion.p
                className="text-lg text-base-content/80 leading-relaxed"
                variants={itemVariants}
              >
                Today, we're proud to be at the forefront of the service
                industry revolution, leveraging technology to create meaningful
                connections and deliver exceptional experiences for everyone
                involved.
              </motion.p>
              <motion.div
                className="flex items-center gap-4 pt-6"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2 text-primary">
                  <FaHeart className="w-5 h-5" />
                  <span className="font-semibold">Customer First</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <FaLightbulb className="w-5 h-5" />
                  <span className="font-semibold">Innovation Driven</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-base-100">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div
            className="bg-primary from-primary to-primary-focus text-primary-content p-8 rounded-2xl shadow-2xl"
            variants={scaleVariants}
          >
            <div className="flex items-center gap-4 mb-6">
              <FaGlobe className="text-4xl" />
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>
            <p className="text-lg leading-relaxed">
              To democratize access to quality services by creating a
              transparent, efficient, and trustworthy platform that empowers
              both customers and service providers to thrive in the digital
              economy.
            </p>
          </motion.div>

          <motion.div
            className="bg-primary from-secondary to-secondary-focus text-secondary-content p-8 rounded-2xl shadow-2xl"
            variants={scaleVariants}
          >
            <div className="flex items-center gap-4 mb-6">
              <FaAward className="text-4xl" />
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>
            <p className="text-lg leading-relaxed">
              To become the world's most trusted service marketplace, where
              anyone can find, book, and manage services with confidence, and
              where service providers can build sustainable businesses.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-base-content mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Our Core Values
            </motion.h2>
            <motion.p
              className="text-lg text-base-content/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            >
              These principles guide everything we do and every decision we make
            </motion.p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {[
              {
                icon: FaUsers,
                title: "Community First",
                desc: "We build platforms that bring people together and create opportunities for growth",
              },
              {
                icon: FaShieldAlt,
                title: "Trust & Safety",
                desc: "Every interaction is built on a foundation of verification and transparency",
              },
              {
                icon: FaRocket,
                title: "Innovation",
                desc: "We continuously evolve to meet the changing needs of our community",
              },
              {
                icon: FaChartLine,
                title: "Growth",
                desc: "We empower both customers and providers to achieve their goals",
              },
              {
                icon: FaStar,
                title: "Excellence",
                desc: "We strive for the highest quality in everything we deliver",
              },
              {
                icon: FaHandsHelping,
                title: "Collaboration",
                desc: "We believe great things happen when people work together",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-base-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                variants={itemVariants}
              >
                <div className="flex justify-center mb-6">
                  <value.icon className="text-4xl text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-center text-base-content mb-3">
                  {value.title}
                </h4>
                <p className="text-base-content/70 text-center">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl font-bold text-base-content mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              className="text-lg text-base-content/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              The passionate people behind ServiceEase
            </motion.p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={scaleVariants}
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative rounded-2xl w-full h-64 object-cover transform group-hover:scale-102 transition-transform"
                  />
                </div>
                <h4 className="font-semibold text-base-content mb-1">
                  {member.name}
                </h4>
                <p className="text-base-content/60">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-content mb-6">
            Join the ServiceEase Community
          </h2>
          <p className="text-xl text-primary-content/90 mb-8">
            Whether you're looking for services or offering them, we have a
            place for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn btn-lg btn-accent text-accent-content rounded-full px-8"
            >
              Sign Up as Customer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
