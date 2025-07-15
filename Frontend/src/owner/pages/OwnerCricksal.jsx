import  { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlinePlus } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';

const OwnerCricksal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCricksal, setNewCricksal] = useState({
    name: '',
    pricePerHour: '',
    description: '',
    images: [],
    existingImages: [],
    deletedImages: [],
    location: '',
  });
  const [cricksals, setCricksals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCricksal, setEditCricksal] = useState(null);

  const fetchCricksals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cricksals/owner', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.status === 200) {
        setCricksals(response.data.cricksals);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCricksals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCricksal((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setNewCricksal((prev) => ({ ...prev, images: [...prev.images, ...selected] }));
  };

  const removeNewImage = (i) => {
    setNewCricksal((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));
  };

  const removeExistingImage = (url) => {
    setNewCricksal((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img !== url),
      deletedImages: [...prev.deletedImages, url],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = newCricksal.existingImages.length + newCricksal.images.length;
    if (total < 2) {
      toast.error('Please ensure at least there are two images.');
      return;
    }

    const form = new FormData();
    form.append('name', newCricksal.name);
    form.append('pricePerHour', newCricksal.pricePerHour);
    form.append('description', newCricksal.description);
    form.append('location', newCricksal.location);
    newCricksal.images.forEach((img) => form.append('images', img));
    form.append('deletedImages', JSON.stringify(newCricksal.deletedImages));

    try {
      let res;
      if (isEditing && editCricksal) {
        res = await axios.put(
          `http://localhost:8000/api/owner/cricksal/${editCricksal._id}`,
          form,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } else {
        res = await axios.post(
          'http://localhost:8000/api/owner/cricksal',
          form,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      }
      if (res.status === 200 || res.status === 201) {
        toast.success(isEditing ? 'Cricksal updated successfully' : 'Cricksal added successfully');
        setIsModalOpen(false);
        setIsEditing(false);
        setEditCricksal(null);
        setNewCricksal({
          name: '',
          pricePerHour: '',
          description: '',
          images: [],
          existingImages: [],
          deletedImages: [],
          location: '',
        });
        fetchCricksals();
      }
    } catch {
      toast.error('There was an error while saving cricksal.');
    }
  };

  const handleEdit = (c) => {
    setIsEditing(true);
    setEditCricksal(c);
    setNewCricksal({
      name: c.name,
      pricePerHour: c.pricePerHour,
      description: c.description,
      images: [],
      existingImages: c.images,
      deletedImages: [],
      location: c.location,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (c) => {
    if (!window.confirm('Are you sure you want to delete this cricksal?')) return;
    setCricksals((prev) => prev.filter((i) => i._id !== c._id));
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/owner/cricksal/${c._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (res.status === 200) toast.success('Cricksal deleted successfully');
    } catch {
      toast.error('Failed to delete cricksal.');
      fetchCricksals();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white px-6 py-8">
      <h1 className="text-4xl font-bold text-blue-400 mb-8 border-b border-blue-800 pb-3">
        Owner Cricksal Management
      </h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Cricksal List</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-6 py-2 rounded-lg flex items-center"
          onClick={() => {
            setIsEditing(false);
            setEditCricksal(null);
            setNewCricksal({
              name: '',
              pricePerHour: '',
              description: '',
              images: [],
              existingImages: [],
              deletedImages: [],
              location: '',
            });
            setIsModalOpen(true);
          }}
        >
          <AiOutlinePlus className="mr-2" /> Add Cricksal
        </button>
      </div>

      <ToastContainer />

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-2xl bg-black/30 backdrop-blur border border-blue-900">
        <table className="min-w-full divide-y divide-blue-800">
          <thead className="bg-black/50">
            <tr>
              {['Name', 'Price', 'Location', 'Images', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-blue-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-900">
            {cricksals.length > 0 ? (
              cricksals.map((c) => (
                <tr key={c._id} className="hover:bg-blue-900/20">
                  <td className="px-6 py-4 text-sm">{c.name}</td>
                  <td className="px-6 py-4 text-sm">₨{c.pricePerHour}</td>
                  <td className="px-6 py-4 text-sm">{c.location}</td>
                  <td className="px-6 py-4">
                    {c.images && c.images.length ? (
                      <img
                        src={`http://localhost:8000/${c.images[0]}`}
                        alt="cricksal"
                        className="h-14 w-14 object-cover rounded"
                      />
                    ) : (
                      <span className="text-sm text-blue-200">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-4">
                    <button
                      className="text-blue-400 hover:text-blue-200"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:text-red-200"
                      onClick={() => handleDelete(c)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-blue-200">
                  No cricksals available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-black/40 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-full max-w-3xl text-white"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {isEditing ? 'Edit Cricksal' : 'Add New Cricksal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    name="name"
                    value={newCricksal.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-black/50 border border-blue-800 rounded-md focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Price (per hour)</label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={newCricksal.pricePerHour}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-black/50 border border-blue-800 rounded-md focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Location</label>
                  <input
                    name="location"
                    value={newCricksal.location}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-black/50 border border-blue-800 rounded-md focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Image</label>
                <div className="border-2 border-dashed border-blue-800 rounded-md p-4 flex flex-col items-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                    id="upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="upload"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Upload Image
                  </label>
                  <p className="mt-2 text-xs text-blue-200">PNG, JPG, GIF up to 10MB</p>
                </div>

                {newCricksal.existingImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm mb-1 text-blue-200">Existing Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {newCricksal.existingImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={`http://localhost:8000/${img}`}
                            alt={`existing-${idx}`}
                            className="h-14 w-14 rounded object-cover"
                          />
                          <button
                            onClick={() => removeExistingImage(img)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newCricksal.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm mb-1 text-blue-200">New Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {newCricksal.images.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`new-${idx}`}
                            className="h-14 w-14 rounded object-cover"
                          />
                          <button
                            onClick={() => removeNewImage(idx)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  value={newCricksal.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 bg-black/50 border border-blue-800 rounded-md focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  {isEditing ? 'Save Changes' : 'Add Cricksal'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default OwnerCricksal;
