import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  { id: 0, class: "bg-green-500", hex: "#22C55E" },
  { id: 1, class: "bg-blue-500", hex: "#3B82F6" },
  { id: 2, class: "bg-yellow-500", hex: "#F59E0B" },
  { id: 3, class: "bg-purple-500", hex: "#A855F7" },
  { id: 4, class: "bg-pink-500", hex: "#EC4899" },
  { id: 5, class: "bg-red-500", hex: "#EF4444" },
  { id: 6, class: "bg-indigo-500", hex: "#6366F1" },
  { id: 7, class: "bg-teal-500", hex: "#14B8A6" },
];

// ✅ Color ID se hex value return karta hai
export const getColor = (colorId) => {
  const color = colors.find((c) => c.id === colorId);
  return color ? color.hex : colors[0].hex;
};
