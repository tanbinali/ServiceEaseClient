import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../contexts/AuthContext";
import authApiClient from "../services/auth-api-client";
import defaultImg from "../assets/default_profile.png";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaSave, FaTimes, FaImage } from "react-icons/fa";

import ProfileField from "../components/Dashboard/ProfileField";
import InputField from "../components/Dashboard/InputField";
import TextAreaField from "../components/Dashboard/TextAreaField";
import ServiceHistory from "../components/Dashboard/ServiceHistory";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuthContext();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const watchedProfilePic = watch("profile_picture");

  useEffect(() => {
    if (watchedProfilePic && watchedProfilePic.length > 0) {
      const file = watchedProfilePic[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else setPreviewUrl(null);
  }, [watchedProfilePic]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
  };
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2, ease: "easeInOut" } },
    tap: { scale: 0.95 },
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await authApiClient.get("/auth/users/me/");
      setUserProfile(res.data);
      reset({
        username: res.data.username || "",
        email: res.data.email || "",
        full_name: res.data.profile?.full_name || "",
        phone_number: res.data.profile?.phone_number || "",
        address: res.data.profile?.address || "",
        bio: res.data.profile?.bio || "",
        date_of_birth: res.data.profile?.date_of_birth || "",
        profile_picture: null,
      });
    } catch (err) {
      console.error("Failed to fetch user:", err.response?.data || err.message);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Only update username/email if they changed
      if (
        data.username !== userProfile.username ||
        data.email !== userProfile.email
      ) {
        await authApiClient.patch("/auth/users/me/", {
          username: data.username,
          email: data.email,
        });
      }

      const formData = new FormData();
      if (data.full_name) formData.append("full_name", data.full_name);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.address) formData.append("address", data.address);
      if (data.bio) formData.append("bio", data.bio);
      if (data.date_of_birth)
        formData.append("date_of_birth", data.date_of_birth);
      if (data.profile_picture?.length > 0)
        formData.append("profile_picture", data.profile_picture[0]);

      // Only patch profile if there is something to send
      if (
        formData.has("full_name") ||
        formData.has("phone_number") ||
        formData.has("address") ||
        formData.has("bio") ||
        formData.has("date_of_birth") ||
        formData.has("profile_picture")
      ) {
        await authApiClient.patch("/api/profile/me/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Profile updated successfully!");
      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.error(
        "Failed to update user/profile:",
        err.response?.data || err.message
      );
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-96">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{
            rotate: { duration: 1, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
        />
      </div>
    );

  if (!userProfile)
    return (
      <div className="text-center py-12">
        <p className="text-error">Profile not found</p>
      </div>
    );

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-3xl shadow-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
        <motion.button
          className={`btn ${editMode ? "btn-error" : "btn-primary"} gap-2`}
          onClick={() => setEditMode(!editMode)}
          aria-label={editMode ? "Cancel Edit Profile" : "Edit Profile"}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {editMode ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaEdit /> Edit Profile
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        className="bg-gray-50 p-8 rounded-2xl shadow-inner border border-gray-200"
        variants={cardVariants}
      >
        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <motion.div
              className="relative"
              variants={imageVariants}
              whileHover="hover"
            >
              <motion.img
                src={
                  previewUrl ||
                  userProfile.profile?.profile_picture ||
                  defaultImg
                }
                alt={userProfile.profile?.full_name || userProfile.username}
                className="w-36 h-36 rounded-3xl object-cover shadow-lg border-4 border-gray-200"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {editMode && (
                <motion.label
                  className="absolute bottom-2 right-2 bg-primary text-primary-content p-3 rounded-full cursor-pointer shadow-lg hover:bg-primary-focus transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaImage className="w-5 h-5" />
                  <input
                    type="file"
                    {...register("profile_picture")}
                    accept="image/*"
                    className="hidden"
                  />
                </motion.label>
              )}
            </motion.div>
            {previewUrl && (
              <motion.p
                className="text-sm text-gray-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                New image preview
              </motion.p>
            )}
          </div>

          {/* Profile Info / Form */}
          <div className="flex-1 w-full max-w-xl">
            <AnimatePresence mode="wait">
              {!editMode ? (
                <motion.div
                  key="view-mode"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {userProfile.profile?.full_name || userProfile.username}
                  </h2>
                  <p className="text-gray-600 mb-6">@{userProfile.username}</p>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <ProfileField
                      label="Username"
                      value={userProfile.username}
                      icon="user"
                    />
                    <ProfileField
                      label="Full Name"
                      value={userProfile.profile?.full_name || "Not set"}
                      icon="user"
                    />
                    <ProfileField
                      label="Phone"
                      value={userProfile.profile?.phone_number || "Not set"}
                      icon="phone"
                    />
                    <ProfileField
                      label="Address"
                      value={userProfile.profile?.address || "Not set"}
                      icon="map"
                    />
                    <ProfileField
                      label="Date of Birth"
                      value={
                        userProfile.profile?.date_of_birth
                          ? new Date(
                              userProfile.profile.date_of_birth
                            ).toLocaleDateString()
                          : "Not set"
                      }
                      icon="calendar"
                    />
                    {userProfile.profile?.bio && (
                      <ProfileField
                        label="Bio"
                        value={userProfile.profile.bio}
                        icon="info"
                      />
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="edit-mode"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <InputField
                      label="Username"
                      {...register("username", {
                        required: "Username is required",
                      })}
                      error={errors.username}
                    />
                    <InputField
                      type="email"
                      label="Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email",
                        },
                      })}
                      error={errors.email}
                    />
                    <InputField label="Full Name" {...register("full_name")} />
                    <InputField
                      label="Phone Number"
                      {...register("phone_number")}
                    />
                    <InputField
                      type="date"
                      label="Date of Birth"
                      {...register("date_of_birth")}
                    />
                    <InputField
                      label="Address"
                      {...register("address")}
                      fullWidth
                    />
                    <TextAreaField label="Bio" {...register("bio")} />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className={`btn btn-primary gap-2 w-full ${
                      saving ? "loading" : ""
                    }`}
                    disabled={saving}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <FaSave /> {saving ? "Saving..." : "Save Changes"}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {userProfile.profile?.service_history?.length > 0 && (
        <ServiceHistory history={userProfile.profile.service_history} />
      )}
    </motion.div>
  );
};

export default Dashboard;
