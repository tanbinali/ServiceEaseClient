import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content border-t border-neutral-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="ServiceEase Logo"
                className="h-10 w-auto filter brightness-0 invert"
              />
              <span className="text-xl font-bold text-white">ServiceEase</span>
            </Link>
            <p className="text-neutral-300 leading-relaxed">
              Your one-stop solution for all household services. Professional,
              reliable, and at your fingertips.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 hover:text-gray-400 transition-colors"
              >
                <FaTwitter className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 hover:text-gray-400 transition-colors"
              >
                <FaFacebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 hover:text-gray-400 transition-colors"
              >
                <FaInstagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 hover:text-gray-400 transition-colors"
              >
                <FaYoutube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services"
                  className="text-neutral-300 hover:text-gray-400 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-neutral-300 hover:text-gray-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-neutral-300 hover:text-gray-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-neutral-300 hover:text-gray-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-neutral-300 hover:text-gray-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/TOS"
                  className="text-neutral-300 hover:text-gray-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaPhone className="w-4 h-4 text-white hover:text-gray-400 transition-colors" />
                <span className="text-neutral-300">+880 1234 567890</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="w-4 h-4 text-white hover:text-gray-400 transition-colors" />
                <span className="text-neutral-300">
                  support@serviceease.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="w-4 h-4 text-white hover:text-gray-400 transition-colors" />
                <span className="text-neutral-300">Chattogram, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm flex items-center gap-1">
            © {new Date().getFullYear()} ServiceEase. Made with{" "}
            <FaHeart className="text-white hover:text-gray-400 transition-colors inline mx-1" />{" "}
            by{" "}
            <a
              href="https://github.com/tanbinali"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-400 underline transition-colors"
            >
              MD. Tanbin Ali
            </a>{" "}
            using ReactJs & TailwindCss. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-neutral-400 hover:text-gray-400 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/TOS"
              className="text-neutral-400 hover:text-gray-400 text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
