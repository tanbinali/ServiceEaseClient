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
  FaCheck,
} from "react-icons/fa";

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
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
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
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
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
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
    setDeletingId(null);
  };

  // Skeleton loader for cards
  const CategorySkeleton = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between animate-pulse p-3 rounded-xl border border-base-300 bg-base-100 gap-2">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-base-200 rounded w-24"></div>
        <div className="h-3 bg-base-200 rounded w-36"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-base-200 rounded"></div>
        <div className="w-8 h-8 bg-base-200 rounded"></div>
      </div>
    </div>
  );

  // Visual state displays for loading, error, and empty
  if (loading)
    return (
      <div className="flex flex-col items-center py-12">
        <FaSpinner className="animate-spin text-4xl text-primary mb-2" />
        <p className="text-center text-lg">Loading categories...</p>
        {/* Skeletons for content */}
        {[...Array(3)].map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="flex flex-col items-center py-10">
        <FaExclamationTriangle className="text-error text-3xl mb-2" />
        <p className="text-center text-error">{error}</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-7">
      <h1 className="text-3xl font-bold mb-2 flex gap-2 items-center">
        <FaFolderOpen className="text-primary" /> Manage Categories
      </h1>

      {/* Add New Category */}
      <div className="flex flex-col md:flex-row gap-2 mb-6 items-center">
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
        <button
          onClick={handleAddCategory}
          disabled={adding || !newCategoryName.trim()}
          className="btn btn-primary gap-2 flex items-center"
        >
          {adding ? <FaSpinner className="animate-spin" /> : <FaPlus />} Add
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        {categories.length === 0 && (
          <div className="flex flex-col items-center py-10">
            <FaFolderOpen className="text-base-200 text-5xl mb-2" />
            <p className="text-gray-500 text-lg">No categories found.</p>
          </div>
        )}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-xl border border-base-300 bg-base-100 gap-2"
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
                  <button
                    className="btn btn-success gap-2"
                    onClick={() => handleUpdateCategory(cat.id)}
                    disabled={updating}
                  >
                    {updating ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaSave />
                    )}{" "}
                    Save
                  </button>
                  <button
                    className="btn btn-error gap-2"
                    onClick={() => setEditCategoryId(null)}
                    disabled={updating}
                  >
                    <FaTimes /> Cancel
                  </button>
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
                  <button
                    className="btn btn-sm btn-ghost gap-2"
                    onClick={() => {
                      setEditCategoryId(cat.id);
                      setEditCategoryName(cat.name);
                      setEditCategoryDescription(cat.description);
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className={`btn btn-sm btn-error gap-2 ${
                      deletingId === cat.id ? "opacity-60" : ""
                    }`}
                    onClick={() => handleDeleteCategory(cat.id)}
                    disabled={deletingId === cat.id}
                  >
                    {deletingId === cat.id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}{" "}
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={() => prevPage && fetchCategories(prevPage)}
          disabled={!prevPage}
          className="btn btn-outline gap-2"
        >
          <FaChevronLeft /> Previous
        </button>
        <button
          onClick={() => nextPage && fetchCategories(nextPage)}
          disabled={!nextPage}
          className="btn btn-outline gap-2"
        >
          Next <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default DashboardCategories;
