const { Event } = require("../models"); // Adjust the path as necessary

// exports.createEvent = async (req, res) => {
//   try {
//     // Assuming req.organization contains the authenticated organization's information
//     const organizationId = req.organization.id; // Adjust based on your token payload structure

//     const { name, picture, place, date, description } = req.body;

//     const event = await Event.create({
//       name,
//       picture, // Handling of image uploads is assumed to be elsewhere
//       place,
//       date,
//       description,
//       approved: false, // Events start as not approved
//       organizationId, // Assign the organization ID from the authenticated user
//     });

//     res.status(201).json(event);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// };
exports.createEvent = async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const { name, place, date, description } = req.body;

    const event = await Event.create({
      name,
      place,
      date,
      description,
      approved: false,
      organizationId,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getAllEvents = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and 10 events per page

  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize, 10);

  try {
    const { count, rows } = await Event.findAndCountAll({
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / pageSize);

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page, 10),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Event Update
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params; // The event ID
    const organizationId = req.organization.id; // Assuming this is set from the authMiddleware

    // Find the event, and ensure it belongs to the requesting organization
    const event = await Event.findOne({ where: { id, organizationId } });
    if (!event) {
      return res
        .status(404)
        .send(
          "Event not found or you do not have permission to update this event."
        );
    }

    const { name, picture, place, date, description } = req.body;
    await event.update({ name, picture, place, date, description });

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Event Deletion
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization.id; // Assuming this is set from the authMiddleware

    // Find the event, and ensure it belongs to the requesting organization
    const event = await Event.findOne({ where: { id, organizationId } });
    if (!event) {
      return res
        .status(404)
        .send(
          "Event not found or you do not have permission to delete this event."
        );
    }

    await event.destroy();
    res.send("Event deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.approveEvent = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the event's ID is passed in the URL

    // Fetch the event by ID
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).send("Event not found.");
    }

    // Set the event as approved
    await event.update({ approved: true });

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};
// In your eventController.js

exports.getEventsByOrganizationPublic = async (req, res) => {
  try {
    // The organization's ID is retrieved from the URL parameters
    const { orgId } = req.params;

    const events = await Event.findAll({
      where: { organizationId: orgId },
      // Optionally, include other related models or specify attributes if needed
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
exports.getEventsByInstitution = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize, 10);

  try {
    const { count, rows } = await Event.findAndCountAll({
      include: [
        {
          model: Organization,
          as: "organization",
          where: { type: "Institution" },
        },
      ],
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / pageSize);

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: parseInt(page, 10),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
exports.uploadEventPicture = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).send(" not found");
    }

    const file = req.file;
    const imageUrl = `/uploads/events/${file.filename}`;

    event.picture = imageUrl;
    await event.save();

    res.send({ message: "Event picture uploaded successfully", imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// In your routes file
