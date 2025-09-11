import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Services from "../pages/Services";
import CategoryServices from "../pages/CategoryServices";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ActivationPage from "../pages/ActivationPage";
import ResendActivation from "../pages/ResendActivation";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "../pages/Dashboard";
import Cart from "../pages/Cart";
import ServiceDetail from "../pages/ServiceDetail";
import AboutUs from "../pages/AboutUs";
import TermsOfService from "../pages/TermsOfService";
import ContactUs from "../pages/ContactUs";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import DashboardCategories from "../pages/DashboardCategories";
import DashboardServices from "../pages/DashboardServices";
import DashboardUsers from "../pages/DashboardUsers";
import DashboardReviews from "../pages/DashboardReviews";
import AdminCarts from "../pages/AdminCarts";
import DashboardOrders from "../pages/DashboardOrders";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import PaymentCancelled from "../pages/PaymentCancelled";
import FAQ from "../pages/FAQ";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/category/:id" element={<CategoryServices />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate/:uid/:token" element={<ActivationPage />} />
        <Route path="/resend-activation" element={<ResendActivation />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/password/reset/confirm/:uid/:token"
          element={<ResetPasswordConfirm />}
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/TOS" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
      </Route>

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/cart" element={<Cart />} />
        <Route path="/dashboard/admin-carts" element={<AdminCarts />} />
        <Route path="/dashboard/categories" element={<DashboardCategories />} />
        <Route path="/dashboard/services" element={<DashboardServices />} />
        <Route path="/dashboard/users" element={<DashboardUsers />} />
        <Route path="/dashboard/reviews" element={<DashboardReviews />} />
        <Route path="/dashboard/orders" element={<DashboardOrders />} />
        <Route path="/dashboard/payment/success" element={<PaymentSuccess />} />
        <Route path="/dashboard/payment/fail" element={<PaymentFailed />} />
        <Route
          path="/dashboard/payment/cancel"
          element={<PaymentCancelled />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
