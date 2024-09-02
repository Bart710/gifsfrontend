"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();
      // We're only storing the role now, not a token
      sessionStorage.setItem("userRole", data.role);
      router.push("/gifs");
    } catch (error) {
      setError(error.message || "Invalid password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#292929] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Image
            src="/INFINITY.png"
            alt="Infinity Logo"
            width={200}
            height={50}
          />
          <Image
            src="/INFINITYLOGO.png"
            alt="Infinity Logo"
            width={200}
            height={50}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          GIF Manager
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-3 py-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-4"
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#363636] hover:bg-yellow-600 text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Login
        </button>
      </form>
    </div>
  );
}
