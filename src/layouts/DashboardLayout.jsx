import { useState, useEffect } from "react";
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
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaBars,
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

const sidebarVariants = {
  mobileOpen: {
    x: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  mobileClosed: {
    x: "-100%",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  desktop: {
    width: 256,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const overlayVariants = {
  open: { opacity: 1, transition: { duration: 0.3 } },
  closed: { opacity: 0, transition: { duration: 0.3 } },
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    // Only allow toggling on mobile devices
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const isActiveLink = (href) => location.pathname === href;

  // Filter links based on user group
  const filteredLinks = dashboardLinks
    .map((link) => {
      if (link.label === "Cart") {
        return {
          ...link,
          href: user?.groups?.includes("Client")
            ? "/dashboard/cart"
            : "/dashboard/admin-carts",
        };
      }
      if (user?.groups?.includes("Client") && link.label === "Services") {
        return { ...link, href: "/services" };
      }
      return link;
    })
    .filter((link) => {
      if (user?.groups?.includes("Client")) {
        return !["Users", "Categories", "Reviews"].includes(link.label);
      }
      return true;
    });

  // Determine sidebar variants based on device
  const getSidebarVariant = () => {
    if (isMobile) {
      return sidebarOpen ? "mobileOpen" : "mobileClosed";
    }
    return "desktop"; // Always open on desktop
  };

  return (
    <div className="flex min-h-screen bg-base-100 relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="bg-base-200 border-r border-base-300 flex flex-col fixed h-full z-50 w-64"
        initial={isMobile ? "mobileClosed" : "desktop"}
        animate={getSidebarVariant()}
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo and Toggle - Only show toggle on mobile */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={closeSidebar}
              >
                <img src={logo} alt="ServiceEase Logo" className="h-8 w-auto" />
                <span className="text-xl font-bold text-primary">
                  ServiceEase
                </span>
              </Link>
            </motion.div>
            {/* Only show toggle button on mobile */}
            {isMobile && (
              <motion.button
                onClick={toggleSidebar}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close sidebar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronLeft />
              </motion.button>
            )}
          </div>

          {/* User Info */}
          {user && (
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
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActiveLink(link.href)
                      ? "bg-primary text-primary-content shadow-lg"
                      : "text-base-content hover:bg-base-300 hover:text-primary"
                  }`}
                >
                  <motion.span
                    className="text-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                  >
                    {link.icon}
                  </motion.span>
                  <motion.span
                    className="font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Logout Button */}
          <motion.div
            className="pt-4 border-t border-base-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <motion.button
              onClick={() => {
                closeSidebar();
                logoutUser();
              }}
              className="flex items-center gap-3 p-3 rounded-xl text-error hover:bg-error hover:text-error-content transition-all w-full"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isMobile ? "w-full" : "ml-64"}`}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-base-100 border-b border-base-300 p-4 flex items-center justify-between md:hidden">
            <button
              onClick={toggleSidebar}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Open sidebar"
            >
              <FaBars />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="ServiceEase Logo" className="h-6 w-auto" />
              <span className="text-lg font-bold text-primary">
                ServiceEase
              </span>
            </Link>
            <div className="w-6"></div> {/* Spacer for balance */}
          </div>
        )}

        <main className={`flex-1 ${isMobile ? "p-4" : "p-6"}`}>
          <motion.div
            className="bg-base-100 rounded-2xl shadow-sm border border-base-300 p-4 md:p-6 min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-12rem)]"
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
      </div>
    </div>
  );
};

export default DashboardLayout;
