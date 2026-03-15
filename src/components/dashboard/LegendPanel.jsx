import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import RabbinateClock from "./RabbinateClock";
import { extractHex, toRgba } from "./colorUtils";

export default function LegendPanel({
  emblemUrl,
  categories = [],
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  canEdit = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-[32px] border border-white/75 bg-white/75 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl flex flex-col gap-4"
      dir="rtl"
    >
      <div className="flex flex-col gap-2">
        {categories.map((item, i) => {
          const colorHex = extractHex(item.color) || "#A8A8A8";
          return (
          <div key={i} className="flex items-center gap-1.5 group">
            <div className="flex-1 rounded-xl border border-white/60 bg-[#F8F6F3] px-2.5 py-2 flex items-center shadow-sm min-w-0">
              <span
                className="text-xs font-medium text-[#122033] truncate rounded-lg px-2.5 py-1"
                style={{ backgroundColor: toRgba(colorHex, 0.22) }}
              >
                {item.label}
              </span>
            </div>
            {canEdit && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => onEditCategory && onEditCategory(item)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="h-3 w-3 text-[#8C7D6B]" />
                </button>
                <button
                  onClick={() => onDeleteCategory && onDeleteCategory(item)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3 w-3 text-red-400" />
                </button>
              </div>
            )}
          </div>
        );
        })}

        {canEdit && (
          <button
            onClick={onAddCategory}
            className="flex items-center justify-center gap-2 mt-1 rounded-xl border border-dashed border-[#8C7D6B]/20 bg-[#FAF9F7] py-2.5 text-xs text-[#8C7D6B] hover:text-[#1A1A1A] hover:bg-white transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            {"\u05D4\u05D5\u05E1\u05E4\u05EA \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05D7\u05D3\u05E9\u05D4"}
          </button>
        )}
      </div>

      <RabbinateClock imageUrl={emblemUrl} />
    </motion.div>
  );
}
