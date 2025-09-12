import React, { useEffect, useState } from "react";
import ApiClient from "../services/api-client";
import AuthApiClient from "../services/auth-api-client";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaFolderOpen,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaCheck,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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

const DashboardCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Filter state
  const [filterTerm, setFilterTerm] = useState("");
  const [filterActive, setFilterActive] = useState(null); // null means no filter applied

  // Fetch categories with status skeleton loader
  const fetchCategories = async (url = "categories/") => {
    setLoading(true);
    try {
      const res = await ApiClient.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCategories(data);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtered categories according to filter input and active state
  const filteredCategories = categories.filter((cat) => {
    const matchesTerm =
      cat.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(filterTerm.toLowerCase());

    // If active filter is null, show all
    if (filterActive === null) return matchesTerm;

    // Here category has no active state, so just simulate:
    // We'll treat categories with description as "active" just for demonstration
    const isActive = cat.description && cat.description.length > 0;
    return matchesTerm && isActive === filterActive;
  });

  // Add new category with button loading state
  const [adding, setAdding] = useState(false);
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAdding(true);
    try {
      await AuthApiClient.post("api/categories/", {
        name: newCategoryName,
        description: newCategoryDescription,
      });
      setNewCategoryName("");
      setNewCategoryDescription("");
      fetchCategories();
      toast.success("Category added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
    setAdding(false);
  };

  // Update category with button loading state
  const [updating, setUpdating] = useState(false);
  const handleUpdateCategory = async (id) => {
    if (!editCategoryName.trim() && !editCategoryDescription.trim()) return;
    setUpdating(true);
    try {
      const patchData = {};
      if (editCategoryName.trim()) patchData.name = editCategoryName;
      if (editCategoryDescription.trim())
        patchData.description = editCategoryDescription;

      await AuthApiClient.patch(`api/categories/${id}/`, patchData);

      setEditCategoryId(null);
      setEditCategoryName("");
      setEditCategoryDescription("");
      fetchCategories();
      toast.success("Category updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    }
    setUpdating(false);
  };

  // Delete category with button loading state
  const [deletingId, setDeletingId] = useState(null);
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    setDeletingId(id);
    try {
      await AuthApiClient.delete(`api/categories/${id}/`);
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
    setDeletingId(null);
  };

  // Skeleton loader for cards
  const CategorySkeleton = () => (
    <motion.div
      className="flex flex-col md:flex-row items-start md:items-center justify-between animate-pulse p-3 rounded-xl border border-base-300 bg-base-100 gap-2"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-base-200 rounded w-24"></div>
        <div className="h-3 bg-base-200 rounded w-36"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-base-200 rounded"></div>
        <div className="w-8 h-8 bg-base-200 rounded"></div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-7">
      <motion.h1
        className="text-3xl font-bold mb-2 flex gap-2 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaFolderOpen className="text-primary" /> Manage Categories
      </motion.h1>

      {/* Filter Section */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 items-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="input input-bordered w-full pl-10"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            className={`btn btn-outline flex items-center gap-2 ${
              filterActive === null ? "btn-active" : ""
            }`}
            onClick={() => setFilterActive(null)}
            aria-pressed={filterActive === null}
          >
            <FaFilter /> All
          </button>
          <button
            className={`btn btn-outline btn-success flex items-center gap-2 ${
              filterActive === true ? "btn-active" : ""
            }`}
            onClick={() => setFilterActive(true)}
            aria-pressed={filterActive === true}
          >
            <FaCheck /> With Description
          </button>
          <button
            className={`btn btn-outline btn-error flex items-center gap-2 ${
              filterActive === false ? "btn-active" : ""
            }`}
            onClick={() => setFilterActive(false)}
            aria-pressed={filterActive === false}
          >
            <FaExclamationTriangle /> No Description
          </button>
        </div>
      </motion.div>

      {/* Add New Category */}
      <motion.div
        className="flex flex-col md:flex-row gap-2 mb-6 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <input
          type="text"
          placeholder="Category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="input input-bordered flex-1"
        />
        <input
          type="text"
          placeholder="Category description"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          className="input input-bordered flex-1"
        />
        <motion.button
          onClick={handleAddCategory}
          disabled={adding || !newCategoryName.trim()}
          className="btn btn-primary gap-2 flex items-center"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
        >
          {adding ? <FaSpinner className="animate-spin" /> : <FaPlus />} Add
        </motion.button>
      </motion.div>

      {/* Categories List */}
      <div className="space-y-2">
        {loading && [...Array(3)].map((_, i) => <CategorySkeleton key={i} />)}

        {!loading && filteredCategories.length === 0 && (
          <motion.div
            className="flex flex-col items-center py-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaFolderOpen className="text-base-200 text-5xl mb-2" />
            <p className="text-gray-500 text-lg">No categories found.</p>
          </motion.div>
        )}

        {!loading &&
          filteredCategories.map((cat) => (
            <motion.div
              key={cat.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-xl border border-base-300 bg-base-100 gap-2"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {editCategoryId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <input
                    type="text"
                    value={editCategoryDescription}
                    onChange={(e) => setEditCategoryDescription(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      className="btn btn-success gap-2"
                      onClick={() => handleUpdateCategory(cat.id)}
                      disabled={updating}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {updating ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaSave />
                      )}{" "}
                      Save
                    </motion.button>
                    <motion.button
                      className="btn btn-error gap-2"
                      onClick={() => setEditCategoryId(null)}
                      disabled={updating}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <FaTimes /> Cancel
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium flex gap-2 items-center">
                      <FaFolderOpen className="text-base-300" /> {cat.name}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {cat.description || (
                        <span className="text-gray-400">No description</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      className="btn btn-sm btn-ghost gap-2"
                      onClick={() => {
                        setEditCategoryId(cat.id);
                        setEditCategoryName(cat.name);
                        setEditCategoryDescription(cat.description);
                      }}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                    >
                      <FaEdit /> Edit
                    </motion.button>
                    <motion.button
                      className={`btn btn-sm btn-error gap-2 ${
                        deletingId === cat.id ? "opacity-60" : ""
                      }`}
                      onClick={() => handleDeleteCategory(cat.id)}
                      disabled={deletingId === cat.id}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="button"
                    >
                      {deletingId === cat.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}{" "}
                      Delete
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
      </div>

      {/* Pagination */}
      <motion.div
        className="flex justify-center gap-4 mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => prevPage && fetchCategories(prevPage)}
          disabled={!prevPage}
          className="btn btn-outline gap-2"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
        >
          <FaChevronLeft /> Previous
        </motion.button>
        <motion.button
          onClick={() => nextPage && fetchCategories(nextPage)}
          disabled={!nextPage}
          className="btn btn-outline gap-2"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          type="button"
        >
          Next <FaChevronRight />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DashboardCategories;
