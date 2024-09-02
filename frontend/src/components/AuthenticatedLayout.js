"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AuthenticatedLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (!role) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("userRole");
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-gray-300 flex flex-col">
      <header className="bg-[#292929] py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="container flex items-center">
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
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/gifs"
                  className="text-gray-300 hover:text-yellow-500 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-500"
                >
                  GIFs
                </Link>
              </li>
              {userRole === "admin" && (
                <li>
                  <Link
                    href="/messages"
                    className="text-gray-300 hover:text-yellow-500 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-500"
                  >
                    Messages
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-yellow-500 transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-500"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-[#292929] py-4 text-center mt-auto">
        <p className="text-gray-500">Created by Bart710</p>
      </footer>
    </div>
  );
}
