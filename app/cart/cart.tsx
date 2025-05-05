"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useUserContext } from "../context/context";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

export default function CartTable() {
  const { user, logout } = useUserContext();
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const userId = user?.id; // Lấy id_user từ thông tin người dùng

  // 🛒 Lấy dữ liệu giỏ hàng từ API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/carts/${userId}`
        );
        const data = await response.json();
        console.log("Dữ liệu giỏ hàng:", data);

        const parsedCart = data.cartItems.map((item: CartItem) => ({
          ...item,
          images:
            typeof item.images === "string"
              ? JSON.parse(item.images)
              : item.images,
        }));

        setCart(parsedCart || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
      }
    };

    fetchCartData();
  }, [userId]);

  // 🛠️ Cập nhật số lượng sản phẩm
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      alert("Số lượng không thể nhỏ hơn 1!");
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // ❌ Xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (id: number) => {
    try {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cart_item: id }),
      });
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
    }
  };

  // 🏷️ Tính tổng tiền
  const totalAmount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  // 🛒 Xử lý cập nhật giỏ hàng
  const handleUpdateCart = async () => {
    try {
      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cart }), // Gửi toàn bộ giỏ hàng lên API
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Giỏ hàng đã được cập nhật!");
      } else {
        alert(data.message || "Lỗi khi cập nhật giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      alert("Không thể cập nhật giỏ hàng. Vui lòng thử lại!");
    }
  };
  // 🛒 Xử lý thanh toán
  const handleCheckout = () => {
    router.push("/payments"); // Chuyển hướng đến trang thanh toán
  };

  if (!user) {
    return <p className="text-center py-10">Đang tải thông tin...</p>;
  }

  return (
    <div className="p-6 grid grid-cols-4 gap-6">
      {/* 🛒 Sidebar */}
      <div className="col-span-1 shadow-md p-6">
        <div className="p-4 flex flex-col items-center lg:items-start">
          <h2 className="text-lg font-semibold text-center lg:text-left">
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
      </div>

      {/* 🛒 Bảng giỏ hàng */}
      <div className="container col-span-3 shadow-md rounded-lg p-6">
        <h2 className="text-4xl font-bold mb-4">🛒 Giỏ hàng</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Tổng</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : "/fallback-image.jpg"
                      }
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {Number(item.price).toLocaleString("vi-VN")} VNĐ
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    className="w-16 px-2 py-1 border rounded-md"
                  />
                </TableCell>
                <TableCell>
                  {Number(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">
                Tổng cộng
              </TableCell>
              <TableCell>
                {Number(totalAmount).toLocaleString("vi-VN")} VNĐ
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Nút Cập nhật giỏ hàng và Thanh toán */}
        <div className="flex justify-between mt-6">
          <Button
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
            onClick={handleUpdateCart}
          >
            Cập nhật giỏ hàng
          </Button>
          <Button
            className="bg-green-600 text-white px-6 py-2 rounded-md"
            onClick={handleCheckout}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
