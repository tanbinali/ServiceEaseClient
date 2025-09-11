import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle, ArrowRight } from "lucide-react";

const PaymentCancelled = () => {
  const [countdown, setCountdown] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/dashboard/orders");
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="max-w-md w-full bg-base-200 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-error" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-error/40 animate-ping" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-error mb-2">
          Payment Cancelled
        </h1>

        <p className="text-base-content/70 mb-6">
          Your payment was cancelled successfully.
        </p>

        <div className="bg-error/10 rounded-lg p-3 mb-6">
          <p className="text-error">
            Redirecting to your dashboard in{" "}
            <span className="font-bold">{countdown}</span> seconds
          </p>
        </div>

        <Link
          to="/dashboard/orders"
          className="inline-flex items-center justify-center gap-2 bg-error text-error-content hover:bg-error-focus font-medium rounded-lg px-6 py-3 transition-colors duration-200 w-full"
        >
          Go to Dashboard <ArrowRight />
        </Link>

        <p className="text-base-content/70 mt-6">
          Need help?{" "}
          <a href="/contact" className="text-error underline">
            Contact support
          </a>
        </p>

        <style>{`
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          .animate-ping {
            animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PaymentCancelled;
