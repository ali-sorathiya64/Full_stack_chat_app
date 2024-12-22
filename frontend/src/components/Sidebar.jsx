import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Trash2, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, deleteChat } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile toggle

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      toast.success("Chat deleted successfully.");
      if (selectedUser?._id === chatId) setSelectedUser(null); // Deselect if active chat is deleted
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat.");
    }
  };

  if (!users.length) return <SidebarSkeleton />;

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-full"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative h-full ${
          isSidebarOpen ? "left-0" : "-left-full"
        } lg:left-0 w-72 bg-base-100 border-r border-base-300 flex flex-col transition-all duration-300 z-40`}
      >
        {/* Header */}
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 w-full">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm lg:text-base whitespace-nowrap hidden lg:block">
                Show online only
              </span>
              <span className="text-[1rem] lg:text-sm text-zinc-500">
                ({onlineUsers.length - 1} online)
              </span>
            </label>
          </div>
        </div>

        {/* User List */}
        <div className="overflow-y-auto flex-1 py-3">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="w-full flex items-center justify-between gap-3 p-3 hover:bg-base-300 transition-colors"
            >
              {/* User Info */}
              <button
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 flex-grow ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300 rounded-lg"
                    : ""
                }`}
              >
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={`${user.fullName || "User"}'s profile`}
                  className="w-12 h-12 object-cover rounded-full border border-base-300"
                />
                <div className="text-left min-w-0">
                  <div className="font-medium truncate text-sm lg:text-base">
                    {user.fullName || "Anonymous"}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteChat(user._id)}
                className="flex-shrink-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                title="Delete chat"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No chats available</div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
