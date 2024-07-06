const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

// Routes for the Admin
router.post("/login", adminController.loginAdmin);
router.post("/", adminController.createAdmin);
//Protected Routes
router.get(
  "/",
  adminController.authMiddlewareAdmin,
  adminController.getAllAdmins
);
router.get(
  "/:id",
  adminController.authMiddlewareAdmin,
  adminController.getAdmin
);
router.put(
  "/:id",
  adminController.authMiddlewareAdmin,
  adminController.updateAdmin
);
router.delete(
  "/:id",
  adminController.authMiddlewareAdmin,
  adminController.deleteAdmin
);

module.exports = router;
