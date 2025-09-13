import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaSpinner,
  FaSearch,
  FaHistory,
} from "react-icons/fa";
import { useAuthContext } from "../contexts/AuthContext";
import apiClient from "../services/api-client";
import logo from "../assets/logo.png";
import defaultImg from "../assets/default_profile.png";
import CartContext from "../contexts/CartContext";

const Navbar = () => {
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const categoriesRef = useRef(null);
  const profileRef = useRef(null);

  const { cart, createOrGetCart } = useContext(CartContext);

  useEffect(() => {
    if (cart?.items) {
      const count = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartItemsCount(count);
    } else {
      setCartItemsCount(0);
    }
  }, [cart]);

  useEffect(() => {
    createOrGetCart();
  }, [createOrGetCart]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories/");
        setCategories(response.data.results || response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);
  const toggleCategoriesDropdown = () =>
    setCategoriesDropdownOpen(!categoriesDropdownOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-base-100/95 backdrop-blur-sm shadow-lg border-b border-base-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ServiceEase Logo" className="h-10 w-auto" />
            <span className="hidden sm:block text-xl font-bold text-primary">
              ServiceEase
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40">
                <FaSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-12 pr-4"
              />
            </div>
          </form>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <Link
            to="/services"
            className={`px-3 py-2 rounded-lg transition-colors ${
              isActiveLink("/services")
                ? "text-primary font-semibold bg-primary/10"
                : "text-base-content hover:text-primary hover:bg-base-200"
            }`}
          >
            Services
          </Link>

          <Link
            to="/about-us"
            className={`px-3 py-2 rounded-lg transition-colors ${
              isActiveLink("/about-us")
                ? "text-primary font-semibold bg-primary/10"
                : "text-base-content hover:text-primary hover:bg-base-200"
            }`}
          >
            About Us
          </Link>

          <div className="relative" ref={categoriesRef}>
            <button
              onClick={toggleCategoriesDropdown}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover: cursor-pointer ${
                categoriesDropdownOpen
                  ? "text-primary font-semibold bg-primary/10"
                  : "text-base-content hover:text-primary hover:bg-base-200"
              }`}
            >
              Categories{" "}
              <FaChevronDown className="text-xs transition-transform" />
            </button>
            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-base-100 rounded-xl shadow-2xl border border-base-300 py-2 z-50 max-h-80 overflow-y-auto">
                <div className="px-4 py-2 border-b border-base-300">
                  <h3 className="font-semibold text-base-content">
                    Browse Categories
                  </h3>
                </div>
                {loadingCategories ? (
                  <div className="flex justify-center py-6">
                    <FaSpinner className="animate-spin text-primary text-xl" />
                  </div>
                ) : categories.length > 0 ? (
                  <div className="py-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="block px-4 py-3 text-base-content hover:bg-base-200 transition-colors"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-base-content/60 text-center">
                    No categories available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-base-200 transition-colors">
            <FaSearch className="w-5 h-5" />
          </button>

          {user ? (
            <>
              <Link
                to="/dashboard/cart"
                className="p-2 rounded-lg hover:bg-base-200 transition-colors relative"
              >
                <FaShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-base-200 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                    <img
                      src={user.profile?.profile_picture || defaultImg}
                      alt={user.profile?.full_name || user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-base-content">
                    {user.profile?.full_name || user.username}
                  </span>
                  <FaChevronDown className="text-xs" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-base-100 rounded-xl shadow-2xl border border-base-300 py-2 z-50">
                    <div className="px-4 py-3 border-b border-base-300">
                      <p className="font-semibold text-base-content">
                        {user.profile?.full_name || user.username}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-base-content hover:bg-base-200 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <FaUser className="text-base-content/70" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/dashboard/orders"
                        className="flex items-center gap-3 px-4 py-2 text-base-content hover:bg-base-200 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <FaHistory className="text-base-content/70" />
                        <span>Orders</span>
                      </Link>
                    </div>

                    <div className="border-t border-base-300 pt-2">
                      <button
                        onClick={() => {
                          logoutUser();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-error hover:bg-error hover:text-error-content transition-colors"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm hover:bg-base-200 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm hover:scale-105 transition-transform"
              >
                Register
              </Link>
            </div>
          )}

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-base-100/95 backdrop-blur-sm border-t border-base-300 shadow-xl">
          <div className="px-4 py-4 space-y-3">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40">
                  <FaSearch className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-12 pr-4"
                />
              </div>
            </form>

            <Link
              to="/services"
              className="block py-3 px-4 rounded-lg hover:bg-base-200 transition-colors font-medium"
              onClick={toggleMobileMenu}
            >
              Services
            </Link>

            <Link
              to="/about-us"
              className="block py-3 px-4 rounded-lg hover:bg-base-200 transition-colors font-medium"
              onClick={toggleMobileMenu}
            >
              About Us
            </Link>

            <div>
              <button
                onClick={toggleCategoriesDropdown}
                className="w-full flex justify-between items-center py-3 px-4 rounded-lg hover:bg-base-200 transition-colors font-medium"
              >
                Categories <FaChevronDown className="text-xs" />
              </button>
              {categoriesDropdownOpen && (
                <div className="pl-6 mt-2 space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="block py-2 px-4 rounded-lg hover:bg-base-200 transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="block py-3 px-4 rounded-lg hover:bg-base-200 transition-colors font-medium"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/cart"
                  className="block py-3 px-4 rounded-lg hover:bg-base-200 transition-colors font-medium"
                  onClick={toggleMobileMenu}
                >
                  Shopping Cart
                </Link>
              </>
            )}

            {!user && (
              <div className="pt-4 border-t border-base-300 space-y-2">
                <Link
                  to="/login"
                  className="block py-3 px-4 rounded-lg hover:bg-base-200 transition-colors font-medium text-center"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-3 px-4 rounded-lg bg-primary text-primary-content hover:bg-primary-focus transition-colors font-medium text-center"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
