"use client";
import { useState, useEffect } from "react";
import GifForm from "../../components/GifForm";
import GifList from "../../components/GifList";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default function GifsPage() {
  const [gifs, setGifs] = useState({});
  const [categories, setCategories] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchGifs();
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const fetchGifs = async () => {
    const response = await fetch(`${API_BASE_URL}/gifs`);
    const data = await response.json();
    setGifs(data);
    const uniqueCategories = Object.keys(data);
    setCategories(uniqueCategories);
  };

  const handleAddGif = async (newGifs) => {
    await fetch(`${API_BASE_URL}/gifs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGifs),
    });
    fetchGifs();
  };

  const handleDeleteGif = async (category, url) => {
    try {
      await fetch(`${API_BASE_URL}/gifs`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, url }),
      });
      fetchGifs();
    } catch (error) {
      console.error("Error deleting GIF:", error);
    }
  };

  return (
    <AuthenticatedLayout>
      {(userRole === "user" || userRole === "admin") && (
        <GifForm
          onAddGif={handleAddGif}
          categories={categories}
          userRole={userRole}
        />
      )}
      <GifList gifs={gifs} userRole={userRole} onDeleteGif={handleDeleteGif} />
    </AuthenticatedLayout>
  );
}
