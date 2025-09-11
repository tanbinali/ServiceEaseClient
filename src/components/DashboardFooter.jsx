import { FaHeart } from "react-icons/fa";

const DashboardFooter = () => {
  return (
    <footer className="bg-neutral text-neutral-content border-t border-neutral-600 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} ServiceEase. Made with{" "}
          <FaHeart className="text-red-500 inline" /> by{" "}
          <a
            href="https://github.com/tanbinali"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 underline transition-colors"
          >
            MD. Tanbin Ali
          </a>
          using ReactJS & TailwindCss. All rights reserved.
        </p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-gray-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gray-400 transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
