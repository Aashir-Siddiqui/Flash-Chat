import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  { id: 0, class: "bg-teal-500", hex: "#14B8A6" }, // ✅ Main app color
  { id: 1, class: "bg-cyan-500", hex: "#06B6D4" }, // 🔵 Cool blue-green
  { id: 2, class: "bg-indigo-500", hex: "#6366F1" }, // 🔵 Deep blue
  { id: 3, class: "bg-violet-500", hex: "#8B5CF6" }, // 🟣 Rich purple
  { id: 4, class: "bg-fuchsia-500", hex: "#D946EF" }, // 🟣 Bright magenta
  { id: 5, class: "bg-rose-500", hex: "#F43F5E" }, // 🔴 Modern red
  { id: 6, class: "bg-orange-500", hex: "#F97316" }, // 🟠 Warm orange
  { id: 7, class: "bg-amber-500", hex: "#F59E0B" }, // 🟡 Golden yellow
];

// ✅ Color ID se hex value return karta hai
export const getColor = (colorId) => {
  const color = colors.find((c) => c.id === colorId);
  return color ? color.hex : colors[0].hex;
};
