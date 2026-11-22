import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import {
  createJoinRequest,
  getRequestsByProject,
} from "../controllers/joinRequestController.js";

const router = express.Router();

// Project routes
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Project Join Requests
router.post("/:projectId/requests", createJoinRequest);
router.get("/:projectId/requests", getRequestsByProject);

export default router;
