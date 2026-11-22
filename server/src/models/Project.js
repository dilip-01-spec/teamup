
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    skillsRequired: {
      type: [String],
      default: []
    },

    lookingFor: {
      type: [String],
      default: []
    },

    creatorName: {
      type: String,
      required: true
    },

    creatorEmail: {
      type: String,
      default: ""
    },

    commitment: {
      type: String,
      enum: ["Part-time", "Full-time", "Flexible"],
      default: "Flexible"
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open"
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;

