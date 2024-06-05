import mongoose from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;

const { Schema } = mongoose;

const medcinSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    birthday: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    avatar: {
      type: String,
      default: "default.png",
    },
    specialite: {
      type: String,
      required: [true, "Specialite is required"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "doctor",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Medcin", medcinSchema);
