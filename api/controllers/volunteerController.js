require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Volunteer, Organization, FavoriteOrganizations } = require("../models"); // Adjust the path as necessary

const jwtSecret = process.env.JWT_SECRET;
// const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage: storage });
// const fs = require("fs");
// const dir = "../uploads";

// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir, { recursive: true });
// }

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const volunteer = await Volunteer.findOne({ where: { email } });

    if (!volunteer) {
      return res.status(401).send("Incorrect email or password.");
    }

    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(401).send("Incorrect email or password.");
    }

    const payload = {
      volunteer: {
        id: volunteer.id,
        role: "volunteer",
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Other controller methods remain largely unchanged
// ...

// Authentication middleware are unchanged
// ...
exports.authorizeRole = (expectedRole) => (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    // Verify the token using the jwtSecret from the environment variable
    const decoded = jwt.verify(token, jwtSecret);
    // Ensure that the user role in the token matches the expectedRole
    if (decoded.user.role !== expectedRole) {
      return res
        .status(403)
        .send("Access denied. You do not have the right role.");
    }

    // Attach the decoded token to the request object and call next middleware
    req.user = decoded.user;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.volunteer = decoded.volunteer;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// Include other exports as necessary

exports.register = async (req, res) => {
  try {
    // Extract info from request body
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      return res.status(400).send("All input is required");
    }

    // Check if volunteer already exists
    const oldVolunteer = await Volunteer.findOne({ where: { email } });

    if (oldVolunteer) {
      return res.status(409).send("Volunteer Already Exists. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create volunteer in database
    const volunteer = await Volunteer.create({
      name,
      email: email.toLowerCase(), // convert email to lowercase
      password: encryptedPassword,
    });

    // Return the new volunteer
    res.status(201).json(volunteer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll({
      // Optionally, you can specify which attributes to include
      // For security reasons, you might want to exclude the password field
      attributes: { exclude: ["password"] },
    });
    res.json(volunteers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Authentication middleware
exports.authMiddleware = (req, res, next) => {
  //const token = req.header("Authorization");
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded volunteer ID:", decoded.volunteer.id);
    req.volunteer = decoded.volunteer;
    console.log("Volunteer in middleware:", req.volunteer);
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// Volunteer route handler
exports.getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }
    return res.json(volunteer);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

// In your routes file

// Update a volunteer
exports.updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }

    // Update volunteer with req.body values
    const updatedVolunteer = await volunteer.update(req.body);
    res.json(updatedVolunteer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Delete a volunteer
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }

    await volunteer.destroy();
    res.send("Volunteer deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
exports.favoriteOrganization = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const volunteerId = req.volunteer.id;

    // Check if the like already exists
    const existingFavorite = await FavoriteOrganizations.findOne({
      where: {
        volunteerId: volunteerId,
        organizationId: organizationId,
      },
    });

    if (existingFavorite) {
      // The volunteer has already liked this organization
      return res.status(409).send("You have already liked this organization.");
    }

    // Proceed to create the like since it doesn't exist
    const favorite = await FavoriteOrganizations.create({
      volunteerId,
      organizationId,
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.unfavoriteOrganization = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const volunteerId = req.volunteer.id;

    // Check if the like exists
    const existingFavorite = await FavoriteOrganizations.findOne({
      where: {
        volunteerId: volunteerId,
        organizationId: organizationId,
      },
    });

    if (!existingFavorite) {
      // The volunteer has not liked this organization yet
      return res.status(404).send("Like not found.");
    }

    // Proceed to remove the like
    await existingFavorite.destroy();

    res.status(200).send("Organization has been unfavorited successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getLikedOrganizations = async (req, res) => {
  //const volunteerId = req.volunteer.id; // Confirmed as '6' from your log
  const volunteerId = req.volunteer.id;
  console.log("Fetching organizations for volunteer ID:", volunteerId);
  try {
    const favoriteOrganizations = await FavoriteOrganizations.findAll({
      where: { volunteerId: volunteerId },
      include: [
        {
          model: Organization,
          required: true,
        },
      ],
    });

    // If you're aiming to return only the organizations, map over the results
    const organizations = favoriteOrganizations.map((fav) => fav.Organization);

    res.json(organizations);
  } catch (error) {
    console.error("Error fetching favorite organizations:", error);
    res.status(500).send("Server error");
  }
};
// In your volunteer controller

// Route to upload a profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);
    if (!volunteer) {
      return res.status(404).send("Volunteer not found");
    }

    const file = req.file;
    const imageUrl = `/uploads/${file.filename}`;

    volunteer.profilePicture = imageUrl;
    await volunteer.save();

    res.send({ message: "Profile picture uploaded successfully", imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// In your routes file
