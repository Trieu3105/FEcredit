"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface SidebarMenuProps {
  onSelectCategory: (parentId: number | null) => void;
}

export default function SidebarMenu({ onSelectCategory }: SidebarMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectCategory = (id: number | null) => {
    setSelectedCategory(id);
    onSelectCategory(id);
    setShowDropdown(false);
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden sm:block p-4 space-y-2 rounded-md shadow-md dark:bg-gray-900 bg-white w-64 max-h-[80vh] overflow-y-auto sticky top-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Danh mục</h2>
        <button
          className={`flex items-center w-full px-4 py-2 rounded-md text-base font-semibold transition ${
            selectedCategory === null
              ? "bg-red-500 text-white"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          onClick={() => handleSelectCategory(null)}
        >
          <span className="ml-2">Tất cả sản phẩm</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`flex items-center w-full px-4 py-2 rounded-md text-base font-medium transition ${
              selectedCategory === cat.parent_id
                ? "bg-red-500 text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => handleSelectCategory(cat.parent_id)}
          >
            <span className="ml-2">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden px-4">
        <button
          className="w-full flex justify-between items-center px-4 py-3 bg-red-500 text-white rounded-md font-bold"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Danh mục
          {showDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              key="dropdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-2 rounded-md shadow-md bg-white dark:bg-gray-900 p-4 space-y-2"
            >
              <button
                className={`flex items-center w-full px-4 py-2 rounded-md text-base font-semibold transition ${
                  selectedCategory === null
                    ? "bg-red-500 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleSelectCategory(null)}
              >
                <span className="ml-2">Tất cả sản phẩm</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex items-center w-full px-4 py-2 rounded-md text-base font-medium transition ${
                    selectedCategory === cat.parent_id
                      ? "bg-red-500 text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSelectCategory(cat.parent_id)}
                >
                  <span className="ml-2">{cat.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
