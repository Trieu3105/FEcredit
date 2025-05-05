import SidebarMenu from "../../components/sidebar";

const products = [
  {
    id: 1,
    name: "Laptop Gaming ASUS ROG",
    price: "25.990.000đ",
    image:
      "https://img.freepik.com/free-photo/laptop-keyboard-glowing-dark_23-2149901738.jpg",
  },
  {
    id: 2,
    name: "Bàn phím cơ RGB",
    price: "2.490.000đ",
    image:
      "https://img.freepik.com/free-photo/backlit-gaming-keyboard_23-2149870724.jpg",
  },
  {
    id: 3,
    name: "Chuột không dây Logitech",
    price: "990.000đ",
    image:
      "https://img.freepik.com/free-photo/computer-mouse-black-background_23-2149870730.jpg",
  },
  {
    id: 4,
    name: "Màn hình LG UltraGear 27'",
    price: "7.890.000đ",
    image:
      "https://img.freepik.com/free-photo/digital-device-dark-background_23-2149870725.jpg",
  },
];

export default function Laptop() {
  return (
    <div className="flex gap-4 bg-cover backdrop-blur-lg bg-[url('https://img.freepik.com/free-photo/futuristic-moon-background_23-2150930798.jpg')]">
      <div className="absolute inset-0 backdrop-blur-lg"></div>
      <div className="relative flex gap-4 w-full p-4 text-white">
        {/* Sidebar */}
        <SidebarMenu />

        {/* Danh sách sản phẩm */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id}>
              <a
                className="bg-gray-900 p-4 rounded-xl shadow-lg h-[320px] flex flex-col justify-between hover:bg-gray-800 "
                href=""
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[150px] object-cover rounded-md"
                />
                <span className="text-md font-bold">{product.name}</span>
                <p className="text-yellow-400 text-lg font-semibold">
                  {product.price}
                </p>
                <button className="mt-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Mua ngay
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
