import Habit from "../models/habitModel.js";
import router from "../routes/authRoutes.js";

// create a new habit
export const createHabitController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { habitContent, difficulty, isPositive } = req.body;

    const habit = new Habit({
      userId,
      habitContent,
      difficulty,
      isPositive,
    });

    // save the new habit
    const createdHabit = await habit.save();

    // Convert to an object and remove userId before sending response
    const habitObject = createdHabit.toObject();
    delete habitObject.userId;

    res
      .status(201)
      .json({ habit: habitObject, message: "Habit saved successfully" });
  } catch (error) {
    console.error("Error creating habit: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update habit
export const updateHabitController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id, habitContent, difficulty, isPositive } = req.body;

    // find the bahit
    const habit = await Habit.findById(id).select("+userId");

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // check if the habit belongs to the user
    if (habit.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to update this habit" });
    }

    // update habit properties
    habit.habitContent = habitContent;
    habit.difficulty = difficulty;
    habit.isPositive = isPositive;

    // save the updated habit
    const updatedHabit = await habit.save();

    // Convert to an object and remove userId before sending response
    const habitObject = updatedHabit.toObject();
    delete habitObject.userId;

    res
      .status(200)
      .json({ habit: habitObject, message: "Habit updated successfully" });
  } catch (error) {
    console.error("Error updating habit: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get user's all habits
export const getAllHabitsController = async (req, res) => {
  try {
    const userId = req.user._id;

    // get all habits of the user
    const habits = await Habit.find({ userId });

    if (habits.length === 0) {
      return res.status(404).json({ message: "No habits found" });
    }

    res.status(200).json({ habits, message: "Habits fetched successfully" });
  } catch (error) {
    console.error("Error getting all habits: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete habit
export const deleteHabitController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // Extract id from URL parameters

    // find the habit to delete
    const habit = await Habit.findById(id).select("userId");

    res.json({ habit });

    // check if habit exists
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // check if the habit belongs to the user
    if (habit.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete this habit" });
    }

    // delete the habit
    await habit.deleteOne();

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
