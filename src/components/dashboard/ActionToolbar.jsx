import React from "react";
import { Plus, ChevronDown, Pencil } from "lucide-react";

export default function ActionToolbar({ onEditEvents, onAddEvent, onCloseSection, hasEvents }) {
  return (
    <div className="px-4 md:px-8 pt-3" dir="rtl">
      <div className="mx-auto max-w-[1400px] rounded-[28px] border border-white/70 bg-white/70 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 bg-gradient-to-l from-red-600 to-red-500 text-white text-xs font-bold px-4 py-2 rounded-full ml-2 shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            {"\u05D7\u05D9\u05E8\u05D5\u05DD"}
          </span>

          <div className="hidden md:block w-px h-7 bg-[#8C7D6B]/15 mx-1" />

          <button
            onClick={onEditEvents}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-[#F8F6F3] hover:bg-white rounded-2xl border border-[#8C7D6B]/10 transition-all"
          >
            <Pencil className="h-4 w-4 text-[#8C7D6B]" />
            {"\u05E2\u05E8\u05D5\u05DA \u05D0\u05D9\u05E8\u05D5\u05E2"}
          </button>

          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-[#F8F6F3] hover:bg-white rounded-2xl border border-[#8C7D6B]/10 transition-all"
          >
            <Plus className="h-4 w-4 text-[#8C7D6B]" />
            {"\u05D9\u05E6\u05D9\u05E8\u05EA \u05D0\u05D9\u05E8\u05D5\u05E2 \u05D7\u05D3\u05E9"}
          </button>

          <button
            onClick={onCloseSection}
            disabled={!hasEvents}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-[#F8F6F3] hover:bg-white rounded-2xl border border-[#8C7D6B]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronDown className="h-4 w-4 text-[#8C7D6B]" />
            {"\u05E1\u05D2\u05D9\u05E8\u05EA \u05D0\u05D9\u05E8\u05D5\u05E2"}
          </button>
        </div>
      </div>
    </div>
  );
}
