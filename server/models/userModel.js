import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: function () {
        return this.providers.includes("local");
      },
      minlength: 6,
      select: false,
    },
    authId: {
      type: String,
      select: false,
      required: function () {
        return this.providers.includes("google");
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    providers: {
      type: [String],
      enum: ["local", "google"],
      default: [],
    },
    diaryStreak: {
      type: Number,
      default: 0,
    },
    habitScore: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving it to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
