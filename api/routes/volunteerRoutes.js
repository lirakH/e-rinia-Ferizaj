const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");
const adminController = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");

// Adjust the path as necessary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/volunteer");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
const fs = require("fs");
const dir = "./uploads/volunteer";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Middleware to allow either admin or volunteer authentication
const allowAdminOrVolunteer = (req, res, next) => {
  adminController.authMiddlewareAdmin(req, res, (adminAuthErr) => {
    if (!adminAuthErr) {
      return next();
    } else {
      volunteerController.authMiddleware(req, res, (volunteerAuthErr) => {
        if (!volunteerAuthErr) {
          return next();
        } else {
          return res.status(401).send("Unauthorized access");
        }
      });
    }
  });
};

router.get(
  "/liked-organizations",
  volunteerController.authMiddleware,
  volunteerController.getLikedOrganizations
);

// Route for volunteer registration
router.post("/register", volunteerController.register);

// Route for volunteer login
router.post("/login", volunteerController.login);

// Protected Routes
router.get("/", allowAdminOrVolunteer, volunteerController.getAllVolunteers);
router.get("/:id", allowAdminOrVolunteer, volunteerController.getVolunteer);
router.put("/:id", allowAdminOrVolunteer, volunteerController.updateVolunteer);
router.delete(
  "/:id",
  allowAdminOrVolunteer,
  volunteerController.deleteVolunteer
);

// A volunteer can favorite an organization
router.post(
  "/favorite-organization",
  volunteerController.authMiddleware,
  volunteerController.favoriteOrganization
);
router.post(
  "/unfavorite-organization",
  volunteerController.authMiddleware,
  volunteerController.unfavoriteOrganization
);

router.post(
  "/volunteers/:id/upload",
  upload.single("profilePicture"),
  allowAdminOrVolunteer,
  volunteerController.uploadProfilePicture
);

module.exports = router;
