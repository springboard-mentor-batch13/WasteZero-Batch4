import express from "express";

import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  getUserApplications,
  getNgoApplications,
  acceptApplication,
  rejectApplication,
  getAdminApplicationStats,
  getAllApplications,
} from "../controller/opportunityController.js";
import { protect, ngoOrAdmin, volunteerOnly, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getOpportunities)
  .post(protect, ngoOrAdmin, upload.single("image"), createOpportunity);

router.get("/my-applications", protect, getUserApplications);

// NGO Application Status Routes
router.get("/ngo/applications", protect, ngoOrAdmin, getNgoApplications);
router.post("/applications/:applicationId/accept", protect, ngoOrAdmin, acceptApplication);
router.post("/applications/:applicationId/reject", protect, ngoOrAdmin, rejectApplication);

// Admin Application Routes
router.get("/admin/applications/stats", protect, admin, getAdminApplicationStats);
router.get("/admin/applications", protect, admin, getAllApplications);

router
  .route("/:id")
  .get(protect, getOpportunityById)
  .put(protect, ngoOrAdmin, upload.single("image"), updateOpportunity)
  .delete(protect, ngoOrAdmin, deleteOpportunity);

router.post("/:id/apply", protect, volunteerOnly, applyForOpportunity);

export default router;
