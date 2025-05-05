"use client";

import { usePathname } from "next/navigation";
import Nav from "./nav";

export default function NavWrapper() {
  const pathname = usePathname();

  // Nếu đang ở trang "/login", không hiển thị Nav
  if (pathname === "/auth/login") return null;
  if (pathname === "/auth/register") return null;
  if (pathname === "/auth/forgot") return null;
  return <Nav />;
}
