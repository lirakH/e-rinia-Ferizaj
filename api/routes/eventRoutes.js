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

router.post(
  "/",
  authMiddlewareOrganization,
  authorizeRoleOrganization("organization"),
  eventController.createEvent
);

router.put(
  "/:id",
  authMiddlewareOrganization,
  authorizeRoleOrganization("organization"),
  eventController.updateEvent
);

router.delete(
  "/:id",
  authMiddlewareOrganization,
  authorizeRoleOrganization("organization"),
  eventController.deleteEvent
);

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
