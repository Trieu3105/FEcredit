"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SidebarMenu from "../components/sidebar";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
} from "swiper/modules";
import { useUserContext } from "../context/context";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  id_category: number;
}

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slides, setSlides] = useState<
    { id: number; images: string[]; name: string; url: string }[]
  >([]);

  const { user } = useUserContext();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          {
            params: { parent_id: selectedCategoryId }, // Gửi parent_id đến backend
          }
        );
        if (
          response.data.success &&
          Array.isArray(response.data.data.products)
        ) {
          setProducts(response.data.data.products); // Ensure products is an array
          setFilteredProducts(response.data.data.products); // Ensure filteredProducts is an array
        } else {
          console.error("Invalid products data:", response.data);
          setProducts([]); // Fallback to an empty array
          setFilteredProducts([]); // Fallback to an empty array
          setError("Không thể lấy dữ liệu sản phẩm.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Lỗi khi kết nối đến API.");
        setProducts([]); // Fallback to an empty array
        setFilteredProducts([]); // Fallback to an empty array
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSlides(data.slideshow);
          console.log("Slides data:", data.slideshow); // Debugging: Log the slides data
        }
      })
      .catch((error) => console.error("Lỗi không lấy được data media:", error));
  }, []);

  const handleAddToCart = async (id_product: number) => {
    const id_user = user?.id || localStorage.getItem("id_user");

    if (!id_user) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user, id_product, quantity: 1 }),
        }
      );

      const data = await response.json();
      alert(data.message || "Thêm giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm giỏ hàng:", error);
      alert("Lỗi khi thêm giỏ hàng!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:mx-16">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-4">
        <SidebarMenu onSelectCategory={setSelectedCategoryId} />
      </div>

      {/* Content */}
      <div className="w-full lg:w-3/4 p-4">
        {/* Slideshow */}
        <div className="mb-6">
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            slidesPerView={1}
            className="w-full rounded-lg overflow-hidden"
            style={{ height: "clamp(200px, 40vw, 486px)" }} // responsive height
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <img
                  src={slide.images[0] || "/fallback-image.jpg"}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading && (
            <p className="text-center col-span-full">Đang tải dữ liệu...</p>
          )}
          {error && (
            <p className="text-center col-span-full text-red-500">{error}</p>
          )}
          {!loading &&
            !error &&
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-lg shadow-md hover:border-gray-500 transition-transform duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-between h-full cursor-default bg-white dark:bg-gray-900"
              >
                <div className="relative w-full h-40 sm:h-48 md:h-52 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.images[0] || "/fallback-image.jpg"}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) =>
                      (e.currentTarget.src = "/fallback-image.jpg")
                    }
                  />
                </div>
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-left text-black dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-300 font-semibold text-left">
                      {Number(product.price).toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    <Button
                      className="w-full text-sm sm:text-base hover:bg-blue-600 dark:text-white"
                      onClick={() =>
                        (window.location.href = `/product/productdetail?id=${product.id}`)
                      }
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      className="w-full text-sm sm:text-base hover:bg-blue-600 dark:text-white"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
