const { Event, Organization } = require("../models");
const { broadcastEventNotification } = require("../websocketUtils");

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
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order
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

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization.id;

    const event = await Event.findOne({ where: { id, organizationId } });
    if (!event) {
      return res
        .status(404)
        .send(
          "Event not found or you do not have permission to update this event."
        );
    }

    const { name, picture, place, date, description } = req.body;
    await event.update({
      name,
      picture,
      place,
      date,
      description,
    });

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
exports.adminUpdateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ where: { id } });
    if (!event) {
      return res
        .status(404)
        .send(
          "Event not found or you do not have permission to update this event."
        );
    }

    const { name, picture, place, date, description, adminComment, approved } =
      req.body;
    await event.update({
      name,
      picture,
      place,
      date,
      description,
      adminComment,
      approved: false,
    });

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization.id;

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
    const { id } = req.params;

    const event = await Event.findByPk(id);

    broadcastEventNotification({
      type: "new_event",
      event,
    });

    if (!event) {
      return res.status(404).send("Event not found.");
    }

    await event.update({ approved: true });

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

// Get Events by Organization Public
exports.getEventsByOrganizationPublic = async (req, res) => {
  try {
    const { orgId } = req.params;

    const events = await Event.findAll({
      where: { organizationId: orgId },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Get Events by Institution
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

// Upload Event Picture
exports.uploadEventPicture = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).send("Event not found");
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

// Get Approved Events
exports.getApprovedEvents = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize, 10);

  try {
    const { count, rows } = await Event.findAndCountAll({
      where: { approved: true },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
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

// Get Not Approved Events
exports.getNotApprovedEvents = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  const offset = (page - 1) * pageSize;
  const limit = parseInt(pageSize, 10);

  try {
    const { count, rows } = await Event.findAndCountAll({
      where: { approved: false },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
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
