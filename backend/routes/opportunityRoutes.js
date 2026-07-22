import express from "express";

import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  getUserApplications,
  getDashboardData,
} from "../controller/opportunityController.js";
import { protect, ngoOrAdmin, volunteerOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getOpportunities)
  .post(protect, ngoOrAdmin, upload.single("image"), createOpportunity);

router.get("/dashboard", protect, getDashboardData);

router.get("/my-applications", protect, getUserApplications);

router.route("/applications/:applicationId/status")
  .put(protect, ngoOrAdmin, updateApplicationStatus)
  .patch(protect, ngoOrAdmin, updateApplicationStatus);

router.get("/:id/applications", protect, ngoOrAdmin, getOpportunityApplications);

router
  .route("/:id")
  .get(protect, getOpportunityById)
  .put(protect, ngoOrAdmin, upload.single("image"), updateOpportunity)
  .delete(protect, ngoOrAdmin, deleteOpportunity);

router.post("/:id/apply", protect, volunteerOnly, applyForOpportunity);

export default router;