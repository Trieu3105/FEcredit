import { useEffect, useState } from "react";
import SidebarMenu from "../../components/sidebar";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState<
    {
      id: number;
      name: string;
      price: number;
      images: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((response) => {
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          setError("Không thể lấy dữ liệu sản phẩm.");
        }
      })
      .catch((err) => setError("Lỗi khi kết nối đến API."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="products flex gap-4 bg-cover backdrop-blur-lg">
      <div className="absolute inset-0 backdrop-blur-lg"></div>
      <div className="relative flex gap-4 w-full p-4 text-white">
        {/* Sidebar */}

        {/* Danh sách sản phẩm */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {loading && (
            <p className="text-center text-lg">Đang tải dữ liệu...</p>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-lg">Không có sản phẩm nào.</p>
          )}
          {!loading &&
            !error &&
            products.map((product) => (
              <div key={product.id}>
                <a
                  className="p-4 rounded-xl shadow-lg flex flex-col justify-between hover:bg-gray-800 hover:scale-105 transition duration-300 w-full max-w-sm sm:max-w-md mx-auto"
                  href={`/product/productdetail?id=${product.id}`} // Thêm id sản phẩm vào URL
                >
                  {/* Hình ảnh sản phẩm */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-gray-700">
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

                  {/* Nội dung sản phẩm */}
                  <div className="flex flex-col items-center mt-3 space-y-2 flex-1">
                    <span className="text-md font-bold line-clamp-2 h-[48px]">
                      {product.name}
                    </span>
                    <p className="text-yellow-400 text-lg font-semibold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </p>
                  </div>
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
