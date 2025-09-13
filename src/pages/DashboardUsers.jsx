import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authApiClient from "../services/auth-api-client";
import defaultProfileImage from "../assets/default_profile.png";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [roleChangeLoading, setRoleChangeLoading] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");

  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };
  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (p) => {
    setLoading(p === 1);
    setTableLoading(p !== 1);
    setError(null);
    try {
      const res = await authApiClient.get(`/auth/users/?page=${p}`);
      setUsers(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      console.error("Error fetching users", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const totalPages = Math.ceil(count / 10);

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesStatus = true;
      if (statusFilter === "staff")
        matchesStatus = user.groups.includes("Admin");
      else if (statusFilter === "client")
        matchesStatus = user.groups.includes("Client");
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === "group") {
        aValue = a.groups.length > 0 ? a.groups[0] : "";
        bValue = b.groups.length > 0 ? b.groups[0] : "";
      }
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <FaSort className="ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  const getGroupBadge = (groups) => {
    if (groups.includes("Admin"))
      return (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="badge badge-success gap-1 py-1 px-2 text-xs flex items-center"
        >
          <FaUserShield className="text-xs mr-1" />
          Admin
        </motion.span>
      );
    if (groups.includes("Client"))
      return (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="badge badge-info gap-1 py-1 px-2 text-xs flex items-center"
        >
          <FaUserCheck className="text-xs mr-1" />
          Client
        </motion.span>
      );
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="badge badge-ghost gap-1 py-1 px-2 text-xs flex items-center"
      >
        <FaUserTimes className="text-xs mr-1" />
        Unassigned
      </motion.span>
    );
  };

  const handleGroupChange = async (userId, newGroup) => {
    setRoleChangeLoading(userId);
    try {
      await authApiClient.patch(`/auth/users/${userId}/`, {
        groups: newGroup ? [newGroup] : [],
      });
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, groups: newGroup ? [newGroup] : [] } : u
        )
      );
      toast.success("User role updated successfully!");
    } catch (err) {
      console.error(
        "Failed to update user group",
        err.response?.data || err.message
      );
      toast.error("Failed to update user role.");
    } finally {
      setRoleChangeLoading(null);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-7xl mx-auto p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div
        variants={slideUp}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            User Management
          </h1>
          <p className="text-base-content/60 mt-1 text-sm sm:text-base">
            Manage all system users and their permissions
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-base-100 p-4 sm:p-6 rounded-box shadow-sm border border-base-300 mb-4 sm:mb-6 flex flex-col md:flex-row gap-4 justify-between items-center w-full"
      >
        <div className="relative flex-grow w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-base-content/40" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="dropdown dropdown-end w-full md:w-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            role="button"
            className="btn btn-outline w-full md:w-auto justify-center"
          >
            <FaFilter className="mr-2" /> Filter:{" "}
            {statusFilter === "all"
              ? "All"
              : statusFilter === "staff"
              ? "Admins"
              : "Clients"}
          </motion.div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full md:w-52 mt-1 border border-base-300"
          >
            <li>
              <a
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "active" : ""}
              >
                All Users
              </a>
            </li>
            <li>
              <a
                onClick={() => setStatusFilter("staff")}
                className={statusFilter === "staff" ? "active" : ""}
              >
                Admins Only
              </a>
            </li>
            <li>
              <a
                onClick={() => setStatusFilter("client")}
                className={statusFilter === "client" ? "active" : ""}
              >
                Clients Only
              </a>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="alert alert-error mb-4 sm:mb-6"
          >
            <span>{error}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6"
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="stat bg-base-100 rounded-box shadow-sm border border-base-300 p-3 sm:p-4"
        >
          <div className="stat-figure text-primary">
            <FaUserCircle className="text-2xl sm:text-3xl" />
          </div>
          <div className="stat-title text-sm sm:text-base">Total Users</div>
          <div className="stat-value text-primary text-lg sm:text-2xl">
            {count}
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="stat bg-base-100 rounded-box shadow-sm border border-base-300 p-3 sm:p-4"
        >
          <div className="stat-figure text-success">
            <FaUserCheck className="text-2xl sm:text-3xl" />
          </div>
          <div className="stat-title text-sm sm:text-base">Clients</div>
          <div className="stat-value text-success text-lg sm:text-2xl">
            {users.filter((u) => u.groups.includes("Client")).length}
          </div>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="stat bg-base-100 rounded-box shadow-sm border border-base-300 p-3 sm:p-4"
        >
          <div className="stat-figure text-error">
            <FaUserShield className="text-2xl sm:text-3xl" />
          </div>
          <div className="stat-title text-sm sm:text-base">Admins</div>
          <div className="stat-value text-error text-lg sm:text-2xl">
            {users.filter((u) => u.groups.includes("Admin")).length}
          </div>
        </motion.div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 sm:py-20 bg-base-100 rounded-box border border-base-300"
        >
          <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-base-content/60 text-sm sm:text-base">
            Loading users...
          </p>
        </motion.div>
      )}

      {/* Table */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-base-100 rounded-box shadow-sm overflow-x-auto border border-base-300"
        >
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-base-200">User</th>
                <th className="bg-base-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center font-semibold"
                    onClick={() => handleSort("email")}
                  >
                    Email <SortIcon field="email" />
                  </motion.button>
                </th>
                <th className="bg-base-200">Role</th>
                <th className="bg-base-200">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {tableLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-sm sm:text-base"
                  >
                    <FaSpinner className="animate-spin inline-block text-xl text-primary mr-2" />{" "}
                    Loading more users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-8 text-base-content/60 text-sm sm:text-base"
                  >
                    {searchTerm || statusFilter !== "all"
                      ? "No users match your search criteria"
                      : "No users found"}
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((u) => (
                    <motion.tr
                      key={u.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover"
                    >
                      <td>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="avatar w-10 h-10 sm:w-12 sm:h-12">
                            <img
                              src={
                                u.profile?.profile_picture ||
                                defaultProfileImage
                              }
                              alt={u.username}
                              className="object-cover rounded-full w-full h-full"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-sm sm:text-base">
                              {u.username}
                            </div>
                            <div className="text-xs sm:text-sm text-base-content/60">
                              {u.first_name} {u.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm sm:text-base">{u.email}</td>
                      <td>{getGroupBadge(u.groups)}</td>
                      <td>
                        <motion.select
                          whileHover={{ scale: 1.02 }}
                          className="select select-bordered select-sm w-full max-w-xs"
                          value={u.groups[0] || ""}
                          onChange={(e) =>
                            handleGroupChange(u.id, e.target.value)
                          }
                          disabled={roleChangeLoading === u.id}
                        >
                          <option value="">Unassigned</option>
                          <option value="Admin">Admin</option>
                          <option value="Client">Client</option>
                        </motion.select>
                        {roleChangeLoading === u.id && (
                          <FaSpinner className="animate-spin inline-block ml-2 text-primary" />
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mt-4 sm:mt-6 w-full"
        >
          <div className="text-sm sm:text-base text-base-content/60 w-full sm:w-auto text-center sm:text-left">
            Showing {filteredUsers.length} of {count} users
          </div>
          <div className="join self-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="join-item btn btn-outline"
            >
              <FaChevronLeft />
            </motion.button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(pageNum)}
                  className={`join-item btn ${
                    page === pageNum ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {pageNum}
                </motion.button>
              );
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="join-item btn btn-outline"
            >
              <FaChevronRight />
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
