"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AdminSidebar from "@/components/admin/sidebar";

interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<AdminUser | null>(null);
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/signup";

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && !isAuthPage) {
        console.log("No session found, redirecting to login page.");
        router.push("/admin/login");
        return;
      }

      if (session && !isAuthPage) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (!adminUser) {
          console.log("User is not an admin, redirecting to login page.");
          router.push("/admin/login");
          return;
        }

        setUser(adminUser);
      }
    };

    checkSession();
  }, [router, supabase, isAuthPage]);

  // Show only the children (login/signup form) without sidebar on auth pages
  if (isAuthPage) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Don't render anything while checking authentication
  if (!user && !isAuthPage) {
    return null;
  }

  // Render the admin layout with sidebar for authenticated pages
  return (
    <div className="flex h-screen bg-gray-100">
      {user && <AdminSidebar user={user} />}
      <div className="flex-1 overflow-auto pl-64">{children}</div>
    </div>
  );
}
