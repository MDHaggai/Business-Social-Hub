import Story from "../models/Story.js";
import User from "../models/User.js";

export const createStory = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStory = new Story({
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      picturePath: req.file.filename,
    });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    console.error("Error creating story:", err);
    res.status(409).json({ message: err.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json(stories);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(404).json({ message: err.message });
  }
};

export const viewStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (!story.views.includes(userId)) {
      story.views.push(userId);
      await story.save();
    }

    res.status(200).json(story);
  } catch (err) {
    console.error("Error viewing story:", err);
    res.status(404).json({ message: err.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    await Story.findByIdAndDelete(id);

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error("Error deleting story:", err);
    res.status(404).json({ message: err.message });
  }
};
