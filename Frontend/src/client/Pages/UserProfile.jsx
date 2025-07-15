
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../features/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const UserProfile = () => {
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user profile");
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
      setIsEditing(false); // Exit edit mode after successful update
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error;
      toast.error(
        errorMsg?.includes("Email") ? "Email is already in use." :
        errorMsg?.includes("Phone") ? "Phone number is already in use." :
        "Failed to update profile. Please try again."
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      FirstName: user.FirstName || "",
      LastName: user.LastName || "",
      Email: user.Email || "",
      phoneNumber: user.phoneNumber || "",
      password: "",
    });
    setIsEditing(false);
  };

  if (!user) return <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue">
    <div className="text-white text-xl">Loading profile...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue to-accent-blue">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-1/3 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20"
          >
            <div className="text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <img
                  src={`http://localhost:8000/${user.profileImage}`}
                  className="w-full h-full object-cover rounded-full border-4 border-primary/30 shadow-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {`${formData.FirstName} ${formData.LastName}`}
              </h3>
              <div className="space-y-3">
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/20 file:text-primary file:backdrop-blur-sm hover:file:bg-primary/30 file:transition-colors"
                />
                <button
                  onClick={handleImageUpload}
                  disabled={!image}
                  className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Upload Image
                </button>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-2/3 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Account Settings</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">First Name</label>
                  <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/60 ${
                      !isEditing ? "bg-white/5 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">Last Name</label>
                  <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/60 ${
                      !isEditing ? "bg-white/5 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">Email</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/60 ${
                      !isEditing ? "bg-white/5 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/60 ${
                      !isEditing ? "bg-white/5 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full p-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                  />
                </div>
              )}

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};


export default UserProfile;