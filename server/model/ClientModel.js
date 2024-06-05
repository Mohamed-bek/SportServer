import mongoose from "mongoose";

const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "medcin",
      required: [true, "Doctor Id Name is required"],
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
    },
    weight: {
      type: String,
      required: [true, "weight is required"],
    },
    height: {
      type: String,
      required: [true, "height is required"],
    },
    birthday: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    healthProblems: {
      type: [String],
      required: [true, "Gender is required"],
    },
    youtubeLinks: [
      {
        name: String,
        rounds: Number,
        repetitions: Number,
        link: String,
      },
    ],
    pdfFile: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
