import mongoose from "mongoose";

const diaryEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      select: false,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    editHistory: {
      type: [
        {
          content: String,
          editedAt: Date,
        },
      ],
    },
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
    mood: {
      type: String,
      enum: [
        "happy",
        "sad",
        "neutral",
        "angry",
        "excited",
        "anxious",
        "relaxed",
      ],
      default: "neutral",
    },
    tags: [String],
  },
  { timestamps: true }
);

// Compound index for faster queries on user + date
diaryEntrySchema.index({ userId: 1, date: -1 }, { unique: true }); // so the latest entry will be faster to retrive

export default mongoose.model("DiaryEntry", diaryEntrySchema);
