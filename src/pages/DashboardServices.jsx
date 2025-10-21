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
  FaTimes,
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
      className="bg-base-100 border border-base-300 p-4 rounded-xl shadow-sm animate-pulse space-y-3"
      variants={cardVariants}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-base-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-base-200 rounded w-3/4"></div>
          <div className="h-4 bg-base-200 rounded w-full"></div>
          <div className="h-4 bg-base-200 rounded w-2/3"></div>
          <div className="flex gap-2 mt-2">
            <div className="w-16 h-8 bg-base-200 rounded"></div>
            <div className="w-16 h-8 bg-base-200 rounded"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="w-full space-y-6 p-4 sm:p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center gap-2">
            <FaClipboardList className="text-primary" />
            Services Management
          </h1>
          <p className="text-base-content/60 mt-1 text-sm">
            Manage your services and offerings
          </p>
        </div>
        <motion.button
          className="btn btn-primary gap-2 w-full sm:w-auto"
          onClick={() => setShowForm(!showForm)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaPlus className="text-sm" />
          {showForm ? "Hide Form" : "Add Service"}
        </motion.button>
      </motion.div>

      {/* Error Messages */}
      <AnimatePresence>
        {(fetchError || formError) && (
          <motion.div
            className="alert alert-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2">
              <FaTimes />
              <span>{fetchError || formError}</span>
            </div>
            <button
              className="btn btn-ghost btn-sm"
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

      {/* Service Form - FIXED: Now includes all form fields */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-base-100 border border-base-300 rounded-xl shadow-sm p-4 sm:p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-base-content">
                {editServiceId ? "Edit Service" : "Create New Service"}
              </h2>
              <button
                onClick={handleCancel}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Service Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Service Name
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter service name"
                      className="input input-bordered w-full"
                      {...register("name", {
                        required: "Service name is required",
                      })}
                    />
                    {errors.name && (
                      <span className="text-error text-sm mt-1">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Description
                      </span>
                    </label>
                    <textarea
                      placeholder="Describe your service..."
                      className="textarea textarea-bordered w-full h-24"
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                    {errors.description && (
                      <span className="text-error text-sm mt-1">
                        {errors.description.message}
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Category</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      {...register("category")}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Price */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Price ($)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="input input-bordered w-full"
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price cannot be negative" },
                      })}
                    />
                    {errors.price && (
                      <span className="text-error text-sm mt-1">
                        {errors.price.message}
                      </span>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Duration</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      {...register("duration", {
                        required: "Duration is required",
                      })}
                    >
                      <option value="">Select Duration</option>
                      {durations.map((dur) => (
                        <option key={dur} value={dur}>
                          {dur}
                        </option>
                      ))}
                      <option value="custom">Custom Duration</option>
                    </select>
                    {watchDuration === "custom" && (
                      <input
                        type="text"
                        placeholder="HH:MM:SS"
                        className="input input-bordered w-full mt-2"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                      />
                    )}
                    {errors.duration && (
                      <span className="text-error text-sm mt-1">
                        {errors.duration.message}
                      </span>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Service Image
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered w-full"
                      {...register("image")}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Active Status */}
                  <div className="form-control">
                    <label className="cursor-pointer label justify-start gap-3">
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        {...register("active")}
                      />
                      <span className="label-text font-medium">
                        Active Service
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-base-300">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline flex-1"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 gap-2"
                  disabled={saving}
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving
                    ? "Saving..."
                    : editServiceId
                    ? "Update Service"
                    : "Create Service"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <motion.div
        className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm"
        variants={cardVariants}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-lg">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search services by name or description..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            <select
              className="select select-bordered w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <select
              className="select select-bordered w-full sm:w-auto"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
            </select>
            <button
              className="btn btn-outline w-full sm:w-auto gap-2"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <FaSort />
              {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Services List */}
      {loading ? (
        <motion.div className="space-y-4" variants={containerVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        </motion.div>
      ) : filteredServices.length === 0 ? (
        <motion.div
          className="text-center py-12 bg-base-100 rounded-xl border border-base-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaClipboardList className="text-base-300 text-4xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-base-content mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No services found"
              : "No services available"}
          </h3>
          <p className="text-base-content/60 mb-4 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search criteria or filters"
              : "Get started by creating your first service"}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div className="space-y-4" variants={containerVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                className="bg-base-100 border border-base-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                variants={cardVariants}
                layout
              >
                <div className="flex gap-4">
                  <img
                    src={service.image || defaultImg}
                    alt={service.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src = defaultImg;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-base-content truncate">
                        {service.name}
                      </h3>
                      <span
                        className={`badge badge-sm ${
                          service.active ? "badge-success" : "badge-error"
                        } flex-shrink-0 ml-2`}
                      >
                        {service.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-base-content/70 text-sm line-clamp-2 mb-3">
                      {service.description}
                    </p>
                    <div className="space-y-1 text-sm text-base-content/60">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold text-base-content">
                          ${service.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="truncate ml-2">
                          {categories.find((c) => c.id === service.category)
                            ?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="btn btn-primary btn-sm flex-1 gap-1"
                        onClick={() => handleEdit(service)}
                        disabled={editServiceId === service.id}
                      >
                        <FaEdit className="text-xs" /> Edit
                      </button>
                      <button
                        className={`btn btn-error btn-sm flex-1 gap-1 ${
                          deletingId === service.id ? "loading" : ""
                        }`}
                        onClick={() => handleDelete(service.id)}
                        disabled={deletingId === service.id}
                      >
                        {deletingId !== service.id && (
                          <FaTrash className="text-xs" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="btn btn-outline btn-sm gap-1"
                disabled={page === 1}
                onClick={() => loadServices(page - 1)}
              >
                <FaChevronLeft /> Prev
              </button>
              <span className="px-3 py-1 text-sm text-base-content/70">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm gap-1"
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
