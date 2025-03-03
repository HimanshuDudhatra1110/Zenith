import { body, param, validationResult } from "express-validator";

// Middleware to check validation errors
export const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);

  // check if errors are present
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }
  next();
};

// validation for a POST register
export const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").notEmpty().withMessage("Name is required"),
];

// validation for a POST login
export const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// validation for a create diary entry
export const validateCreateDiaryEntry = [
  body("content").notEmpty().withMessage("Content is required"),
];

// validation for update diary entry
export const validateUpdateDiaryEntry = [
  body("content").notEmpty().withMessage("Content is required"),
  body("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid ID"),
];

// validation for a get diary entry by date
export const validateGetDiaryEntryByDate = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Please enter a valid ISO 8601 date"),
];

// for habits
// validation for create habit
export const validateCreateHabit = [
  body("habitContent").notEmpty().withMessage("Content is required"),
  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["Easy", "Moderate", "Hard"])
    .withMessage("Please enter valid difficulty."),
  body("isPositive")
    .notEmpty()
    .withMessage("IsPositive is required")
    .isBoolean()
    .withMessage("isPositive must be a boolean"),
];

// validation for update habit
export const validateUpdateHabit = [
  body("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Habit ID"),
  ...validateCreateHabit,
];

// validation for delete habit
export const validateDeleteHabit = [
  param("id")
    .exists()
    .withMessage("Habit ID is required") // Ensures ID is present
    .notEmpty()
    .withMessage("Habit ID cannot be empty") // Ensures ID is not an empty string
    .isMongoId()
    .withMessage("Invalid habit ID"), // Ensures ID is a valid MongoDB ObjectId
];
