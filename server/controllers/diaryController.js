import DiaryEntry from "../models/diaryEntryModel.js";

// get latest diary entry
export const getLatestDiaryEntryController = async (req, res) => {
  const userId = req.user._id;

  try {
    // get the latest entry
    const latestEntry = await DiaryEntry.findOne({ userId }).sort({
      date: -1,
    });

    if (!latestEntry) {
      return res.status(404).json({ message: "No diary entries found" });
    }
    res.status(200).json({ latestEntry, message: "latest entry found" });
  } catch (error) {
    console.error("Error getting latest diary entry", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

// create diary entry controller
export const createDiaryEntryController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { content, date, mood, tags } = req.body;

    const newDiaryEntry = new DiaryEntry({
      userId,
      content,
      date: new Date(date || new Date()).toISOString().split("T")[0], // Store YYYY-MM-DD only
      mood: mood || undefined,
      tags: tags || [],
    });

    // save new entry
    const createdEntry = await newDiaryEntry.save();

    // convert createdEntry to object to remove userId
    const entryObject = createdEntry.toObject();
    delete entryObject.userId;

    // if creating new entry is successful send response
    res
      .status(201)
      .json({ diaryEntry: entryObject, message: "Diary entry created" });
  } catch (error) {
    console.error("Error creating diary entry", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update diary entry controller
export const updateDiaryEntryController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { entryId, content, mood, tags } = req.body;

    // Find the diary entry
    const entry = await DiaryEntry.findById(entryId).select("userId");

    if (!entry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    // to make sure the entry is created by current user
    if (entry.userId.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to update this entry" });
    }

    // Store old contents into Edit history
    if (content && content !== entry.content) {
      entry.editHistory.push({
        content: entry.content,
        editedAt: new Date(), // here we can store the date timestamp (no need for YYYY-MM-DD)
      });
      // update the entry contents
      entry.content = content;
    }

    // update mood if provided
    if (mood && mood !== entry.mood) {
      entry.mood = mood;
    }
    // empty tags could means that the user removed tha tags and dont want it so we update it regardless being empty
    entry.tags = tags;

    //update lastEditedAt for current timestamp
    entry.lastEditedAt = new Date();

    // save updated entry
    const updatedEntry = await entry.save();

    res.status(200).json({ updatedEntry, message: "Diary entry updated" });
  } catch (error) {
    console.error("Error updating diary entry", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get diary entry of given date
export const getDiaryEntryByDateController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.body;

    // find diary entry by given date
    const entry = await DiaryEntry.findOne({ userId, date });

    // check if entry exists
    if (!entry) {
      return res
        .status(404)
        .json({ message: "No diary entry found for this date" });
    }

    res.status(200).json({ entry, message: "Diary entry found" });
  } catch (error) {
    console.error("Error getting diary entry by date", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
