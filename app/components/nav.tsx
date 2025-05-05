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
    <nav className="bg-white/10 backdrop-blur-md fixed top-0 left-0 w-full z-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white">
            2Store Apple
          </Link>

          {/* Desktop Navigation */}
          <div className="Navigation hidden md:flex items-center space-x-6 text-white">
            <Link href="/" className="hover:text-gray-300 ">
              Trang Chủ
            </Link>
            <Link href="/product" className="hover:text-gray-300">
              Sản Phẩm
            </Link>
            <Link href="/promotion" className="hover:text-gray-300">
              Khuyến mãi
            </Link>
            <Link href="/product/accessories" className="hover:text-gray-300">
              Liên Hệ
            </Link>
            <Link href="/product/deals" className="hover:text-gray-300">
              Deals
            </Link>
            <Search className="w-5 h-5 hover:text-gray-300 cursor-pointer" />
            <Link href="/cart" className="hover:text-gray-300">
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center cursor-pointer hover:text-gray-300">
                  <span>Xin chào, {user.full_name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="w-4 h-4 mr-2" /> Tài khoản
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cart">
                      <ShoppingCart className="w-4 h-4 mr-2" /> Đơn hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-gray-300 focus:outline-none">
                  <User className="w-5 h-5 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg rounded-md p-2 w-40">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/auth/login"
                      className="flex items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <LogIn className="w-4 h-4 mr-2" /> Đăng nhập
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/auth/register"
                      className="flex items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <UserPlus className="w-4 h-4 mr-2" /> Đăng ký
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
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
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 text-white px-6 py-4 space-y-4">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Trang Chủ
          </Link>
          <Link
            href="/product"
            onClick={() => setIsMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Sản Phẩm
          </Link>
          <Link
            href="/promotion"
            onClick={() => setIsMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Khuyến mãi
          </Link>
          <Link
            href=""
            onClick={() => setIsMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Liên Hệ
          </Link>
          <Link
            href="/product/deals"
            onClick={() => setIsMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Deals
          </Link>
          <Link
            href="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Giỏ Hàng
          </Link>

          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-gray-300"
              >
                Tài khoản
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-gray-300"
              >
                Đơn hàng
              </Link>
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
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-gray-300"
              >
                Đăng nhập
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:text-gray-300"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
