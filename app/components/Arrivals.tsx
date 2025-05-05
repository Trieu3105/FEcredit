import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Navigation,
  Pagination,
  EffectCoverflow,
  Autoplay,
} from "swiper/modules";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [products, setProducts] = useState<
    {
      id: number;
      name: string;
      price: number;
      images: string[];
      brand: { name: string };
    }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm
    fetch("${process.env.NEXT_PUBLIC_API_URL}/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data.products)) {
          setProducts(data.data.products); // Lưu danh sách sản phẩm vào state
        } else {
          console.error("Invalid products data:", data);
          setProducts([]); // Đảm bảo products luôn là một mảng
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]); // Đảm bảo products luôn là một mảng
      });
  }, []);

  return (
    <main >
      {/* New Arrivals */}
        <h2 className="text-5xl font-bold text-center mb-4 text-gray-900">Sản Phẩm Mới!!</h2>
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={2}
          spaceBetween={30}
          loop={products.length >= 2}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 4,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          navigation
          className="mx-auto h-72 bgimage border-2 rounded-xl"
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <Card className="bg-black border-gray-800 overflow-hidden group cursor-pointer ">
                <div className="relative h-72">
                  <img
                    src={product.images[0] || "/fallback-image.jpg"}
                    alt={product.name}
                    className="w-full h-72 object-cover transition-transform group-hover:scale-105"
                  />

                  {/* Hiển thị thông tin chỉ khi là slide active */}
                  {index === activeIndex && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 transition-opacity duration-300">
                      <div>
                        <h3 className="text-md text-gray-300 font-bold mb-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-300">
                          {Number(product.price).toLocaleString("vi-VN")} VNĐ
                        </p>
                        <p className="text-sm text-gray-400">
                          Brand: {product.brand.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
    </main>
  );
}
