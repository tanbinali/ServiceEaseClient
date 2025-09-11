import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import logo from "../assets/logo.png";
import defaultImg from "../assets/default_profile.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCube,
  FaTags,
  FaStar,
  FaClipboardList,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import DashboardFooter from "../components/DashboardFooter";
import { FaUser } from "react-icons/fa6";

const dashboardLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <FaUser /> },
  { label: "Services", href: "/dashboard/services", icon: <FaCube /> },
  { label: "Categories", href: "/dashboard/categories", icon: <FaTags /> },
  { label: "Reviews", href: "/dashboard/reviews", icon: <FaStar /> },
  { label: "Orders", href: "/dashboard/orders", icon: <FaClipboardList /> },
  { label: "Cart", href: "/dashboard/cart", icon: <FaShoppingCart /> },
  { label: "Users", href: "/dashboard/users", icon: <FaUsers /> },
];

// Animation variants
const sidebarVariants = {
  open: { width: 256, transition: { duration: 0.3, ease: "easeInOut" } },
  closed: { width: 64, transition: { duration: 0.3, ease: "easeInOut" } },
};

const contentVariants = {
  open: { marginLeft: 256, transition: { duration: 0.3, ease: "easeInOut" } },
  closed: { marginLeft: 64, transition: { duration: 0.3, ease: "easeInOut" } },
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isActiveLink = (href) => location.pathname === href;

  // Filter links based on user group
  const filteredLinks = dashboardLinks
    .map((link) => {
      // Dynamic Cart link
      if (link.label === "Cart") {
        return {
          ...link,
          href: user?.groups?.includes("Client")
            ? "/dashboard/cart"
            : "/dashboard/admin-carts", // admins see admin cart
        };
      }

      // For Clients: redirect Services link
      if (user?.groups?.includes("Client") && link.label === "Services") {
        return { ...link, href: "/services" };
      }

      return link;
    })
    .filter((link) => {
      // Remove certain links for Clients
      if (user?.groups?.includes("Client")) {
        return !["Users", "Categories", "Reviews"].includes(link.label);
      }
      return true; // Admins see everything
    });

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Sidebar */}
      <motion.aside
        className="bg-base-200 border-r border-base-300 flex flex-col fixed h-full z-40"
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className={`flex flex-col h-full ${sidebarOpen ? "p-6" : "p-4"}`}>
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src={logo}
                    alt="ServiceEase Logo"
                    className="h-8 w-auto"
                  />
                  <span className="text-xl font-bold text-primary">
                    ServiceEase
                  </span>
                </Link>
              </motion.div>
            )}
            <motion.button
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
            </motion.button>
          </div>

          {/* User Info */}
          {sidebarOpen && user && (
            <motion.div
              className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-base-300"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <motion.img
                src={user.profile?.profile_picture || defaultImg}
                alt={user.profile?.full_name || user.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-base-400"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base-content truncate text-sm">
                  {user.profile?.full_name || user.username}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {user.email}
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.href}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={linkVariants}
              >
                <Link
                  to={link.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActiveLink(link.href)
                      ? "bg-primary text-primary-content shadow-lg"
                      : "text-base-content hover:bg-base-300 hover:text-primary"
                  } ${!sidebarOpen ? "justify-center" : ""}`}
                  title={!sidebarOpen ? link.label : ""}
                >
                  <motion.span
                    className="text-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {link.icon}
                  </motion.span>
                  {sidebarOpen && (
                    <motion.span
                      className="font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Logout Button */}
          {sidebarOpen && (
            <motion.div
              className="pt-4 border-t border-base-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.button
                onClick={logoutUser}
                className="flex items-center gap-3 p-3 rounded-xl text-error hover:bg-error hover:text-error-content transition-all w-full"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col"
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={contentVariants}
      >
        {/* Mobile Header */}
        <header className="bg-base-100 border-b border-base-300 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={toggleMobileMenu}
              className="btn btn-ghost btn-circle"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="ServiceEase Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-primary">
                ServiceEase
              </span>
            </Link>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-base-100 border-b border-base-300 overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
            >
              <div className="grid grid-cols-2 gap-3 p-4">
                {filteredLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                        isActiveLink(link.href)
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 text-base-content"
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-medium text-sm">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <motion.div
            className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-6 min-h-[calc(100vh-12rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-base-100 border-t border-base-300">
          <DashboardFooter />
        </footer>
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
