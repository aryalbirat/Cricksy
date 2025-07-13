const User = require('../model/User');
const Cricksal = require('../model/Cricksal') 
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const { loggedInUsers } = require("./auth"); 
const Booking = require('../model/booking')



const getAllUserForAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Parse query parameters
    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
      role = '', // Add role query parameter
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    // Validate sort field
    const allowedSortFields = ['createdAt']; // Only allow sorting by createdAt
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortObject = { [finalSortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Build query
    let query = { role: { $ne: 'admin' } };

    // Filter by role if provided
    if (role && ['user', 'owner'].includes(role)) {
      query.role = role;
    }

    if (search) {
      // Search for users by FirstName or LastName only
      query.$or = [
        { FirstName: { $regex: search, $options: 'i' } },
        { LastName: { $regex: search, $options: 'i' } },
      ];
    }

    // Count total users for pagination
    const totalUsers = await User.countDocuments(query);

    // Fetch users
    const users = await User.find(query)
      .select('-password')
      .sort(sortObject)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    if (!users.length && totalUsers === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Return users with pagination
    res.status(200).json({
      users,
      pagination: {
        totalUsers,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalUsers / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getAllCricksalsForAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Fixed page limit
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || ''; // Trim search term

    // Step 1: Search cricksals by name or location
    const cricksals = await Cricksal.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'FirstName LastName Email');

    // Step 2: Count total cricksals for pagination
    const totalCricksals = await Cricksal.countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ]
    });

    if (!cricksals.length) {
      return res.status(404).json({ message: 'No cricksals found matching the search.' });
    }

    // Return cricksals with pagination
    res.status(200).json({
      cricksals,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalCricksals,
        totalPages: Math.ceil(totalCricksals / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching cricksals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to delete a cricksal
const deleteCricksalByAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { cricksalId } = req.params;

    // Check if cricksal exists
    const cricksal = await Cricksal.findById(cricksalId);
    if (!cricksal) {
      return res.status(404).json({ message: 'Cricksal not found.' });
    }

    // Delete the cricksal
    await Cricksal.findByIdAndDelete(cricksalId);

    res.status(200).json({ message: 'Cricksal deleted successfully.' });
  } catch (error) {
    console.error('Error deleting cricksal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = {
  
  getAllCricksalsForAdmin,
  deleteCricksalByAdmin,

  getAllUserForAdmin
  
};
