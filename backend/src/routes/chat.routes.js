// import express from 'express'
// import Chat from "../models/d.model.js"; // Assuming your "message.model.js" is for chats
// express.Router()
// const router = express.Router();
// // Delete Chat Route
// router.delete("/chatId", async (req, res) => {
//   try {
//     const { chatId } = req.params;
//     const chat = await Chat.findById(chatId);
    
//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found" });
//     }

//     await Chat.findByIdAndDelete(chatId);
//     res.status(200).json({ message: "Chat deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete chat", error: error.message });
//   }
// });

// export default router;


import express from "express";
import Chat from "../models/d.model.js"; // Assuming this is your chat model

const router = express.Router();

// Delete Chat Route
router.delete("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params; // Extract chatId from the URL params
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await Chat.findByIdAndDelete(chatId); // Delete the chat
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete chat", error: error.message });
  }
});

export default router;
