import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { clampColor, extractHex, hexToRgb, rgbToHex } from "./colorUtils";

const DEFAULT_COLOR = "#C4A882";

function normalizeLabel(label) {
  return label.trim().replace(/\s+/g, " ");
}

function slugify(label) {
  const base = normalizeLabel(label)
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05FF ]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 48);
  return base || `category_${Date.now()}`;
}

export default function CategoryEditor({
  onClose,
  onCreate,
  onUpdate,
  existingCategories = [],
  initialCategory = null,
}) {
  const [label, setLabel] = useState(initialCategory?.label || "");
  const [rgb, setRgb] = useState(() => {
    const hex = extractHex(initialCategory?.color) || DEFAULT_COLOR;
    return hexToRgb(hex) || { r: 196, g: 168, b: 130 };
  });

  const cleanedLabel = useMemo(() => normalizeLabel(label), [label]);
  const isDuplicateLabel = existingCategories.some((category) => {
    if (initialCategory && category.value === initialCategory.value) return false;
    return normalizeLabel(category.label).toLowerCase() === cleanedLabel.toLowerCase();
  });

  const colorHex = rgbToHex(rgb.r, rgb.g, rgb.b);

  const handleColorChange = (value) => {
    const next = hexToRgb(value);
    if (!next) return;
    setRgb({
      r: clampColor(next.r),
      g: clampColor(next.g),
      b: clampColor(next.b),
    });
  };

  const handleSubmit = () => {
    if (!cleanedLabel || isDuplicateLabel) return;
    if (initialCategory) {
      if (onUpdate) {
        onUpdate({
          ...initialCategory,
          label: cleanedLabel,
          color: colorHex,
        });
      }
    } else if (onCreate) {
      onCreate({
        label: cleanedLabel,
        value: slugify(cleanedLabel),
        color: colorHex,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#122033]/30 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,246,243,0.98))] shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#8C7D6B]/10 bg-white/65 backdrop-blur-md">
          <div>
            <p className="text-xs text-[#8C7D6B] tracking-[0.2em] uppercase mb-1">
              {"\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4"}
            </p>
            <h2 className="text-lg font-bold text-[#122033]">
              {initialCategory
                ? "\u05E2\u05E8\u05D9\u05DB\u05EA \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4"
                : "\u05D4\u05D5\u05E1\u05E4\u05EA \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05D7\u05D3\u05E9\u05D4"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-2xl transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              {"\u05E9\u05DD \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4"}
            </label>
            <input
              className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
              value={label}
              onChange={(e) => setLabel(e.target.value.slice(0, 40))}
              placeholder=""
            />
            {isDuplicateLabel && (
              <p className="mt-2 text-xs text-red-500">
                {"\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05D1\u05E9\u05DD \u05D4\u05D6\u05D4 \u05DB\u05D1\u05E8 \u05E7\u05D9\u05D9\u05DE\u05EA"}
              </p>
            )}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              {"\u05D1\u05D7\u05D9\u05E8\u05EA \u05E6\u05D1\u05E2"}
            </label>

            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colorHex}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-12 w-12 cursor-pointer rounded-2xl border border-white/70 bg-transparent"
              />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">
                  {"\u05E7\u05D5\u05D3 \u05E6\u05D1\u05E2"}
                </span>
                <span className="text-xs font-semibold text-[#122033]">{colorHex}</span>
              </div>
              <div
                className="h-10 w-10 rounded-full border border-white/70 shadow-sm"
                style={{ backgroundColor: colorHex }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#8C7D6B]/10 bg-white/70 backdrop-blur-md flex items-center justify-between">
          <button
            onClick={handleSubmit}
            disabled={!cleanedLabel || isDuplicateLabel}
            className="px-5 py-2.5 bg-[#2C5F8A] text-white text-sm font-medium rounded-2xl hover:bg-[#1A3A5C] disabled:opacity-50 transition-colors shadow-sm"
          >
            {initialCategory ? "\u05E9\u05DE\u05D9\u05E8\u05D4" : "\u05D4\u05D5\u05E1\u05E4\u05D4"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm text-gray-500 hover:bg-white rounded-2xl transition-colors">
            {"\u05D1\u05D9\u05D8\u05D5\u05DC"}
          </button>
        </div>
      </div>
    </div>
  );
}
