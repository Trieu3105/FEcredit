"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/context";

const ProfilePage = () => {
  const { user, logout } = useUserContext(); // Lấy thông tin người dùng từ context
  const router = useRouter();

  useEffect(() => {
    // Nếu không có thông tin người dùng, chuyển hướng về trang chủ
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return <p className="text-center py-10">Đang tải thông tin...</p>;
  }
  // Xử lý chuỗi JSON của avatar
  let avatarUrl = "/fallback-image.jpg"; // Ảnh mặc định
  try {
    const parsedAvatar = JSON.parse(user.avatar); // Chuyển chuỗi JSON thành mảng
    if (Array.isArray(parsedAvatar) && parsedAvatar.length > 0) {
      avatarUrl = parsedAvatar[0]; // Lấy ảnh đầu tiên trong mảng
    }
  } catch (error) {
    console.error("Lỗi khi parse avatar JSON:", error);
  }

  return (
    <main className="max-w-6xl mx-auto p-4 mt-20 sm:p-6  min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className=" rounded-lg shadow-md p-4 flex flex-col items-center lg:items-start">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="rounded-full object-cover mb-4"
          />
          <h2 className="text-3xl font-bold text-center lg:text-left">
            {user.full_name || user.username}
          </h2>
          <div className="mt-4 space-y-2 text-gray-700 w-full">
            <button className="w-full text-left hover:text-red-600 font-medium">
              Thông tin tài khoản
            </button>
            <button className="w-full text-left hover:text-red-600 font-medium">
              Sổ địa chỉ
            </button>
            <button className="w-full text-left hover:text-red-600 font-medium">
              Quản lý đơn hàng
            </button>
            <button className="w-full text-left hover:text-red-600 font-medium">
              Sản phẩm đã xem
            </button>
            <button
              onClick={logout}
              className="w-full text-left text-red-600 font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-xl font-semibold mb-4">Thông tin tài khoản</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Họ tên</label>
              <input
                type="text"
                defaultValue={user.full_name || ""}
                className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  defaultValue={user.phone || ""}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Giới tính</label>
              <div className="flex items-center mt-1 gap-4">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    defaultChecked={user.gender === 0}
                  />{" "}
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    defaultChecked={user.gender === 1}
                  />{" "}
                  Nữ
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue={user.email || ""}
                disabled
                className="mt-1 w-full bg-gray-300 border rounded-md px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Ngày sinh</label>
                <select className="mt-1 border rounded-md px-3 py-2 w-full">
                  <option>Ngày</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Tháng</label>
                <select className="mt-1 border rounded-md px-3 py-2 w-full">
                  <option>Tháng</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Năm</label>
                <select className="mt-1 border rounded-md px-3 py-2 w-full">
                  <option>Năm</option>
                  {Array.from({ length: 80 }, (_, i) => 2025 - i).map(
                    (year) => (
                      <option key={year}>{year}</option>
                    )
                  )}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium w-full sm:w-auto"
            >
              Lưu thay đổi
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
