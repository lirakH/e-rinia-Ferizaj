const express = require("express");
const eventController = require("../controllers/eventController");
const {
  authMiddlewareOrganization,
  authorizeRole: authorizeRoleOrganization,
} = require("../controllers/organizationController");

const {
  authMiddlewareAdmin,
  authorizeRole: authorizeRoleAdmin,
} = require("../controllers/adminController");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/events");
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
const dir = "./uploads/events";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Inline middleware function to allow both admins and organizations
const allowAdminOrOrganization = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.admin) {
      req.admin = decoded.admin;
      req.userRole = "admin";
      return next();
    } else if (decoded.organization) {
      req.organization = decoded.organization;
      req.userRole = "organization";
      return next();
    } else {
      return res.status(401).json({ msg: "Token is not valid" });
    }
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

router.post(
  "/",
  authMiddlewareOrganization,
  authorizeRoleOrganization("organization"),
  eventController.createEvent
);

router.put("/:id", allowAdminOrOrganization, eventController.updateEvent);

router.delete("/:id", allowAdminOrOrganization, eventController.deleteEvent);

router.put(
  "/:id/approve",
  authMiddlewareAdmin,
  authorizeRoleAdmin("admin"),
  eventController.approveEvent
);

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEvent);

router.get(
  "/organization/:orgId",
  eventController.getEventsByOrganizationPublic
);
router.get("/institution", eventController.getEventsByInstitution);
router.post(
  "/upload/:id",
  upload.single("picture"),
  eventController.uploadEventPicture
);

module.exports = router;
