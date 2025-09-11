import { FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

export const EmptyCart = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-100">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="bg-primary/10 p-6 rounded-2xl inline-block mb-6">
        <FaBoxOpen className="text-4xl text-primary" />
      </div>
      <h1 className="text-3xl font-extrabold text-base-content mb-4">
        Your cart is empty
      </h1>
      <p className="text-base-content/70 mb-8">
        Looks like you haven't added any services to your cart yet.
      </p>
      <Link to="/services" className="btn btn-primary btn-lg gap-2">
        Browse Services
      </Link>
    </div>
  </div>
);
