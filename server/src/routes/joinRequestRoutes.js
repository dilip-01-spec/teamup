import express from "express";
import {
  getAllRequests,
  updateRequestStatus,
} from "../controllers/joinRequestController.js";

const router = express.Router();

router.get("/", getAllRequests);
router.patch("/:id", updateRequestStatus);
router.put("/:id", updateRequestStatus);

export default router;
