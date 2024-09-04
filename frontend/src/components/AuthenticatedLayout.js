"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AuthenticatedLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || !role) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, [router]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${selectedUserId}/change-password`,
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

      setIsPasswordModalOpen(false);
      setNewPassword("");
      setConfirmPassword("");
      alert(
        "Password changed successfully. Please log in again with your new password."
      );
      handleLogout();
    } catch (error) {
      setPasswordError(
        error.message || "Failed to change password. Please try again."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-gray-300 flex flex-col">
      <header className="bg-[#292929] py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/INFINITY.png"
              alt="Infinity Logo"
              width={100}
              height={25}
            />
            <Image
              src="/INFINITYLOGO.png"
              alt="Infinity Logo"
              width={100}
              height={25}
            />
          </div>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link
                  href="/gifs"
                  className="text-gray-300 hover:text-yellow-500 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-500"
                >
                  GIFs
                </Link>
              </li>
              {userRole === "admin" && (
                <>
                  <li>
                    <Link
                      href="/messages"
                      className="text-gray-300 hover:text-yellow-500 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-500"
                    >
                      Messages
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/users"
                      className="text-gray-300 hover:text-yellow-500 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-500"
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}
              {/* {userRole === "user" && (
                <li>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                  >
                    Change Password
                  </button>
                </li>
              )} */}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <footer className="bg-[#292929] py-4 text-center">
        <p className="text-gray-500">Created by Bart710</p>
      </footer>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#292929] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              Change Your Password
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
      )}
    </div>
  );
}
