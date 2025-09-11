import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FaEyeSlash,
} from "react-icons/fa";

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

  // Filter + sort
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "staff") {
        matchesStatus = user.groups.includes("Admin");
      } else if (statusFilter === "client") {
        matchesStatus = user.groups.includes("Client");
      }

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
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
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
    if (groups.includes("Admin")) {
      return (
        <span className="badge badge-success gap-1 py-2 px-3">
          <FaUserShield className="text-xs" /> Admin
        </span>
      );
    }
    if (groups.includes("Client")) {
      return (
        <span className="badge badge-info gap-1 py-2 px-3">
          <FaUserCheck className="text-xs" /> Client
        </span>
      );
    }
    return (
      <span className="badge badge-ghost gap-1 py-2 px-3">
        <FaUserTimes className="text-xs" /> Unassigned
      </span>
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
    } catch (err) {
      console.error(
        "Failed to update user group",
        err.response?.data || err.message
      );
      alert("Failed to update user role. Check console for details.");
    } finally {
      setRoleChangeLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            User Management
          </h1>
          <p className="text-base-content/60 mt-1">
            Manage all system users and their permissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 p-6 rounded-box shadow-sm border border-base-300 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-grow max-w-md">
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

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline">
            <FaFilter className="mr-2" /> Filter:{" "}
            {statusFilter === "all"
              ? "All"
              : statusFilter === "staff"
              ? "Admins"
              : "Clients"}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 border border-base-300"
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
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
          <div className="stat-figure text-primary">
            <FaUserCircle className="text-3xl" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{count}</div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
          <div className="stat-figure text-success">
            <FaUserCheck className="text-3xl" />
          </div>
          <div className="stat-title">Clients</div>
          <div className="stat-value text-success">
            {users.filter((u) => u.groups.includes("Client")).length}
          </div>
        </div>

        <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
          <div className="stat-figure text-error">
            <FaUserShield className="text-3xl" />
          </div>
          <div className="stat-title">Admins</div>
          <div className="stat-value text-error">
            {users.filter((u) => u.groups.includes("Admin")).length}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-base-100 rounded-box border border-base-300">
          <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
          <p className="text-base-content/60">Loading users...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-base-100 rounded-box shadow-sm overflow-hidden border border-base-300">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="bg-base-200">User</th>
                  <th className="bg-base-200">
                    <button
                      className="flex items-center font-semibold"
                      onClick={() => handleSort("email")}
                    >
                      Email <SortIcon field="email" />
                    </button>
                  </th>
                  <th className="bg-base-200">Role</th>
                  <th className="bg-base-200">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8">
                      <FaSpinner className="animate-spin inline-block text-xl text-primary mr-2" />
                      Loading more users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-base-content/60"
                    >
                      {searchTerm || statusFilter !== "all"
                        ? "No users match your search criteria"
                        : "No users found"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <img
                                src={
                                  u.profile?.profile_picture ||
                                  defaultProfileImage
                                }
                                alt={u.username}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{u.username}</div>
                            <div className="text-sm text-base-content/60">
                              {u.first_name} {u.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{getGroupBadge(u.groups)}</td>
                      <td>
                        <select
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
                        </select>
                        {roleChangeLoading === u.id && (
                          <FaSpinner className="animate-spin inline-block ml-2 text-primary" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="text-sm text-base-content/60">
            Showing {filteredUsers.length} of {count} users
          </div>
          <div className="join">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="join-item btn btn-outline"
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`join-item btn ${
                    page === pageNum ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="join-item btn btn-outline"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
