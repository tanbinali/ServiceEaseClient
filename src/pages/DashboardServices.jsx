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
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

const durations = [
  "00:15:00",
  "00:30:00",
  "00:45:00",
  "01:00:00",
  "01:30:00",
  "02:00:00",
];

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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchPrice = watch("price", 0);
  const watchImage = watch("image");

  // Watch for image preview
  useEffect(() => {
    if (watchImage && watchImage.length > 0 && watchImage[0] instanceof Blob) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
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

  // Fetch services with pagination
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
    setSaving(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("duration", data.duration);
      formData.append("category", data.category || "");
      formData.append("active", data.active || false);

      // ✅ Only append image if a new file is selected
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
        alert("Service updated successfully!");
      } else {
        await authApiClient.post("/api/services/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Service created successfully!");
      }

      reset();
      setEditServiceId(null);
      setImagePreview(null);
      setShowForm(false);
      loadServices(page);
    } catch (err) {
      setFormError(
        "Failed to save service: " + (err.response?.data?.detail || err.message)
      );
      console.error("Failed to save service:", err);
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
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeletingId(id);
    try {
      await authApiClient.delete(`/api/services/${id}/`);
      alert("Service deleted successfully!");
      loadServices(page);
    } catch (err) {
      setFetchError(
        "Failed to delete service: " +
          (err.response?.data?.detail || err.message)
      );
      console.error("Failed to delete service:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    reset();
    setEditServiceId(null);
    setImagePreview(null);
    setFormError(null);
    setShowForm(false);
  };

  // Filter and sort services
  const filteredServices = services
    .filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "active") {
        matchesStatus = service.active;
      } else if (statusFilter === "inactive") {
        matchesStatus = !service.active;
      }

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortBy === "price") {
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
      } else if (sortBy === "duration") {
        aValue = a.duration;
        bValue = b.duration;
      } else {
        aValue = a[sortBy];
        bValue = b[sortBy];
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const ServiceSkeleton = () => (
    <div className="bg-base-100 border p-4 rounded-xl shadow animate-pulse space-y-2">
      <div className="h-32 w-full bg-base-200 rounded mb-2"></div>
      <div className="h-5 bg-base-200 rounded w-1/2"></div>
      <div className="h-3 bg-base-200 rounded w-full"></div>
      <div className="h-3 bg-base-200 rounded w-1/3"></div>
      <div className="flex gap-2 mt-2">
        <div className="w-8 h-8 bg-base-200 rounded"></div>
        <div className="w-8 h-8 bg-base-200 rounded"></div>
      </div>
    </div>
  );

  // Calculate statistics
  const activeServices = services.filter((s) => s.active).length;
  const totalRevenue = services.reduce(
    (sum, service) => sum + parseFloat(service.price || 0),
    0
  );
  const avgPrice = services.length > 0 ? totalRevenue / services.length : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaClipboardList className="text-primary" /> Services Dashboard
        </h1>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus /> {showForm ? "Hide Form" : "Add New Service"}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <FaClipboardList className="text-3xl" />
          </div>
          <div className="stat-title">Total Services</div>
          <div className="stat-value text-primary">{services.length}</div>
          <div className="stat-desc">All services in the system</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-success">
            <FaChartLine className="text-3xl" />
          </div>
          <div className="stat-title">Active Services</div>
          <div className="stat-value text-success">{activeServices}</div>
          <div className="stat-desc">Available for booking</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-secondary">
            <FaMoneyBillWave className="text-3xl" />
          </div>
          <div className="stat-title">Average Price</div>
          <div className="stat-value text-secondary">
            ${avgPrice.toFixed(2)}
          </div>
          <div className="stat-desc">Across all services</div>
        </div>
      </div>

      {(fetchError || formError) && (
        <div className="alert alert-error">
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
        </div>
      )}

      {/* Service Form */}
      {showForm && (
        <div className="bg-base-100 p-6 rounded-xl shadow border border-base-300">
          <h2 className="text-xl font-semibold mb-4">
            {editServiceId ? "Edit Service" : "Create New Service"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="label">Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                placeholder="Service Name"
              />
              {errors.name && (
                <span className="text-error text-xs">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label className="label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min={0}
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price cannot be negative" },
                })}
                className={`input input-bordered w-full ${
                  watchPrice < 0 ? "input-error" : ""
                }`}
                placeholder="Price"
              />
              {errors.price && (
                <span className="text-error text-xs">
                  {errors.price.message}
                </span>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className={`textarea textarea-bordered w-full ${
                  errors.description ? "textarea-error" : ""
                }`}
                placeholder="Service Description"
                rows={3}
              />
              {errors.description && (
                <span className="text-error text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div>
              <label className="label">Duration</label>
              <select
                {...register("duration", { required: "Duration is required" })}
                className={`select select-bordered w-full ${
                  errors.duration ? "select-error" : ""
                }`}
              >
                <option value="">Select duration</option>
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.duration && (
                <span className="text-error text-xs">
                  {errors.duration.message}
                </span>
              )}
            </div>
            <div>
              <label className="label">Category</label>
              <select
                {...register("category")}
                className="select select-bordered w-full"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Service Image</label>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="file-input file-input-bordered w-full"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex items-center gap-4 mt-2">
              <label className="cursor-pointer label flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("active")}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Active Service</span>
              </label>
              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={saving}
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {editServiceId ? "Update Service" : "Create Service"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-base-100 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
      </div>

      {/* Services List */}
      {loading ? (
        <div className="py-6 flex flex-col items-center">
          <FaSpinner className="animate-spin text-3xl text-primary mb-3" />
          <p className="text-lg">Loading services...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            {[...Array(4)].map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="p-6 flex flex-col items-center bg-base-100 rounded-xl shadow">
          <FaClipboardList className="text-base-200 text-5xl mb-2" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || statusFilter !== "all"
              ? "No services match your search criteria"
              : "No services available"}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="border p-4 rounded-xl shadow bg-base-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={service.image || defaultImg}
                    alt={service.name}
                    className="w-24 h-24 object-cover rounded-lg"
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
                    <p className="text-base-content/70 text-sm mt-1 line-clamp-2">
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
                        className="btn btn-primary btn-sm gap-1"
                        onClick={() => handleEdit(service)}
                        disabled={editServiceId === service.id}
                        title="Edit Service"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className={`btn btn-error btn-sm gap-1 ${
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
              </div>
            ))}
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
        </div>
      )}
    </div>
  );
};

export default DashboardServices;
