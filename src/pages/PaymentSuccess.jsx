import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(7);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect when countdown reaches 0
      navigate("/dashboard/orders");
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="max-w-md w-full bg-base-200 rounded-xl shadow-lg p-8 text-center">
        {/* Animated checkmark */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-primary animate-scaleIn" />
            </div>

            {/* Pulsing circle animation */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pingSlow" />
          </div>
        </div>

        {/* Success message */}
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Payment Successful!
        </h1>

        <p className="text-base-content/70 mb-6">
          Thank you for your purchase. Your order has been confirmed and is
          being processed.
        </p>

        {/* Countdown timer */}
        <div className="bg-secondary/10 rounded-lg p-3 mb-6">
          <p className="text-sm text-secondary-foreground">
            Redirecting to your dashboard in{" "}
            <span className="font-bold">{countdown}</span> seconds
          </p>
        </div>

        {/* Dashboard link */}
        <Link
          to="/dashboard/orders"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-content hover:bg-primary-focus font-medium rounded-lg px-6 py-3 transition-colors duration-200 w-full"
        >
          <ShoppingBag className="w-5 h-5" />
          View Your Orders
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Additional help */}
        <p className="text-sm text-base-content/70 mt-6">
          Need help?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          75% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
  
        @keyframes pingSlow {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
  
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
  
        .animate-pingSlow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
