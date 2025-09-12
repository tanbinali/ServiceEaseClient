import { FaHeart } from "react-icons/fa";
import { Link } from "react-router";

const DashboardFooter = () => {
  return (
    <footer className="bg-neutral text-neutral-content border-t border-neutral-600 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-4 text-sm text-neutral-400 text-center md:text-left">
        {/* Left side */}
        <p className="flex flex-wrap items-center justify-center gap-1">
          © {new Date().getFullYear()} ServiceEase. Made with{" "}
          <FaHeart className="text-red-500 inline" /> by{" "}
          <a
            href="https://github.com/tanbinali"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 underline transition-colors"
          >
            MD. Tanbin Ali
          </a>{" "}
          using ReactJS & TailwindCss. All rights reserved.
        </p>

        {/* Right side */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
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
    </footer>
  );
};

export default DashboardFooter;
