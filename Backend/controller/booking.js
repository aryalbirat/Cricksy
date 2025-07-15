const Booking = require("../model/booking");
const User = require("../model/User");

const { getAllCricksalsForAdmin } = require("./adminManage");

const Cricksal = require("../model/Cricksal"); // Adjust path to your Cricksal model



const makeBooking = async (req, res, next) => {
  try {
    const { cricksalArena, bookingDate, startTime, endTime, totalAmount } = req.body;

    if (!cricksalArena || !bookingDate || !startTime || !endTime || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      cricksalArena,
      bookingDate,
      status: { $ne: "cancelled" },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Slot already booked." });
    }

    // Create Booking with status "upcoming" (no payment required)
    const newBooking = new Booking({
      user: req.user._id,
      cricksalArena,
      bookingDate,
      startTime,
      endTime,
      totalAmount,
      status: "upcoming",
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: newBooking._id,
      booking: newBooking
    });

  } catch (err) {
    console.error("Error creating booking:", err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
    next(err);
  }
};


  const getBookings = async (req, res, next) => {
    try {
      const now = new Date();
  
      const bookings = await Booking.find(
        { user: req.user._id , 
          status: { $ne: "cancelled" } //
        })
        .populate("cricksalArena", "name location images")
        .sort({ bookingDate: 1, startTime: 1 });
  
      const result = {
        completed: [],
        current: [],
        upcoming: []
      };
  
      for (const booking of bookings) {
        const bookingStart = new Date(booking.bookingDate);
        const bookingEnd = new Date(booking.bookingDate);
  
        const [startHour, startMinute] = booking.startTime.split(':').map(Number);
        const [endHour, endMinute] = booking.endTime.split(':').map(Number);
  
        bookingStart.setHours(startHour, startMinute);
        bookingEnd.setHours(endHour, endMinute);
  
        console.log("\n--- Booking Debug ---");
        console.log("Booking ID:", booking._id);
        console.log("Status:", booking.status);
        console.log("Start:", bookingStart.toISOString());
        console.log("End:", bookingEnd.toISOString());
        console.log("Now:", now.toISOString());
  
        // Check if booking has already passed
        if (now > bookingEnd) {
          // If it's not marked completed, optionally update it
          if (booking.status !== 'completed') {
            booking.status = 'completed';
            await booking.save(); // Save updated status to DB
          }
          result.completed.push(booking);
          console.log("=> Categorized as: COMPLETED (auto-updated if needed)");
        } else if (now >= bookingStart && now <= bookingEnd) {
          result.current.push(booking);
          console.log("=> Categorized as: CURRENT");
        } else {
          result.upcoming.push(booking);
          console.log("=> Categorized as: UPCOMING");
        }
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Get bookings error:", err.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

const getAvailableSlots = async (req, res, next) => { 
  try {
    const { cricksalArena, bookingDate } = req.query;

    if (!cricksalArena || !bookingDate) {
      return res.status(400).json({ message: "Cricksal arena and booking date are required" });
    }

    // Define working hours (6 AM - 10 PM)
    const openingTime = 6; // 6 AM
    const closingTime = 22; // 10 PM
    const slotDuration = 1; // 1 hour

    // Generate all slots
    const allSlots = [];
    for (let hour = openingTime; hour < closingTime; hour += slotDuration) {
      allSlots.push({
        startTime: `${hour}:00`,
        endTime: `${hour + slotDuration}:00`,
        status: "available", // Default status
      });
    }

    // Get current date and time
    const currentDate = new Date();
    const currentHour = currentDate.getHours(); // Current hour in 24-hour format
    const currentMinute = currentDate.getMinutes();

    // Parse the bookingDate to compare
    const bookingDateObject = new Date(bookingDate);
    const isSameDay = bookingDateObject.toDateString() === currentDate.toDateString();

    // Fetch booked slots for the selected date (exclude cancelled bookings)
    const bookedSlots = await Booking.find({ 
      cricksalArena, 
      bookingDate,
      status: { $ne: "cancelled" }
    }).select("startTime endTime status");

    // Filter slots for the selected date
    const updatedSlots = allSlots.map(slot => {
      const slotStartHour = parseInt(slot.startTime.split(":")[0]);

      // Check if the slot is in the past (before current time)
      let isBeforeCurrentTime = false;
      if (isSameDay && slotStartHour < currentHour) {
        isBeforeCurrentTime = true;
      } else if (isSameDay && slotStartHour === currentHour && currentMinute > 0) {
        isBeforeCurrentTime = true;
      }

      // Check if the slot is booked or cancelled
      const isBooked = bookedSlots.some(booked => 
        slot.startTime < booked.endTime && slot.endTime > booked.startTime && booked.status !== "cancelled"
      );

      // Disable slots before the current time
      return {
        ...slot,
        status: isBooked || isBeforeCurrentTime ? "booked" : "available",
      };
    });

    res.status(200).json({ slots: updatedSlots });
  } catch (err) {
    next(err);
  }
};

 
const getAllBookingsOfUsers = async (req, res) => {
  try {
    console.log('User Role:', req.user.role);
    console.log('User ID:', req.user._id);

    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Access denied. Owners only.' });
    }

    const {
      search = '',
      sortBy = 'bookingDate',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Find cricksal arenas owned by the user
    const ownerCricksals = await Cricksal.find({ createdBy: req.user._id }).select('_id name');
    if (!ownerCricksals.length) {
      return res.status(404).json({ message: 'No cricksal arenas found for this owner.' });
    }
    const cricksalIds = ownerCricksals.map((cricksal) => cricksal._id);

    // Build query
    let query = { cricksalArena: { $in: cricksalIds } };

    if (search) {
      // Search for users by FirstName or LastName
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } },
        ],
      };
      const users = await User.find(userQuery).select('_id');
      const userIds = users.map((user) => user._id);

      // Search for cricksal arenas by name
      const cricksalQuery = { name: { $regex: search, $options: 'i' }, _id: { $in: cricksalIds } };
      const matchingCricksals = await Cricksal.find(cricksalQuery).select('_id');
      const matchingCricksalIds = matchingCricksals.map((cricksal) => cricksal._id);

      // Combine search conditions
      query.$or = [
        ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
        ...(matchingCricksalIds.length > 0 ? [{ cricksalArena: { $in: matchingCricksalIds } }] : []),
      ];
    }

    // Sort setup
    const validSortFields = ['bookingDate', 'totalAmount', 'createdAt'];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'bookingDate';
    const sortOptions = {};
    sortOptions[finalSortBy] = sortOrder === 'asc' ? 1 : -1;

    // Total count for pagination
    const totalBookings = await Booking.countDocuments(query);

    // Fetch bookings
    const bookings = await Booking.find(query)
      .populate({
        path: 'cricksalArena',
        select: 'name location',
      })
      .populate('user', 'FirstName LastName Email')
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    console.log('Bookings fetched:', bookings.length);

    if (bookings.length === 0 && totalBookings === 0) {
      return res.status(404).json({ message: 'No bookings found for your cricksal arenas.' });
    }

    res.status(200).json({
      bookings,
      pagination: {
        totalBookings,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalBookings / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllBookingsForAdmin = async (req, res) => {
  try {
    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Parse query parameters
    const {
      search = '',
      sortBy = 'bookingDate',
      sortOrder = 'desc',
      page = 1,
      limit = 5,
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    // Validate sort field
    const allowedSortFields = ['bookingDate', 'totalAmount'];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'bookingDate';
    const sortObject = { [finalSortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Build query
    let query = {};

    if (search) {
      // Search for users by FirstName or LastName
      const userQuery = {
        $or: [
          { FirstName: { $regex: search, $options: 'i' } },
          { LastName: { $regex: search, $options: 'i' } },
        ],
      };
      const users = await User.find(userQuery).select('_id');
      const userIds = users.map((user) => user._id);

      // Search for cricksal arenas by name
      const cricksalQuery = { name: { $regex: search, $options: 'i' } };
      const cricksals = await Cricksal.find(cricksalQuery).select('_id');
      const cricksalIds = cricksals.map((cricksal) => cricksal._id);

      // Combine search conditions
      query.$or = [
        ...(userIds.length > 0 ? [{ user: { $in: userIds } }] : []),
        ...(cricksalIds.length > 0 ? [{ cricksalArena: { $in: cricksalIds } }] : []),
      ];

      // If no users or cricksals match, return early
      if (!userIds.length && !cricksalIds.length) {
        return res.status(404).json({ message: 'No bookings found matching the search.' });
      }
    }

    // Count total bookings for pagination
    const totalBookings = await Booking.countDocuments(query);

    // Fetch bookings
    const bookings = await Booking.find(query)
      .populate({
        path: 'cricksalArena',
        select: 'name location createdBy',
      })
      .populate('user', 'FirstName LastName Email')
      .sort(sortObject)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    if (!bookings.length && totalBookings === 0) {
      return res.status(404).json({ message: 'No bookings found.' });
    }

    // Return bookings with pagination
    res.status(200).json({
      bookings,
      pagination: {
        totalBookings,
        currentPage: parsedPage,
        totalPages: Math.ceil(totalBookings / parsedLimit),
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Error fetching all bookings for admin:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑 Deleting booking with ID:", id);

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(" Error deleting booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const updateBookingStatus = async (req, res) => {

  try {
    // Get current time
    const now = new Date();

    // Fetch all bookings
    const bookings = await Booking.find({});

    // Iterate through each booking
    for (const booking of bookings) {
      // Combine bookingDate with startTime and endTime
      const [startHour, startMinute] = booking.startTime.split(':').map(Number);
      const [endHour, endMinute] = booking.endTime.split(':').map(Number);

      // Create Date objects for start and end times
      const startDateTime = new Date(booking.bookingDate);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(booking.bookingDate);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      // Determine new status
      let newStatus;
      if (now < startDateTime) {
        newStatus = 'upcoming';
      } else if (now > endDateTime) {
        newStatus = 'completed';
      }

      // Update status if it has changed
      if (booking.status !== newStatus) {
        booking.status = newStatus;
        booking.updatedAt = now;
        await booking.save();
        console.log(`Updated booking ${booking._id} to status: ${newStatus}`);
      }
    }

    console.log('Booking status update completed.');
  } catch (error) {
    console.error('Error updating booking statuses:', error);
  }
}

const startBookingStatusUpdater = async(req, res) => {
  console.log('Starting booking status updater...');
  await updateBookingStatus(); // Run immediately on start
  setInterval(updateBookingStatus, 60 * 60 * 1000); // Run every hour (3600000 ms)
}

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID from URL params
    console.log("🚫 Cancelling booking with ID:", id);

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is authorized to cancel (either the booking owner or an admin)
    if (req.user._id.toString() !== booking.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. You are not authorized to cancel this booking." });
    }

    // Check if the booking can be cancelled (not started or completed)
    const now = new Date();
    const bookingStart = new Date(booking.bookingDate);
    const [startHour, startMinute] = booking.startTime.split(':').map(Number);
    bookingStart.setHours(startHour, startMinute);

    if (now >= bookingStart || booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a booking that has started or is completed." });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled." });
    }

    // Update booking status to "cancelled"
    booking.status = "cancelled";
    await booking.save();


    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDate, startTime, endTime, totalAmount, status } = req.body;

    console.log("📝 Updating booking with ID:", id);

    // Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if admin is making the request
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Prepare update object
    const updateData = {};
    if (bookingDate) updateData.bookingDate = bookingDate;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (totalAmount) updateData.totalAmount = totalAmount;
    if (status) updateData.status = status;
    updateData.updatedAt = new Date();

    // If updating time slots, check for conflicts (excluding current booking)
    if (bookingDate || startTime || endTime) {
      const checkDate = bookingDate || booking.bookingDate;
      const checkStartTime = startTime || booking.startTime;
      const checkEndTime = endTime || booking.endTime;

      const conflictingBooking = await Booking.findOne({
        _id: { $ne: id }, // Exclude current booking
        cricksalArena: booking.cricksalArena,
        bookingDate: checkDate,
        status: { $ne: "cancelled" },
        $or: [
          { startTime: { $lt: checkEndTime }, endTime: { $gt: checkStartTime } },
        ],
      });

      if (conflictingBooking) {
        return res.status(400).json({ message: "Time slot conflict with another booking." });
      }
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('cricksalArena', 'name location')
     .populate('user', 'FirstName LastName Email');

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Error updating booking:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  makeBooking,
  getBookings, 
  getAvailableSlots,
  getAllBookingsOfUsers,
  deleteBooking,
  updateBooking,
  getAllBookingsForAdmin,
  startBookingStatusUpdater,
  cancelBooking

};

