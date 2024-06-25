const { Member, Organization } = require("../models");

exports.createMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    // Use organizationId from the authenticated organization
    const organizationId = req.organization.id;

    const member = await Member.create({ name, position, organizationId });
    return res.status(201).json(member);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { name, position } = req.body;

    const member = await Member.findByPk(memberId);

    if (!member) {
      return res.status(404).send("Member not found.");
    }

    const updatedMember = await member.update({ name, position });
    return res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findByPk(memberId);

    if (!member) {
      return res.status(404).send("Member not found.");
    }

    await member.destroy();
    return res.status(200).send("Member deleted successfully.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

exports.getMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findByPk(memberId);

    if (!member) {
      return res.status(404).send("Member not found.");
    }

    return res.status(200).json(member);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};
exports.getAllMembers = async (req, res) => {
  try {
    // Use organizationId from the authenticated organization
    const organizationId = req.organization.id;

    const members = await Member.findAll({
      where: { organizationId: organizationId },
    });

    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};
exports.uploadProfilePicture = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).send("Member not found");
    }

    const file = req.file;
    const imageUrl = `/uploads/${file.filename}`;

    member.profilePicture = imageUrl;
    await member.save();

    res.send({ message: "Profile picture uploaded successfully", imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
