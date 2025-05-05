"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react"; // Import Dialog for modal functionality
import Create from "./create";
import { Link } from "lucide-react";
import EditProduct from "./EditProduct";

interface product {
  id: number;
  name: string;
  id_category: number;
  id_brand: number;
  discount: number;
  description: string;
  images: string[];
  specifications: string;
  warranty: string;
  price: number;
  stock: number;
  brand?: { name: string };
  category?: { name: string };
}

export default function ProductManagement() {
  const [products, setProducts] = useState<product[]>([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editingProduct, setEditingProduct] = useState<product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<product>>({
    name: "",
    id_category: 0,
    id_brand: 0,
    price: 0,
    stock: 0,
    discount: 0,
    description: "",
    images: [],
    specifications: "{}",
    warranty: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Fetch products, categories, and brands in a single API call
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data.products || []);
        setCategories(data.data.categories || []);
        setBrands(data.data.brands || []);
      });
  }, []);

  const handleSave = (updatedProduct: product) => {
    fetch(`http://localhost:8080/api/products/${updatedProduct.id}`, {
      method: "PUT", // Specify the correct HTTP method
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then(() => {
        setProducts((prev) =>
          prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setEditingProduct(null);
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("An error occurred while updating the product.");
      });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        });
    }
  };

  const handleCreate = () => {
    // Validate required fields
    if (
      !newProduct.name ||
      !newProduct.id_category ||
      !newProduct.id_brand ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Sending product data to API:", {
      ...newProduct,
      specifications: JSON.parse(newProduct.specifications || "{}"),
      images: JSON.parse(JSON.stringify(newProduct.images || "[]")),
    }); // Debugging: Log the product data being sent

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProduct,
        specifications: JSON.parse(newProduct.specifications || "{}"),
        images: JSON.parse(typeof newProduct.images === "string" ? newProduct.images : "[]"),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API response:", data); // Debugging: Log the API response
        if (data.success) {
          setProducts((prev) => [
            ...prev,
            { ...newProduct, id: data.id } as product,
          ]);
          setNewProduct({
            name: "",
            id_category: 0,
            id_brand: 0,
            price: 0,
            stock: 0,
            discount: 0,
            description: "",
            images: [],
            specifications: "{}",
            warranty: "",
          });
          alert("Product added successfully!");
        } else {
          console.error("API error response:", data);
          alert("Failed to add product: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error adding product:", error); // Log the error for debugging
        alert(
          "An error occurred while adding the product. Please check the console for details."
        );
      });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <span className="text-lg">+</span> Thêm sản phẩm
        </button>
      </div>

      {/* Modal thêm sản phẩm */}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl mx-4 z-50 overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-xl font-semibold mb-4 text-center">
            Thêm sản phẩm mới
          </Dialog.Title>
          <Create />
          <div className="flex justify-end mt-6">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </Dialog>

      {/* Bảng sản phẩm */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Hình ảnh</th>
              <th className="p-4 text-left">Tên</th>
              <th className="p-4 text-left">Thương hiệu</th>
              <th className="p-4 text-left">Danh mục</th>
              <th className="p-4 text-left">Giá</th>
              <th className="p-4 text-left">Kho</th>
              <th className="p-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50 transition duration-200"
              >
                <td className="p-4 w-28 h-28">
                  <img
                    src={product.images[0] || "/fallback-image.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) =>
                      (e.currentTarget.src = "/fallback-image.jpg")
                    }
                  />
                </td>
                <td className="p-4 text-gray-800">{product.name}</td>
                <td className="p-4 text-gray-600">
                  {product.brand?.name || "N/A"}
                </td>
                <td className="p-4 text-gray-600">
                  {product.category?.name || "N/A"}
                </td>
                <td className="p-4 text-blue-600 font-semibold">
                  {Number(product.price).toLocaleString("vi-VN")} ₫
                </td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 flex items-center gap-2">
                  <button
                    className="text-blue-600 hover:underline flex items-center gap-1"
                    onClick={() => setEditingProduct(product)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="text-red-600 hover:underline flex items-center gap-1"
                    onClick={() => {
                      if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
                        handleDelete(product.id);
                      }
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chỉnh sửa sản phẩm */}
      {editingProduct && (
        <EditProduct
          product={editingProduct}
          categories={categories}
          brands={brands}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
