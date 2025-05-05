"use client";

import { useState, useEffect } from "react";

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
  logo: string;
}

export default function Create() {
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
    images: [], // Accept plain string for images
    specifications: "{}",
    warranty: "",
  });

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

  const handleEdit = (product: product) => {
    setEditingProduct(product);
  };

  const handleSave = () => {
    if (editingProduct) {
      fetch(`http://localhost:8080/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      })
        .then((res) => res.json())
        .then(() => {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
          );
          setEditingProduct(null);
        });
    }
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

    console.log("Sending product data to API:", newProduct); // Debugging: Log the product data being sent

    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct), // Send images as plain string
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
    <main>
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(() => {
          const inputClass =
            "mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  
          const labelClass = "text-gray-700 font-medium";
  
          return (
            <>
              <label className="block">
                <span className={labelClass}>Product Name:</span>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className={inputClass}
                />
              </label>
  
              <label className="block">
                <span className={labelClass}>Category:</span>
                <select
                  value={newProduct.id_category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, id_category: parseInt(e.target.value, 10) })
                  }
                  className={inputClass}
                >
                  <option value={0}>Select Category</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
  
              <label className="block">
                <span className={labelClass}>Brand:</span>
                <select
                  value={newProduct.id_brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, id_brand: parseInt(e.target.value, 10) })
                  }
                  className={inputClass}
                >
                  <option value={0}>Select Brand</option>
                  {brands.map((brand: any) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
  
              <label className="block">
                <span className={labelClass}>Price:</span>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                  }
                  className={inputClass}
                />
              </label>
  
              <label className="block">
                <span className={labelClass}>Stock:</span>
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })
                  }
                  className={inputClass}
                />
              </label>
  
              <label className="block">
                <span className={labelClass}>Discount (Optional):</span>
                <input
                  type="number"
                  placeholder="Enter discount (%)"
                  value={newProduct.discount || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discount: parseFloat(e.target.value) || 0 })
                  }
                  className={inputClass}
                />
              </label>
  
              <label className="block">
                <span className={labelClass}>Warranty (Optional):</span>
                <input
                  type="text"
                  placeholder="Warranty details"
                  value={newProduct.warranty || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                  className={inputClass}
                />
              </label>
  
              <label className="block">
                <span className={labelClass}>Description (Optional):</span>
                <textarea
                  placeholder="Enter product description"
                  value={newProduct.description || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  className={`${inputClass} min-h-[100px] resize-none`}
                />
              </label>
  
              <label className="block">
                <span className={labelClass}>Specifications (*)</span>
                <textarea
                  placeholder='E.g. {"cpu": "Apple M2", "ram": "16GB"}'
                  value={newProduct.specifications || "{}"}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, specifications: e.target.value })
                  }
                  className={`${inputClass} min-h-[100px] resize-none`}
                />
              </label>
  
              <label className="block lg:col-span-3">
                <span className={labelClass}>Images (Optional):</span>
                <textarea
                  placeholder="Image URLs (comma separated)"
                  value={Array.isArray(newProduct.images) ? newProduct.images.join(", ") : ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      images: e.target.value.split(",").map((img) => img.trim()),
                    })
                  }
                  className={`${inputClass} min-h-[100px] resize-none`}
                />
              </label>
            </>
          );
        })()}
      </div>
  
      <div className="flex justify-center md:justify-end mt-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow"
          onClick={handleCreate}
        >
          Thêm sản phẩm
        </button>
      </div>
    </div>
  </main>
  
  );
}
