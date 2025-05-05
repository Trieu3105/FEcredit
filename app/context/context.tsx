"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Định nghĩa interface cho User và UserContextType
interface User {
  id: number; // ID của người dùng
  username: string; // Tên đăng nhập
  full_name: string; // Họ và tên đầy đủ
  email: string | null; // Email của người dùng
  phone: string | null; // Số điện thoại
  password?: string; // Mật khẩu (nên không lưu trữ trên frontend)
  address: string | null; // Địa chỉ
  role: string; // Vai trò (admin, customer, v.v.)
  status: string; // Trạng thái (active, inactive, v.v.)
  created_at: string; // Thời gian tạo tài khoản
  updated_at: string; // Thời gian cập nhật tài khoản
  avatar: string; // URL ảnh đại diện
  gender : number; // Giới tính (0: Nam, 1: Nữ, 2: Khác)
}

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user: User | null;
  email: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const token = Cookies.get("access_token");

  // Hàm fetch thông tin người dùng từ API
  const fetchUserData = async (accessToken: string) => {
    try {
      const response = await axios.get("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });

      if (response.status === 200 && response.data.profile) {
        const { username, email } = response.data.profile;
        setUser({
          id: response.data.profile.id,
          username: response.data.profile.username,
          full_name: response.data.profile.full_name,
          email: response.data.profile.email,
          phone: response.data.profile.phone,
          address: response.data.profile.address,
          role: response.data.profile.role,
          status: response.data.profile.status,
          created_at: response.data.profile.created_at,
          updated_at: response.data.profile.updated_at,
          avatar: response.data.profile.avatar,
          gender : response.data.profile.gender,
        });
        setEmail(email); // Cập nhật email
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify({ username, email }));
      } else {
        console.warn("User not found or other error.");
        setUser(null);
        setEmail(null);
        localStorage.removeItem("user"); // Xóa user nếu không tìm thấy
      }
    } catch (error) {
      setUser(null);
      setEmail(null);
      localStorage.removeItem("user"); // Xóa user nếu có lỗi
    }
  };

  useEffect(() => {
    // Khôi phục trạng thái người dùng từ localStorage khi ứng dụng tải lại
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setEmail(userData.email);
    }

    if (token) {
      fetchUserData(token); // Nếu có token, fetch thông tin người dùng
    } else {
      setUser(null); // Nếu không có token, đảm bảo không có thông tin người dùng
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const newToken = response.data.token;
        Cookies.set("access_token", newToken, { expires: 1 }); // Lưu token vào cookies
        await fetchUserData(newToken); // Cập nhật thông tin người dùng sau khi đăng nhập
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setEmail(null);
    Cookies.remove("access_token"); // Xóa token khi đăng xuất
    localStorage.removeItem("user"); // Xóa thông tin người dùng khỏi localStorage
  };

  return (
    <UserContext.Provider value={{ user, email, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUserContext };
