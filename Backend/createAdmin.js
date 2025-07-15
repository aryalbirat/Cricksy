// createAdmin.js
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("./config/database.js"); // Connect to DB
const User = require("./model/User.js");

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ Email: "admin@cricksy.com" });
    if (existingAdmin) {
      console.log("❌ Admin already exists!");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("11111111", 10);

    // Create admin user successfully
    const admin = await User.create({
      FirstName: "Admin",
      LastName: "User",
      Email: "admin@cricksy.com", 
      password: hashedPassword,
      role: "admin",
      phoneNumber: "9999999999",
      address: "Admin Office"
    });

    console.log(" Admin created successfully!");
    console.log("Email: admin@cricksy.com");
    console.log("Password: 11111111");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();