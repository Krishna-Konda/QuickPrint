import mongoose, { Schema, model, models } from "mongoose";

const PrintItemSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["file", "text", "url", "image"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: false,
    },
    fileSize: {
      type: Number,
      required: false,
    },
    preview: {
      type: String,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent model recompilation in development
const PrintItem = models.PrintItem || model("PrintItem", PrintItemSchema);

export default PrintItem;
