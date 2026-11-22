import JoinRequest from "../models/JoinRequest.js";
import Project from "../models/Project.js";

// CREATE JOIN REQUEST
export const createJoinRequest = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your name and email address",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const request = await JoinRequest.create({
      projectId,
      projectTitle: project.title,
      name: name.trim(),
      email: email.trim(),
      message: message ? message.trim() : "",
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Collaboration request submitted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit request",
      error: error.message,
    });
  }
};

// GET REQUESTS FOR A PROJECT
export const getRequestsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const requests = await JoinRequest.find({ projectId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project requests",
      error: error.message,
    });
  }
};

// UPDATE REQUEST STATUS (Approve / Reject by Project Owner)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'Pending', 'Accepted', or 'Rejected'",
      });
    }

    const request = await JoinRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update request status",
      error: error.message,
    });
  }
};

// GET ALL REQUESTS (Optional filter by user email)
export const getAllRequests = async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email: email.trim().toLowerCase() } : {};

    const requests = await JoinRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};
