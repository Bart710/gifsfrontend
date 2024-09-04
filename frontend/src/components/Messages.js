import React, { useState, useEffect, useCallback } from "react";
import { SketchPicker } from "react-color";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Messages(userRole) {
  const [message, setMessage] = useState("");
  const [label, setLabel] = useState("");
  const [messages, setMessages] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const insertBBCode = useCallback((tag, value = "") => {
    const textarea = document.getElementById("messageTextarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let newText = "";
    const openTag = value ? `[${tag}=${value}]` : `[${tag}]`;
    const closeTag = `[/${tag}]`;

    if (selectedText) {
      newText =
        textarea.value.substring(0, start) +
        openTag +
        selectedText +
        closeTag +
        textarea.value.substring(end);
    } else {
      newText = openTag + textarea.value + closeTag;
    }

    setMessage(newText);
    textarea.focus();
  }, []);

  const handleColorChange = useCallback((color) => {
    setSelectedColor(color.hex);
  }, []);

  const applyColor = useCallback(() => {
    insertBBCode("color", selectedColor);
    setShowColorPicker(false);
  }, [insertBBCode, selectedColor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_BASE_URL}/messages/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, content: message }),
        });
      } else {
        await fetch(`${API_BASE_URL}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, content: message }),
        });
      }
      setMessage("");
      setLabel("");
      setEditingId(null);
      fetchMessages();
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleEdit = (msg) => {
    setEditingId(msg._id);
    setLabel(msg.label);
    setMessage(msg.content);
  };

  const renderBBCode = (text) => {
    return text
      .replace(/\[b\](.*?)\[\/b\]/g, "<strong>$1</strong>")
      .replace(/\[i\](.*?)\[\/i\]/g, "<em>$1</em>")
      .replace(/\[u\](.*?)\[\/u\]/g, "<u>$1</u>")
      .replace(
        /\[color=(.*?)\](.*?)\[\/color\]/g,
        '<span style="color:$1">$2</span>'
      )
      .replace(/\n/g, "<br />");
  };

  const openDeleteModal = (msg) => {
    setMessageToDelete(msg);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  const handleDelete = async () => {
    if (messageToDelete) {
      try {
        await fetch(`${API_BASE_URL}/messages/${messageToDelete._id}`, {
          method: "DELETE",
        });
        fetchMessages();
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <div className="bg-[#292929] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        {editingId ? "Edit Message" : "Create New Message"}
      </h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2 mb-2">
          <button
            type="button"
            onClick={() => insertBBCode("b")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => insertBBCode("i")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => insertBBCode("u")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded"
          >
            Underline
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-2 rounded"
            >
              Color
            </button>
            {showColorPicker && (
              <div className="absolute z-10 mt-2">
                <SketchPicker
                  color={selectedColor}
                  onChange={handleColorChange}
                />
                <button
                  onClick={applyColor}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded w-full"
                >
                  Apply Color
                </button>
              </div>
            )}
          </div>
        </div>

        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-3 py-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mb-4"
          placeholder="Enter message label"
        />

        <textarea
          id="messageTextarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent mb-4"
          rows="4"
          placeholder="Enter new message"
        ></textarea>

        <div className="bg-[#1c1c1c] p-4 rounded-md text-gray-200 mb-4">
          <h4 className="text-lg font-semibold mb-2">Message Preview:</h4>
          <div dangerouslySetInnerHTML={{ __html: renderBBCode(message) }} />
        </div>

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full mt-4 mb-4"
        >
          {editingId ? "Update Message" : "Save Message"}
        </button>
      </form>

      <div className="bg-[#363636] p-6 rounded-lg mt-8">
        <h3 className="text-2xl font-semibold mb-6 text-yellow-500 border-b border-yellow-500 pb-2">
          Messages
        </h3>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-[#2a2a2a] p-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-gray-200">{msg.label}</h4>
                <div>
                  <button
                    onClick={() => handleEdit(msg)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-1 px-3 rounded-full text-sm transition duration-300 ease-in-out transform hover:scale-105 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(msg)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div
                className="text-gray-300 mt-2 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: renderBBCode(msg.content) }}
              />
            </div>
          ))}
        </div>
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#292929] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              Confirm Delete Message
            </h2>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
