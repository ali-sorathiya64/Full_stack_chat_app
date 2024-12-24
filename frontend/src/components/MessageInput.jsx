import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Plus, Image, Video, Mic, Send, X, Smile, Loader } from "lucide-react";
import toast from "react-hot-toast";
import Picker from "@emoji-mart/react"; // Import emoji picker

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith(type)) {
      toast.error(`Please select a valid ${type} file.`);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error(`${type} size must be under 10MB.`);
      return;
    }
  
    

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "image/") setImagePreview(reader.result);
      if (type === "video/") setVideoPreview(reader.result);
      if (type === "audio/") setAudioPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type) => {
    if (type === "image/") setImagePreview(null);
    if (type === "video/") setVideoPreview(null);
    if (type === "audio/") setAudioPreview(null);

    if (type === "image/" && fileInputRef.current) fileInputRef.current.value = "";
    if (type === "video/" && videoInputRef.current) videoInputRef.current.value = "";
    if (type === "audio/" && audioInputRef.current) audioInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !videoPreview && !audioPreview) return;

    setIsSending(true);
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        video: videoPreview,
        audio: audioPreview,
      });

      setText("");
      setImagePreview(null);
      setVideoPreview(null);
      setAudioPreview(null);

      if (fileInputRef.current) fileInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (audioInputRef.current) audioInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-2 sm:p-4 w-full relative">
      {/* Previews */}
      <div className="flex flex-col gap-2 mb-2">
        {imagePreview && (
          <div className="flex items-center gap-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border border-zinc-700" // Increased size
            />
            <button
              onClick={() => removeFile("image/")}
              className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {videoPreview && (
          <div className="flex items-center gap-2">
            <video
              src={videoPreview}
              controls
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg border border-zinc-700" // Increased size
            />
            <button
              onClick={() => removeFile("video/")}
              className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {audioPreview && (
          <div className="flex items-center gap-2">
            <audio
              src={audioPreview}
              controls
              className="w-full border border-zinc-700 rounded-lg"
            />
            <button
              onClick={() => removeFile("audio/")}
              className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-2 sm:left-4 z-50">
          <Picker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className={`flex items-center gap-1 sm:gap-2 ${isSending ? "blur-sm" : ""}`}
      >
        <div className="flex-1 flex gap-1 sm:gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending}
          />

          {/* Emoji Picker Trigger */}
          <button
            type="button"
            className="btn btn-circle btn-sm text-zinc-400"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isSending}
          >
            <Smile size={18} />
          </button>

          {/* Dropdown Menu Trigger */}
          <button
            type="button"
            className="btn btn-circle btn-sm text-zinc-400"
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isSending}
          >
            <Plus size={18} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-16 left-2 sm:left-4 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-1">
              <button
                type="button"
                className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={16} /> Image
              </button>
              <button
                type="button"
                className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video size={16} /> Video
              </button>
              <button
                type="button"
                className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg"
                onClick={() => audioInputRef.current?.click()}
              >
                <Mic size={16} /> Audio
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`btn btn-circle btn-sm ${isSending ? "opacity-50" : ""}`}
          disabled={(!text.trim() && !imagePreview && !videoPreview && !audioPreview) || isSending}
        >
          {isSending ? <Loader className="animate-spin size-4" /> : <Send size={18} />}
        </button>

        {/* Hidden Inputs */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e, "image/")}
        />
        <input
          type="file"
          accept="video/*"
          className="hidden"
          ref={videoInputRef}
          onChange={(e) => handleFileChange(e, "video/")}
        />
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          ref={audioInputRef}
          onChange={(e) => handleFileChange(e, "audio/")}
        />
      </form>
    </div>
  );
};

export default MessageInput;
