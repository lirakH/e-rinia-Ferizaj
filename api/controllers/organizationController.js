require("dotenv").config(); // This is usually done in your app's entry point file, not in each controller
const { Organization } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define jwtSecret from the environment variable for local clarity
const jwtSecret = process.env.JWT_SECRET;

// Login function for Organization
exports.loginOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;

    const organization = await Organization.findOne({ where: { email } });
    if (!organization) {
      return res.status(401).send("Email or password is incorrect.");
    }

    const isMatch = await bcrypt.compare(password, organization.joinCode);
    if (!isMatch) {
      return res.status(401).send("Email or password is incorrect.");
    }

    const payload = {
      organization: {
        id: organization.id,
        role: "organization",
        type: organization.type,
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

exports.authorizeRole = (expectedRole) => (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  //const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.organization.role !== expectedRole) {
      return res
        .status(403)
        .send("Access denied. You do not have the right role.");
    }
    req.organization = decoded.organization;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

exports.authMiddlewareOrganization = (req, res, next) => {
  //const token = req.header("Authorization");
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.organization = decoded.organization;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const { name, email, joinCode, picture, description, type, shortname } =
      req.body;

    if (type !== "NGO" && type !== "Institution") {
      return res.status(400).send("Invalid organization type.");
    }

    // Hash the joinCode before storing it
    const hashedJoinCode = await bcrypt.hash(joinCode, 10);

    // Create the organization
    const organization = await Organization.create({
      name,
      email: email.toLowerCase(),
      joinCode: hashedJoinCode,
      picture,
      description,
      type,
      shortname,
    });

    return res.status(201).json({
      id: organization.id,
      name: organization.name,
      email: organization.email,
      picture: organization.picture,
      description: organization.description,
      type,
      shortname: organization.shortname,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      attributes: { exclude: ["joinCode"] }, // Exclude passwords from the result
    });
    return res.json(organizations);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

exports.getOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).send("Organization not found");
    }
    return res.json(organization);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).send("Organization not found");
    }

    const { name, email, joinCode, picture, description, shortname } = req.body;

    const updatedData = {
      name,
      email,
      joinCode,
      picture,
      description,
      shortname,
    };

    if (joinCode) {
      updatedData.joinCode = await bcrypt.hash(joinCode, 10);
    }

    const updatedOrganization = await organization.update(updatedData);

    return res.json({
      id: organization.id,
      name: organization.name,
      email: organization.email,
      picture: organization.picture,
      description: organization.description,
      shortname: organization.shortname,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findByPk(id);
    if (!organization) {
      return res.status(404).send("Organization not found");
    }

    await organization.destroy();
    return res.send("Organization deleted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};
exports.uploadPicture = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (!organization) {
      return res.status(404).send("Organization not found");
    }

    const file = req.file;
    const imageUrl = `/uploads/organizations/${file.filename}`;

    organization.picture = imageUrl;
    await organization.save();

    res.send({ message: "Profile picture uploaded successfully", imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
