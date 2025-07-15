import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const OwnerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    phoneNumber: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/profile", {
          headers: { Authorization: token },
        });
        const u = res.data.user;
        setUser(u);
        setFormData({
          FirstName: u.FirstName || "",
          LastName: u.LastName || "",
          Email: u.Email || "",
          phoneNumber: u.phoneNumber || "",
          password: "",
        });
      } catch {
        toast.error("Failed to fetch profile");
      }
    };
    fetchUser();
  }, [token, navigate]);

  // Handle form input changes
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:8000/api/update/profile",
        formData,
        { headers: { Authorization: token } }
      );
      toast.success(res.data.msg);
      dispatch(updateUser({ ...formData }));
      setIsEditing(false);
    } catch (err) {
      const errMsg = err.response?.data?.error || "";
      toast.error(
        errMsg.includes("Email")
          ? "Email already in use"
          : errMsg.includes("Phone")
          ? "Phone number already in use"
          : "Profile update failed"
      );
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;
    const form = new FormData();
    form.append("image", image);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/profile/image",
        form,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.msg);
      setUser((prev) => ({ ...prev, profileImage: res.data.profileImage }));
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleCancel = () => {
    setFormData({
      FirstName: user.FirstName || "",
      LastName: user.LastName || "",
      Email: user.Email || "",
      phoneNumber: user.phoneNumber || "",
      password: "",
    });
    setIsEditing(false);
  };

  const defaultImage = "https://via.placeholder.com/150?text=No+Image";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-blue-900">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl font-bold mb-2 text-blue-400">My Profile</h1>
        <p className="text-gray-300 mb-8">Manage your account details</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="lg:w-1/3 bg-black/40 backdrop-blur-lg rounded-2xl border border-blue-900/50 p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={user.profileImage ? `http://localhost:8000/${user.profileImage}` : defaultImage}
                alt="Profile"
                className="rounded-full object-cover w-full h-full border-4 border-blue-900/50"
                onError={(e) => (e.target.src = defaultImage)}
              />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              {formData.FirstName} {formData.LastName}
            </h3>

            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="mb-3 w-full text-sm file:bg-blue-600 file:text-white file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-700"
            />
            <button
              onClick={handleImageUpload}
              disabled={!image}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 py-2 rounded-md transition"
            >
              Upload Image
            </button>
          </div>

          {/* Form Card */}
          <div className="lg:w-2/3 bg-black/40 backdrop-blur-lg rounded-2xl border border-blue-900/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-400">Account Settings</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-lg hover:shadow-xl"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {["FirstName", "LastName", "Email", "phoneNumber"].map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-sm text-gray-300 mb-1">
                      {field === "phoneNumber" ? "Phone Number" : field.replace("Name", " Name")}
                    </label>
                    <input
                      type={field === "Email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-3 rounded-md ${
                        isEditing ? "bg-black/60 border-blue-800 text-white" : "bg-black/20 border-blue-900/30 text-gray-400 cursor-not-allowed"
                      } border`}
                    />
                  </div>
                ))}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full p-3 rounded-md bg-black/60 border border-blue-800 text-white"
                  />
                </div>
              )}

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-md transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-700 hover:bg-gray-800 py-3 rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default OwnerProfile;
