"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useUserContext } from "@/app/context/context";// Giả sử bạn đã có context để lấy thông tin người dùng

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  stock: number;
}

export default function Productdetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("Grey");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const { user } = useUserContext(); // Lấy thông tin người dùng từ context
  const searchParams = useSearchParams();
  const productId = searchParams.get("id"); // Lấy ID sản phẩm từ URL

  useEffect(() => {
    if (!productId) {
      setError("Không tìm thấy sản phẩm.");
      setLoading(false);
      return;
    }

    // Gọi API để lấy thông tin chi tiết sản phẩm
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`)
      .then((response) => {
        if (response.data.success) {
          const productData = response.data.data;
          setProduct(productData);
          setMainImage(productData.images[0] || "/fallback-image.jpg");
          setSelectedSpec(Object.keys(productData.specifications)[0] || "");
        } else {
          setError("Không thể lấy thông tin sản phẩm.");
        }
      })
      .catch(() => setError("Lỗi khi kết nối đến API."))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return <p className="text-center py-10">Đang tải thông tin sản phẩm...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!product) {
    return <p className="text-center text-lg">Không tìm thấy sản phẩm.</p>;
  }
  const handleAddToCart = async (id_product: number) => {
    const id_user = user?.id || localStorage.getItem("id_user");

    if (!id_user) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      window.location.href = "/login";
      return;
    }

    const quantity = 1;

    try {
      const response = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user, id_product, quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        alert(data.message || "Lỗi khi thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={mainImage|| "/fallback-image.jpg"}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {/* Hiển thị tất cả các ảnh */}
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)} // Đặt ảnh được chọn làm ảnh chính
                className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
                  mainImage === img ? "ring-2 ring-black" : ""
                }`}
              >
                <img
                  src={img} // Hiển thị từng ảnh trong danh sách
                  alt={`${product.name} - ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold ">{product.name}</h1>
            <p className="text-3xl font-bold mt-2 ">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </p>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Color Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Color</h2>
            <RadioGroup
              defaultValue={selectedColor}
              onValueChange={setSelectedColor}
              className="flex flex-wrap gap-4"
            >
              {["Grey", "Space Grey", "Black", "White"].map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={color}
                    id={color}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={color}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <div
                      className={`w-6 h-6 rounded-full bg-gray-500 ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-black"
                          : ""
                      }`}
                    />
                    <span>{color}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Specification Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select specification</h2>
            <div className="p-4 rounded-lg border border-gray-200 shadow-sm">
              <ul className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold capitalize">
                      {key}:
                    </span>
                    <span className="text-gray-600 font-medium">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <Button
              className="flex-1 h-12"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={isWishlisted ? "fill-current" : ""}
                aria-label="Add to wishlist"
              />
            </Button>
          </div>

          <Card className="p-4 mt-6">
            <p className="text-sm text-gray-600">
              Stock:{" "}
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
