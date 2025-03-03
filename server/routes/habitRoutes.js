import express from "express";
import { authenticateUser } from "../middlewares/auth.js";
import {
  handleValidationError,
  validateCreateHabit,
  validateDeleteHabit,
  validateUpdateHabit,
} from "../middlewares/validations.js";
import {
  createHabitController,
  deleteHabitController,
  getAllHabitsController,
  updateHabitController,
} from "../controllers/habitController.js";

const router = express.Router();

// post : create habit
router.post(
  "/create",
  authenticateUser,
  validateCreateHabit,
  handleValidationError,
  createHabitController
);

// post : update habit
router.post(
  "/update",
  authenticateUser,
  validateUpdateHabit,
  handleValidationError,
  updateHabitController
);

// get : get all habits
router.get("/get-all", authenticateUser, getAllHabitsController);

// delete : delete habit
router.delete(
  "/delete/:id",
  authenticateUser,
  validateDeleteHabit,
  handleValidationError,
  deleteHabitController
);

export default router;
