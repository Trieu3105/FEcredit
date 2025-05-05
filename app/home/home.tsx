/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Phone,
  Shield,
  Truck,
  Search,
  ShoppingCart,
  User,
  Menu,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Arrivals from "../components/Arrivals";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper"; // Import Swiper class
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectFlip,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Home() {
  const [slides, setSlides] = useState<
    { id: number; images: string[]; name: string; url: string }[]
  >([]);
  const [introData, setIntroData] = useState<
    { id: number; images: string[]; name: string; description: string }[]
  >([]); // Đổi từ null sang mảng rỗng

  const [currentIntroIndex, setCurrentIntroIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null); // Ref for Swiper instance
  const fadeLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  useEffect(() => {
    // Gọi API để lấy dữ liệu slideshow và intro
    fetch("http://localhost:8080/api/media")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSlides(data.slideshow); // Lưu dữ liệu slideshow
          if (data.intro.length > 0) {
            setIntroData(data.intro); // Lưu dữ liệu intro
            console.log("check du lieu", data.intro);
          }
        }
      })
      .catch((error) => console.error("Error fetching media data:", error));
  }, []);
  useEffect(() => {
    const startTransition = () => {
      intervalRef.current = setTimeout(() => {
        setCurrentIntroIndex((prevIndex) => (prevIndex + 1) % introData.length);
        startTransition(); // Gọi lại để tiếp tục chuyển đổi
      }, 5000); // 5 giây
    };

    if (introData.length > 1) {
      startTransition(); // Bắt đầu chuyển đổi
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current); // Dọn dẹp timeout khi component unmount
    };
  }, [introData]);

  const handleMouseEnter = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop(); // Stop autoplay on hover
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.start(); // Resume autoplay on mouse leave
    }
  };

  return (
    <main className="min-h-screen text-gray-400">
      <section className="relative w-full h-[80vh] sm:h-[90vh] md:h-screen border-b pt-16 bg-black border-gray-800 overflow-hidden">
        {slides.length > 0 ? (
          <Swiper
            modules={[Autoplay, EffectFade]}
            // navigation
            // pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            effect="fade"
            loop={true}
            className="relative w-full h-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className="relative w-full h-full">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.images[0]}
                    alt={slide.name}
                    className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/80" />
                </div>

                {/* Slide Content */}
                <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8 text-center">
                  <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-md mb-6">
                      {slide.name}
                    </h1>
                    <Button
                      className="bg-white text-black hover:bg-gray-200 px-6 py-3 text-sm md:text-base"
                      onClick={() => (window.location.href = slide.url)}
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-lg text-white">
            Đang tải slideshow...
          </p>
        )}
      </section>
      {/* Intro sản phẩm */}
      <section
        className="relative py-4 border-b border-gray-700"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeLeft}
            className="text-left border-b border-gray-700 pb-4 mb-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              Những Sản Phẩm Nổi Bật
            </h1>
            <h2 className="text-2xl sm:text-3xl text-gray-800 mt-2">
              và bán chạy nhất trong năm
            </h2>
          </motion.div>

          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={2000} // Thời gian chuyển đổi giữa các slide
            loop={true}
            className="relative w-full"
            onSwiper={(swiper) => (swiperRef.current = swiper)} // Capture Swiper instance
          >
            {introData.map((intro, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Mô tả sản phẩm */}
                  <div className="lg:w-2/5 text-base sm:text-lg max-h-[486px] overflow-y-auto mx-2 pr-2 custom-scrollbar">
                    <h2 className="text-6xl md:text-5xl font-bold text-gray-800 stroke-text mb-4 font-sans">
                      {intro.name || "Đang tải..."}
                    </h2>

                    {intro.description ? (
                      (() => {
                        try {
                          const parsed = JSON.parse(intro.description);
                          return Object.entries(parsed).map(
                            ([key, value], idx) => (
                              <div key={idx} className="mb-4">
                                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                  {key}
                                </h3>
                                {Array.isArray(value) ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    {value.map((item, i) => (
                                      <li key={i}>{item}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>{String(value)}</p>
                                )}
                              </div>
                            )
                          );
                        } catch (error) {
                          return (
                            <p className="text-red-500">
                              Lỗi định dạng mô tả sản phẩm.
                            </p>
                          );
                        }
                      })()
                    ) : (
                      <p className="text-gray-400">Không có mô tả.</p>
                    )}
                  </div>

                  {/* Ảnh sản phẩm */}
                  <div className="lg:w-3/5 relative h-[300px] md:h-[400px] lg:h-[486px]">
                    <img
                      src={intro.images?.[0] || "/fallback-image.jpg"}
                      alt="Intro Product"
                      className="w-full h-full object-cover rounded-xl shadow-xl transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* New Arrivals */}
      <section className="py-4 px-4 mx-16">
        <Arrivals />
      </section>
      {/* Features Section */}
      <section className="py-16 px-4 ">
        <h2 className="text-4xl font-bold text-center text-[#D4A753] mb-12">
          FEATURES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105">
            <Truck className="w-12 h-12 text-[#D4A753] mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-300">
              Free shipping on all premium devices with express delivery
              options.
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105">
            <Shield className="w-12 h-12 text-[#D4A753] mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">Warranty</h3>
            <p className="text-gray-300">
              Extended warranty coverage with premium device protection plans.
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-gray-800 to-black p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105">
            <Phone className="w-12 h-12 text-[#D4A753] mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-300">
              Dedicated customer support team available round the clock.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}
