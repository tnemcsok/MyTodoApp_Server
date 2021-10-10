const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      text: true,
    },
    description: {
      type: String,
      required: true,
      text: true,
    },
    deadline: {
      type: String,
      default: "No deadline",
      text: true,
    },
    status: {
      type: String,
      default: "Planned",
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "General",
      text: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    thematicPriority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
