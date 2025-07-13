const express = require("express");
const {
  storeCricksal,
  getCricksals,
  deleteCricksal,
  updateCricksal,
  getSingleCricksal,
  getOwnerCricksals,
} = require("../controller/cricksal");
const { checkAuthorization, isOwner, isAdmin } = require("../middleware/auth");
const { 
  // addOwner,
  // deleteOwner,
  // getAllOwners
  getAllCricksalsForAdmin,
  deleteCricksalByAdmin
} = require("../controller/adminManage")
const router = express.Router();

// CRUD Operations for Cricksals
router.get("/api/cricksal", getCricksals); // Public route to view all cricksals
router.get("/api/cricksal/:id", getSingleCricksal); // Public route to view a single cricksal
router.get("/api/cricksals/owner", checkAuthorization, getOwnerCricksals)

//for Owner
router.post("/api/owner/cricksal", checkAuthorization, isOwner, storeCricksal); 
router.delete("/api/owner/cricksal/:id", checkAuthorization, isOwner, deleteCricksal); 
router.put("/api/owner/cricksal/:id", checkAuthorization, isOwner, updateCricksal); 



router.get("/api/cricksals", checkAuthorization, isAdmin, getAllCricksalsForAdmin)
router.delete("/api/cricksals/:cricksalId", checkAuthorization, isAdmin, deleteCricksalByAdmin)


module.exports = router;
