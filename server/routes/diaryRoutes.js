import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import {
  createDiaryEntryController,
  getDiaryEntryByDateController,
  getLatestDiaryEntryController,
  updateDiaryEntryController,
} from "../controllers/diaryController.js";
import {
  handleValidationError,
  validateCreateDiaryEntry,
  validateGetDiaryEntryByDate,
  validateUpdateDiaryEntry,
} from "../middlewares/validations.js";

const router = express.Router();

// get latest diary entry
router.get("/latestEntry", authenticateUser, getLatestDiaryEntryController);

// create diary entry
router.post(
  "/create",
  authenticateUser,
  validateCreateDiaryEntry,
  handleValidationError,
  createDiaryEntryController
);

// update existing diary entry
router.post(
  "/update",
  authenticateUser,
  validateUpdateDiaryEntry,
  handleValidationError,
  updateDiaryEntryController
);

// get diary entry by date
router.get(
  "/getEntry",
  authenticateUser,
  validateGetDiaryEntryByDate,
  handleValidationError,
  getDiaryEntryByDateController
);

export default router;
