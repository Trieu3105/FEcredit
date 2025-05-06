"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { useUserContext } from "../context/context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Nav() {
  const { user, logout } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  return (
    <nav className="bg-white/10 bg-black/10 backdrop-blur-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo - trái */}
          <Link href="/" className="text-xl font-bold text-white">
            2Store Apple
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-white">
            <Link href="/">Trang Chủ</Link>
            <Link href="/product">Sản phẩm</Link>
            <Link href="/promotion">Khuyến mãi</Link>
            <Link href="/product/accessories">Liên Hệ</Link>
            <Link href="/product/deals">Deals</Link>
            <Link href="/cart">Giỏ Hàng</Link>
            {user ? (
              <>
                <Link href="/profile">Tài khoản</Link>
                <Link href="/cart">Đơn hàng</Link>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-400"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">Đăng nhập</Link>
                <Link href="/auth/register">Đăng ký</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white z-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden px-6 text-white ${
          isMenuOpen ? "max-h-[600px] py-4" : "max-h-0 py-0"
        }`}
      >
        <div className="space-y-4 grid grid-cols-1 ">
          <a href="/" onClick={() => setIsMenuOpen(false)}>
            Trang Chủ
          </a>
          <a href="/product" onClick={() => setIsMenuOpen(false)}>
            Sản phẩm
          </a>
          <a href="/promotion" onClick={() => setIsMenuOpen(false)}>
            Khuyến mãi
          </a>
          <a
            href="/product/accessories"
            onClick={() => setIsMenuOpen(false)}
          >
            Liên Hệ
          </a>
          <a href="/product/deals" onClick={() => setIsMenuOpen(false)}>
            Deals
          </a>
          <a  href="/cart" onClick={() => setIsMenuOpen(false)}>
            Giỏ Hàng
          </a>

          {user ? (
            <>
              <a href="/profile" onClick={() => setIsMenuOpen(false)}>
                Tài khoản
              </a>
              <a href="/cart" onClick={() => setIsMenuOpen(false)}>
                Đơn hàng
              </a>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="text-red-500 hover:text-red-400"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <a href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                Đăng nhập
              </a>
              <a href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                Đăng ký
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
