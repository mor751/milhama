import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { extractHex, toRgba } from "./colorUtils";

const ICON_OPTIONS = [
  { value: "broadcast", label: "\u05E9\u05D9\u05D3\u05D5\u05E8" },
  { value: "refresh", label: "\u05E8\u05E2\u05E0\u05D5\u05DF" },
  { value: "arrow", label: "\u05D7\u05E5" },
];

export default function EventEditor({ currentDate, categories = [], existingEvents = [], onCreateEvent, onClose }) {
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    date: currentDate,
    time: "00:00",
    end_time: "",
    participants: "",
    location: "",
    category: categories[0]?.value || "situation_report_command",
    icon_type: "refresh",
    sort_order: 99,
    recurring: false,
  });
  const [activeTab, setActiveTab] = useState("details");

  const handleCreate = async () => {
    if (!createForm.title || !createForm.time) return;
    setSaving(true);
    await onCreateEvent({
      ...createForm,
      date: currentDate,
      sort_order: existingEvents.length + 1,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#122033]/30 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,246,243,0.98))] shadow-2xl flex flex-col overflow-hidden" dir="rtl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#8C7D6B]/10 bg-white/65 backdrop-blur-md">
          <div>
            <p className="text-xs text-[#8C7D6B] tracking-[0.2em] uppercase mb-1">
              {"\u05D9\u05E6\u05D9\u05E8\u05D4"}
            </p>
            <h2 className="text-lg font-bold text-[#122033]">
              {"\u05D9\u05E6\u05D9\u05E8\u05EA \u05DE\u05D5\u05E4\u05E2 \u05D7\u05D3\u05E9"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-2xl transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4 bg-transparent">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2.5 text-sm font-medium rounded-2xl transition-colors ${
              activeTab === "details"
                ? "bg-[#2C5F8A] text-white shadow-sm"
                : "bg-[#F6F3EE] text-gray-600 hover:bg-white"
            }`}
          >
            {"\u05E4\u05E8\u05D8\u05D9 \u05D4\u05DE\u05D5\u05E4\u05E2"}
          </button>
          <button
            onClick={() => setActiveTab("optional")}
            className={`px-4 py-2.5 text-sm font-medium rounded-2xl transition-colors ${
              activeTab === "optional"
                ? "bg-[#2C5F8A] text-white shadow-sm"
                : "bg-[#F6F3EE] text-gray-600 hover:bg-white"
            }`}
          >
            {"\u05DE\u05E6\u05E2 (\u05D0\u05D5\u05E4\u05E6\u05D9\u05D5\u05E0\u05DC\u05D9)"}
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[65vh]">
          {activeTab === "details" && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm">
                <label className="text-xs font-medium text-gray-600 block mb-1.5">
                  {"* \u05E9\u05DD \u05D4\u05DE\u05D5\u05E4\u05E2"}
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C5F8A]/20"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value.slice(0, 60) })}
                    placeholder=""
                  />
                  <span className="absolute left-3 bottom-3 text-[10px] text-gray-400">{createForm.title.length} / 60</span>
                </div>
              </div>

              <div className="md:col-span-2 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm">
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  {"* \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4"}
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {categories.map((category) => {
                    const isActive = createForm.category === category.value;
                    const colorHex = extractHex(category.color) || "#A8A8A8";
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, category: category.value })}
                        className={`rounded-2xl border px-3 py-3 text-right transition-all ${
                          isActive ? "shadow-sm" : "border-[#8C7D6B]/12 bg-[#FAF9F7] hover:bg-white"
                        }`}
                        style={
                          isActive
                            ? {
                                borderColor: toRgba(colorHex, 0.35),
                                backgroundColor: toRgba(colorHex, 0.12),
                              }
                            : undefined
                        }
                      >
                        <span
                          className="text-sm font-medium text-[#122033] rounded-lg px-3 py-1"
                          style={{ backgroundColor: toRgba(colorHex, 0.22) }}
                        >
                          {category.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <CardField label={"* \u05EA\u05D0\u05E8\u05D9\u05DA"}>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={createForm.date}
                  onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                />
              </CardField>

              <CardField label={"* \u05E9\u05E2\u05EA \u05D4\u05EA\u05D7\u05DC\u05D4"}>
                <input
                  type="time"
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={createForm.time}
                  onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                />
              </CardField>

              <CardField label={"* \u05E9\u05E2\u05EA \u05E1\u05D9\u05D5\u05DD"}>
                <input
                  type="time"
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={createForm.end_time}
                  onChange={(e) => setCreateForm({ ...createForm, end_time: e.target.value })}
                />
              </CardField>

              <div className="md:col-span-2 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm">
                <label className="text-xs font-medium text-gray-600 block mb-1.5">
                  {"\u05DE\u05E9\u05EA\u05EA\u05E4\u05D9\u05DD"}
                </label>
                <div className="relative">
                  <textarea
                    className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none resize-none h-20"
                    value={createForm.participants}
                    onChange={(e) => setCreateForm({ ...createForm, participants: e.target.value.slice(0, 50) })}
                    placeholder=""
                  />
                  <span className="absolute left-3 bottom-3 text-[10px] text-gray-400">{createForm.participants.length} / 50</span>
                </div>
              </div>

              <div className="md:col-span-2 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm">
                <label className="text-xs font-medium text-gray-600 block mb-1.5">
                  {"\u05DE\u05D9\u05E7\u05D5\u05DD \u05D4\u05DE\u05D5\u05E4\u05E2"}
                </label>
                <input
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder=""
                />
              </div>
            </div>
          )}

          {activeTab === "optional" && (
            <div className="grid md:grid-cols-2 gap-4">
              <CardField label={"\u05EA\u05D5\u05DB\u05DF \u05D4\u05DE\u05D5\u05E4\u05E2"}>
                <div className="relative">
                  <textarea
                    className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none resize-none h-32"
                    value={createForm.content || ""}
                    onChange={(e) => setCreateForm({ ...createForm, content: e.target.value.slice(0, 160) })}
                    placeholder=""
                  />
                  <span className="text-[10px] text-gray-400">{(createForm.content || "").length} / 160</span>
                </div>
              </CardField>

              <CardField label={"\u05D4\u05E2\u05E8\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05D5\u05EA"}>
                <div className="relative">
                  <textarea
                    className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none resize-none h-32"
                    value={createForm.notes || ""}
                    onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value.slice(0, 160) })}
                    placeholder=""
                  />
                  <span className="text-[10px] text-gray-400">{(createForm.notes || "").length} / 160</span>
                </div>
              </CardField>

              <CardField label={"\u05EA\u05E7\u05E6\u05D9\u05E8/\u05EA \u05DE\u05D5\u05E4\u05E2"}>
                <div className="relative">
                  <input
                    className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                    value={createForm.summary || ""}
                    onChange={(e) => setCreateForm({ ...createForm, summary: e.target.value.slice(0, 50) })}
                    placeholder=""
                  />
                  <span className="text-[10px] text-gray-400 block mt-1 text-left">{(createForm.summary || "").length} / 50</span>
                </div>
              </CardField>

              <CardField label={"\u05DE\u05D1\u05E0\u05D4 \u05D4\u05DE\u05D5\u05E4\u05E2"}>
                <input
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={createForm.structure || ""}
                  onChange={(e) => setCreateForm({ ...createForm, structure: e.target.value })}
                  placeholder=""
                />
              </CardField>

              <CardField label={"\u05D0\u05D9\u05D9\u05E7\u05D5\u05DF"}>
                <select
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={createForm.icon_type}
                  onChange={(e) => setCreateForm({ ...createForm, icon_type: e.target.value })}
                >
                  {ICON_OPTIONS.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </CardField>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#8C7D6B]/10 bg-white/70 backdrop-blur-md flex items-center justify-between">
          <button
            onClick={handleCreate}
            disabled={saving || !createForm.title || !createForm.time}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2C5F8A] text-white text-sm font-medium rounded-2xl hover:bg-[#1A3A5C] disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {"\u05D9\u05E6\u05D9\u05E8\u05EA \u05DE\u05D5\u05E4\u05E2"}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 text-sm text-gray-500 hover:bg-white rounded-2xl transition-colors">
            {"\u05D1\u05D9\u05D8\u05D5\u05DC"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CardField({ label, children }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-sm">
      <label className="text-xs font-medium text-gray-600 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
