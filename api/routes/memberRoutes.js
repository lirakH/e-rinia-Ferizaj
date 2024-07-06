const express = require("express");
const memberController = require("../controllers/memberController"); // Adjust the path as necessary
const organizationController = require("../controllers/organizationController"); // Adjust the path as necessary
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/members");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// Ensure upload directory exists
const dir = "./uploads/members";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Middleware to check if the organization is logged in and is an institution
const checkInstitutionType = async (req, res, next) => {
  if (req.organization.type !== "Institution") {
    return res
      .status(403)
      .send("This action is only allowed for Institution type organizations.");
  }
  next();
};

// Routes for the Member with authentication and type checks
router.post(
  "/",
  organizationController.authMiddlewareOrganization,
  checkInstitutionType,
  memberController.createMember
);

router.put(
  "/:memberId",
  organizationController.authMiddlewareOrganization,
  checkInstitutionType,
  memberController.updateMember
);

router.delete(
  "/:memberId",
  organizationController.authMiddlewareOrganization,
  checkInstitutionType,
  memberController.deleteMember
);

// Public routes for getting member information
router.get("/:memberId", memberController.getMember);
router.get(
  "/:organizationId/members",
  memberController.getMembersByOrganizationId
);

router.post(
  "/upload/:id/",
  upload.single("profilePicture"),
  memberController.uploadProfilePicture
);

module.exports = router;
