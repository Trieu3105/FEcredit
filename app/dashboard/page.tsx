"use client";

import { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Menu as IconMenu, X as IconX } from "lucide-react";
import ProductManagement from "./components/ProductManagement";

const sections = [
  "Product Management",
  "Order Management",
  "Customer Management",
  "Payment Management",
  "Reports & Statistics",
  "Discount Management",
  "System Management",
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState(sections[0]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Mobile Sidebar Toggle */}
      <Disclosure as="nav" className="md:hidden bg-secondary shadow-md">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-lg font-semibold">Dashboard</span>
              <Disclosure.Button className="p-2 rounded-md hover:bg-accent/30 transition">
                {open ? (
                  <IconX className="w-6 h-6" />
                ) : (
                  <IconMenu className="w-6 h-6" />
                )}
              </Disclosure.Button>
            </div>

            <Disclosure.Panel className="flex flex-col divide-y divide-muted border-t border-muted bg-secondary">
              {sections.map((section) => (
                <Disclosure.Button
                  key={section}
                  as="div"
                  className={`px-4 py-3 text-sm cursor-pointer transition ${
                    activeSection === section
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </Disclosure.Button>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-muted bg-secondary text-secondary-foreground shadow-md">
        <div className="px-6 py-4 text-xl font-semibold border-b border-muted">
          Admin Dashboard
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1">
            {sections.map((section) => (
              <li
                key={section}
                className={`px-6 py-3 text-sm cursor-pointer rounded-r-full transition-all duration-200 ${
                  activeSection === section
                    ? "bg-accent text-accent-foreground font-medium shadow-inner"
                    : "hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{activeSection}</h1>

        {activeSection === "Product Management" && <ProductManagement />}
        {/* Các section khác giữ nguyên */}
      </main>
    </div>
  );
}
