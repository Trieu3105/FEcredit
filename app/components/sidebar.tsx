"use client";

import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface SidebarMenuProps {
  onSelectCategory: (parentId: number | null) => void; // Gửi parent_id thay vì id
}

export default function SidebarMenu({ onSelectCategory }: SidebarMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Add state for selected category

  const handleSelectCategory = (id: number | null) => {
    setSelectedCategory(id);
    onSelectCategory(id); // giữ nguyên logic gốc
  };

  useEffect(() => {
    fetch("${process.env.NEXT_PUBLIC_API_URL}/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
          console.log("Categories:", data.data);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  return (
   <div className={`p-4 space-y-2 rounded-md shadow-md  dark:bg-gray-900 w-64`}>
  {/* Tiêu đề */}
  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Danh mục</h2>

  {/* Nút tất cả sản phẩm */}
  <button
    className={`flex items-center w-full px-4 py-2 rounded-md text-base font-semibold
      ${
        selectedCategory === null
          ? 'bg-red-500 text-white'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    `}
    onClick={() => onSelectCategory(null)}
  >
    <span className="ml-2">Tất cả sản phẩm</span>
  </button>

  {/* Danh sách danh mục */}
  {categories.map((cat) => (
    <button
      key={cat.id}
      className={`flex items-center w-full px-4 py-2 rounded-md text-base font-medium transition
        ${
          selectedCategory === cat.parent_id
            ? 'bg-red-500 text-white'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
      onClick={() => {
        console.log("parent_id gửi đi:", cat.parent_id);
        onSelectCategory(cat.parent_id);
      }}
    >
      <span className="ml-2">{cat.name}</span>
    </button>
  ))}
</div>

  );
}
