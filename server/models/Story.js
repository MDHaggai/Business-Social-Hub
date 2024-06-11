import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  picturePath: {
    type: String,
    required: true,
  },
  views: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Story = mongoose.model("Story", storySchema);

export default Story;