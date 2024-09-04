"use client";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Failed to fetch users");
    }
  };

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const generatedPassword = generatePassword();
    setGeneratedPassword(generatedPassword);
    const userToCreate = { ...newUser, password: generatedPassword };
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userToCreate),
      });
      if (!response.ok) throw new Error("Failed to create user");
      await fetchUsers();
      setCredentials(`credentials:
website: http://localhost:3000/login
username: ${userToCreate.username}
password: ${generatedPassword}`);
      setNewUser({ username: "", password: "", role: "user" });
    } catch (error) {
      setError("Failed to create user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editingUser),
      });
      if (!response.ok) throw new Error("Failed to update user");
      await fetchUsers();
      setEditingUser(null);
      setIsModalOpen(false);
    } catch (error) {
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      await fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${selectedUserId}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newPassword }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
      setError("Password changed successfully");
      setIsPasswordModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message || "Failed to change password");
    }
  };

  const copyCredentials = () => {
    navigator.clipboard
      .writeText(credentials)
      .then(() => {
        alert("Credentials copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy credentials: ", err);
      });
  };

  return (
    <AuthenticatedLayout>
      <div className="bg-[#292929] p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">
          User Management
        </h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="mb-4 bg-[#363636] hover:bg-[#292929] text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out focus:ring-2 focus:ring-yellow-500 flex items-center"
        >
          ➕ Add New User
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#363636] rounded-lg overflow-hidden">
            <thead className="bg-[#292929] text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-[#292929]">
                  <td className="px-4 py-2 text-gray-300">{user.username}</td>
                  <td className="px-4 py-2 text-gray-300">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsModalOpen(true);
                      }}
                      className="mr-2 text-blue-500 hover:text-blue-600"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUserId(user._id);
                        setIsDeleteModalOpen(true);
                      }}
                      className="mr-2 text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                    {/* <button
                      onClick={() => {
                        setSelectedUserId(user._id);
                        setIsPasswordModalOpen(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-600"
                      title="Change Password"
                    >
                      🔑
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#292929] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              {editingUser ? "Edit User" : "Create New User"}
            </h2>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              {!credentials && (
                <>
                  <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={
                      editingUser ? editingUser.username : newUser.username
                    }
                    onChange={(e) =>
                      editingUser
                        ? setEditingUser({
                            ...editingUser,
                            username: e.target.value,
                          })
                        : setNewUser({ ...newUser, username: e.target.value })
                    }
                    placeholder="Username"
                    className="w-full px-3 py-2 mb-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                  <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Role
                  </label>
                  <select
                    value={editingUser ? editingUser.role : newUser.role}
                    onChange={(e) =>
                      editingUser
                        ? setEditingUser({
                            ...editingUser,
                            role: e.target.value,
                          })
                        : setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-3 py-2 mb-4 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="spectator">Spectator</option>
                  </select>
                  <div className="mb-4">
                    <label
                      className="block text-gray-300 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      type="text"
                      id="password"
                      value={generatedPassword ? "**********" : ""}
                      placeholder="**********"
                      className="w-full px-3 py-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      disabled
                    />
                    {!editingUser && (
                      <p className="text-sm text-gray-400 mt-1">
                        {credentials
                          ? "Password has been auto-generated."
                          : "Password will be auto-generated upon user creation."}
                      </p>
                    )}
                  </div>
                </>
              )}
              {credentials && (
                <div className="mb-4">
                  <pre className="bg-[#363636] p-3 rounded text-gray-200 whitespace-pre-wrap">
                    {credentials}
                  </pre>
                  <button
                    type="button"
                    onClick={copyCredentials}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  >
                    Copy Credentials
                  </button>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setCredentials("");
                    setGeneratedPassword("");
                  }}
                  className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Close
                </button>
                {!credentials && (
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                  >
                    {editingUser ? "Update" : "Create"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#292929] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              Change Password for User
            </h2>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-3 py-2 mb-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-3 py-2 mb-4 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
              {passwordError && (
                <p className="text-red-500 mb-2">{passwordError}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                  className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}

      {/* Delete User Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#292929] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              Confirm Delete User
            </h2>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
