require("dotenv").config();
const { Admin } = require("../models"); // Adjust the path as necessary
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Using JWT secret from environment variables
const jwtSecret = process.env.JWT_SECRET;
const jwtDuration = "2h"; // Token validity duration

// Admin login function
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).send("Incorrect email or password.");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).send("Incorrect email or password.");
    }

    const payload = {
      admin: {
        id: admin.id,
        role: "admin",
      },
    };

    jwt.sign(payload, jwtSecret, { expiresIn: jwtDuration }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Role authorization middleware
exports.authorizeRole = (expectedRole) => (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.admin.role !== expectedRole) {
      return res
        .status(403)
        .send("Access denied. You do not have the right role.");
    }
    req.admin = decoded.admin;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

// Authentication middleware for Admin
// exports.authMiddlewareAdmin = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }
//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     req.admin = decoded.admin;
//     next();
//   } catch (err) {
//     return res.status(401).json({ msg: "Token is not valid" });
//   }
// };
exports.authMiddlewareAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ msg: "Token has expired" });
    }
    req.admin = decoded.admin;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      // Do not send the password back
    });
  } catch (error) {
    // handle error
    return res.status(500).send("Server error");
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] }, // Exclude passwords from the result
    });
    return res.json(admins);
  } catch (error) {
    // handle error
    return res.status(500).send("Server error");
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    return res.json(admin);
  } catch (error) {
    // handle error
    return res.status(500).send("Server error");
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    let hashedPassword = admin.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await admin.update({
      name,
      email,
      password: hashedPassword,
    });

    return res.json({
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      // Again, do not send the password back
    });
  } catch (error) {
    // handle error
    return res.status(500).send("Server error");
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    await admin.destroy();
    return res.send("Admin deleted successfully");
  } catch (error) {
    // handle error
    return res.status(500).send("Server error");
  }
};
