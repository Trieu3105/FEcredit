"use client";

import { useState, useEffect } from "react";

interface Product {
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
}

interface EditProductProps {
  product: Product;
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export default function EditProduct({
  product,
  categories,
  brands,
  onClose,
  onSave,
}: EditProductProps) {
  const [editedProduct, setEditedProduct] = useState<Product>({ ...product });
  const [imagesInput, setImagesInput] = useState<string>(
    product.images.join(", ")
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSave = async () => {
    try {
      const updatedProduct = {
        ...editedProduct,
        images: imagesInput.split(",").map((url) => url.trim()), // Convert images input to JSON
      };

      const response = await fetch(
        `http://localhost:8080/api/products/${product.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.success) {
        onSave(updatedProduct); // Update the product in the parent component
        onClose(); // Close the modal
        alert("Product updated successfully!");
      } else {
        alert("Failed to update the product. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      alert(
        "An error occurred while updating the product. Please check the console for details."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl transform transition-all duration-200">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={editedProduct.name}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Category
            </label>
            <select
              value={editedProduct.id_category || 0} // Default to the first category or 0
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  id_category: parseInt(e.target.value, 10),
                })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option disabled value={0}>
                -- Select Category --
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Brand
            </label>
            <select
              value={editedProduct.id_brand || 0} // Default to the first brand or 0
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  id_brand: parseInt(e.target.value, 10),
                })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option disabled value={0}>
                -- Select Brand --
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Images (URLs)
            </label>
            <input
              type="text"
              value={imagesInput}
              onChange={(e) => setImagesInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={editedProduct.price}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Stock
            </label>
            <input
              type="number"
              value={editedProduct.stock}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  stock: parseInt(e.target.value, 10),
                })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Discount
            </label>
            <input
              type="number"
              value={editedProduct.discount}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  discount: parseFloat(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Description
          </label>
          <textarea
            value={editedProduct.description}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                description: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-md p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
