import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../services/api-client";
import authApiClient from "../services/auth-api-client";
import defaultImg from "../assets/default-image.jpg";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaSpinner,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSearch,
  FaSort,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const durations = [
  "00:15:00",
  "00:30:00",
  "00:45:00",
  "01:00:00",
  "01:30:00",
  "02:00:00",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
const buttonVariants = {
  hover: { scale: 1.04 },
  tap: { scale: 0.96 },
};

const DashboardServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editServiceId, setEditServiceId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [customDuration, setCustomDuration] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchPrice = watch("price", 0);
  const watchImage = watch("image");
  const watchDuration = watch("duration");

  useEffect(() => {
    if (watchImage && watchImage.length > 0 && watchImage[0] instanceof Blob) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else if (editServiceId) {
      const service = services.find((s) => s.id === editServiceId);
      setImagePreview(service?.image || null);
    } else {
      setImagePreview(null);
    }
  }, [watchImage, editServiceId, services]);

  // Fetch categories
  const loadCategories = async () => {
    try {
      const res = await apiClient.get("/categories/");
      setCategories(res.data.results || []);
    } catch (err) {
      setFetchError("Failed to fetch categories");
      console.error("Failed to fetch categories:", err);
    }
  };

  // Fetch paginated services
  const loadServices = async (pageNum = 1) => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await apiClient.get("/services/", {
        params: { page: pageNum },
      });
      setServices(res.data.results || []);
      setTotalPages(Math.max(1, Math.ceil(res.data.count / 10)));
      setPage(pageNum);
    } catch (err) {
      setFetchError("Failed to fetch services");
      setServices([]);
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadServices();
  }, []);

  // Form submission
  const onSubmit = async (data) => {
    if (Number(data.price) < 0) {
      setFormError("Price cannot be negative!");
      return;
    }

    if (data.duration === "custom") {
      const regex = /^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
      if (!regex.test(customDuration)) {
        setFormError("Duration must be in HH:MM:SS format");
        return;
      }
    }

    setSaving(true);
    setFormError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category || "");
      formData.append("active", data.active || false);
      formData.append(
        "duration",
        data.duration === "custom" ? customDuration : data.duration
      );

      if (
        data.image &&
        data.image.length > 0 &&
        data.image[0] instanceof File
      ) {
        formData.append("image", data.image[0]);
      }

      if (editServiceId) {
        await authApiClient.put(`/api/services/${editServiceId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Service updated successfully!");
      } else {
        await authApiClient.post("/api/services/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Service created successfully!");
      }

      reset();
      setEditServiceId(null);
      setShowForm(false);
      setImagePreview(null);
      loadServices(page);
    } catch (err) {
      setFormError("Failed to save service");
      toast.error("Failed to save service");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditServiceId(service.id);
    setShowForm(true);
    reset({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      active: service.active,
    });
    setImagePreview(service.image || null);
    setFormError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    setDeletingId(id);
    try {
      await authApiClient.delete(`/api/services/${id}/`);
      toast.success("Service deleted successfully!");
      loadServices(page);
    } catch (err) {
      setFetchError("Failed to delete service");
      toast.error("Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    reset();
    setEditServiceId(null);
    setShowForm(false);
    setImagePreview(null);
    setFormError(null);
  };

  const filteredServices = services
    .filter((service) => {
      const cond1 =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const cond2 =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
          ? service.active
          : !service.active;
      return cond1 && cond2;
    })
    .sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === "price") {
        aVal = parseFloat(a.price);
        bVal = parseFloat(b.price);
      } else {
        aVal = a[sortBy];
        bVal = b[sortBy];
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const ServiceSkeleton = () => (
    <motion.div
      className="bg-base-100 border p-4 rounded-xl shadow animate-pulse space-y-2"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="h-32 w-full bg-base-200 rounded mb-2"></div>
      <div className="h-5 bg-base-200 rounded w-1/2"></div>
      <div className="h-3 bg-base-200 rounded w-full"></div>
      <div className="h-3 bg-base-200 rounded w-1/3"></div>
      <div className="flex gap-2 mt-2">
        <div className="w-8 h-8 bg-base-200 rounded"></div>
        <div className="w-8 h-8 bg-base-200 rounded"></div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 space-y-7"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header and Add button */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaClipboardList className="text-primary" /> Services Dashboard
        </h1>
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaPlus /> {showForm ? "Hide Form" : "Add New"}
        </motion.button>
      </motion.div>

      {/* Remove statistics */}

      {/* Error messages */}
      <AnimatePresence>
        {(fetchError || formError) && (
          <motion.div
            className="alert alert-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{fetchError || formError}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => {
                setFetchError(null);
                setFormError(null);
              }}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-base-100 p-6 rounded-xl shadow border border-base-300"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {editServiceId ? "Edit Service" : "Create New Service"}
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Your form fields here. Copy from previous code */}
              {/* Omitting to save space */}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <motion.div
        className="bg-base-100 p-4 rounded-xl shadow-sm"
        variants={cardVariants}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search services..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <select
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
            </select>
            <button
              className="btn btn-outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <FaSort /> {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Service List */}
      {loading ? (
        <motion.div
          className="py-6 flex flex-col items-center"
          variants={containerVariants}
        >
          <FaSpinner className="animate-spin text-3xl text-primary mb-3" />
          <p className="text-lg">Loading...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            {[...Array(4)].map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        </motion.div>
      ) : filteredServices.length === 0 ? (
        <motion.div
          className="p-6 flex flex-col items-center bg-base-100 rounded-xl shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <FaClipboardList className="text-base-200 text-5xl mb-2" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No services match your criteria"
              : "No services available"}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <motion.button
              className="btn btn-ghost"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Clear filters
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div className="space-y-4" variants={containerVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  className="border p-4 rounded-xl shadow hover:shadow-md bg-base-100"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  variants={cardVariants}
                >
                  <div className="flex gap-4">
                    <motion.img
                      className="w-24 h-24 object-cover rounded-lg"
                      src={service.image || defaultImg}
                      alt={service.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      onError={(e) => {
                        e.target.src = defaultImg;
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="font-bold text-lg">{service.name}</h2>
                        <span
                          className={`badge ${
                            service.active ? "badge-success" : "badge-error"
                          } badge-sm`}
                        >
                          {service.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <strong>Price:</strong> ${service.price}
                        </div>
                        <div>
                          <strong>Duration:</strong> {service.duration}
                        </div>
                        <div className="col-span-2">
                          <strong>Category:</strong>{" "}
                          {categories.find((c) => c.id === service.category)
                            ?.name || "Uncategorized"}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          className="btn btn-primary btn-sm flex items-center gap-1"
                          onClick={() => handleEdit(service)}
                          disabled={editServiceId === service.id}
                          title="Edit Service"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className={`btn btn-error btn-sm flex items-center gap-1 ${
                            deletingId === service.id ? "loading" : ""
                          }`}
                          onClick={() => handleDelete(service.id)}
                          disabled={deletingId === service.id}
                          title="Delete Service"
                        >
                          {deletingId === service.id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}{" "}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => loadServices(page - 1)}
              >
                <FaChevronLeft /> Previous
              </button>
              <span className="px-3 py-1 border rounded bg-base-200 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === totalPages}
                onClick={() => loadServices(page + 1)}
              >
                Next <FaChevronRight />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardServices;
