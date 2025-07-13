const Review = require("../model/review");
const Cricksal = require("../model/Cricksal")
const User = require("../model/User")
const Booking = require("../model/booking")




const createReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const cricksalId = req.params.id;
    const userId = req.user._id; // Assuming user ID from auth middleware

    // Validate cricksal existence
    const cricksal = await Cricksal.findById(cricksalId);
    if (!cricksal) {
      return res.status(404).json({ message: "Cricksal not found" });
    }

    // Validate rating
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Validate comment (if provided)
    if (comment && typeof comment !== "string") {
      return res.status(400).json({ message: "Comment must be a string" });
    }
    if (comment && comment.length > 500) {
      return res.status(400).json({
        message: "Comment cannot exceed 500 characters",
      });
    }

    // Check for completed booking
    const completedBooking = await Booking.findOne({
      user: userId,
      cricksalArena: cricksalId,
      status: "completed",
    });
    if (!completedBooking) {
      return res.status(403).json({
        message: "You can only review after completing a booking for this cricksal",
      });
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      user: userId,
      cricksal: cricksalId,
    });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this cricksal",
      });
    }

    // Create review
    const review = new Review({
      comment: comment || undefined, // Ensure empty string is not saved
      rating,
      cricksal: cricksalId,
      user: userId,
    });

    await review.save();

    // Populate user details
    await review.populate("user", "FirstName LastName");

    // Optionally update cricksal's average rating
    const reviews = await Review.find({ cricksal: cricksalId });
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Cricksal.findByIdAndUpdate(cricksalId, { averageRating });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({
      message: "Failed to create review",
      error: error.message,
    });
  }
};
// Get all reviews for a cricksal
const getCricksalReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ cricksal: req.params.id }).populate("user", "FirstName LastName");
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



const getReviewsForOwner = async (req, res) => {
  try {
    const ownerId = req.user._id;
    console.log('Owner ID:', ownerId);

    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Find all cricksals owned by this owner
    const ownerCricksals = await Cricksal.find({ createdBy: ownerId }).select('_id name');
    console.log('Owner Cricksals:', ownerCricksals);

    if (ownerCricksals.length === 0) {
      return res.status(404).json({ message: 'No cricksals found for this owner.' });
    }

    const cricksalIds = ownerCricksals.map((cricksal) => cricksal._id);

    // Build query
    let query = { cricksal: { $in: cricksalIds } };

    if (search) {
      // Search for cricksals by name
      const matchedCricksals = await Cricksal.find({
        _id: { $in: cricksalIds },
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      const matchedCricksalIds = matchedCricksals.map((cricksal) => cricksal._id);

      if (matchedCricksalIds.length > 0) {
        query.cricksal = { $in: matchedCricksalIds };
      } else {
        // If no cricksals match search, return empty immediately
        return res.status(404).json({ message: 'No matching cricksals found for the search term.' });
      }
    }

    // Sort setup
    const validSortFields = ['createdAt', 'rating'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOptions = {};
    sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // Total count for pagination
    const totalReviews = await Review.countDocuments(query);

    // Fetch reviews with pagination
    const reviews = await Review.find(query)
      .populate('cricksal', 'name location')
      .populate('user', 'FirstName LastName')
      .select('cricksal user comment rating createdAt')
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    console.log('Reviews fetched:', reviews.length);

    if (reviews.length === 0 && totalReviews === 0) {
      return res.status(404).json({ message: 'No reviews found for the cricksals of this owner.' });
    }

    res.status(200).json({
      reviews,
      pagination: {
        totalReviews,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalReviews / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews for owner:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};






const getAllReviewsForAdmin = async (req, res) => {
  try {
    const {
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Build query
    let query = {};

    let userIds = null;
    let cricksalIds = null;
    if (search) {
      // Search for users by FirstName or LastName
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } },
        ],
      };
      const users = await User.find(userQuery).select('_id');
      userIds = users.map((user) => user._id);

      // Search for cricksals by name
      const cricksalQuery = {
        name: { $regex: search, $options: 'i' },
      };
      const cricksals = await Cricksal.find(cricksalQuery).select('_id');
      cricksalIds = cricksals.map((cricksal) => cricksal._id);

      // Combine search conditions
      query.$or = [
        ...(cricksalIds.length > 0 ? [{ cricksal: { $in: cricksalIds } }] : []),
        ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
      ];
    }

    // Sort setup
    const validSortFields = ['createdAt', 'rating'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOptions = {};
    sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // Total count for pagination
    const totalReviews = await Review.countDocuments(query);

    // Fetch reviews with pagination
    const reviews = await Review.find(query)
      .populate('cricksal', 'name location')
      .populate('user', 'FirstName LastName')
      .select('cricksal user comment rating createdAt')
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    console.log('Reviews fetched:', reviews.length);

    if (reviews.length === 0 && totalReviews === 0) {
      return res.status(404).json({ message: 'No reviews found.' });
    }

    res.status(200).json({
      reviews,
      pagination: {
        totalReviews,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalReviews / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching all reviews for admin:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createReview, getCricksalReviews, getReviewsForOwner, getAllReviewsForAdmin, }