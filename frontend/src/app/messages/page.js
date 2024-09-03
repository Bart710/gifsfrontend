"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Messages from "@/components/Messages";

export default function MessagesPage() {
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "admin") {
      router.push("/gifs");
    } else {
      setUserRole(role);
    }
  }, [router]);

  if (userRole !== "admin") {
    return null;
  }
  return (
    <AuthenticatedLayout>
      <Messages userRole={userRole} />
    </AuthenticatedLayout>
  );
}
