import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, RotateCcw, Loader2 } from "lucide-react";

export default function EventDetailPanel({ event, categories = [], onClose, onSaveEvent }) {
  const [form, setForm] = useState({
    title: event.title || "",
    time: event.time || "",
    category: event.category || "situation_report_command",
    icon_type: event.icon_type || "refresh",
    sort_order: event.sort_order ?? 99,
    operation_name: event.operation_name || "",
    activation_notes: event.activation_notes || "",
    location: event.location || "",
    end_time: event.end_time || "",
    notes: event.notes || "",
    summary: event.summary || "",
    participants: event.participants || "",
  });
  const [saving, setSaving] = useState(false);

  const MAX_NOTES = 50;
  const MAX_SUMMARY = 50;
  const MAX_PARTICIPANTS = 50;
  const MAX_ACTIVATION = 50;

  const handleSave = async () => {
    setSaving(true);
    await onSaveEvent(event.id, form);
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#122033]/25 backdrop-blur-sm z-40"
          onClick={onClose}
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed top-0 left-0 h-full w-full max-w-md border-r border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,246,243,0.96))] shadow-2xl z-50 flex flex-col"
          dir="rtl"
        >
          <div className="px-5 py-5 border-b border-[#8C7D6B]/10 bg-white/70 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#8C7D6B] mb-1 tracking-[0.18em] uppercase">עריכת מופע</p>
                <h2 className="text-base font-bold text-[#122033] leading-snug truncate">{event.title}</h2>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button className="p-2 hover:bg-white rounded-2xl transition-colors text-gray-500">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-white rounded-2xl transition-colors text-gray-500">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-white rounded-2xl transition-colors text-gray-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            <Section title="פרטי המופע">
              <Field label="שם מבצע">
                <input
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={form.operation_name}
                  onChange={e => setForm({ ...form, operation_name: e.target.value })}
                  placeholder="הכנס שם מבצע..."
                />
              </Field>
              <Field label='הפעלת עצבונות - הרסנות - אכ"א'>
                <input
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                  value={form.activation_notes}
                  onChange={e => setForm({ ...form, activation_notes: e.target.value.slice(0, MAX_ACTIVATION) })}
                  placeholder="הכנס הערות..."
                />
                <Counter current={form.activation_notes.length} max={MAX_ACTIVATION} />
              </Field>
            </Section>

            <Section title="קטגוריה">
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer rounded-2xl border border-[#8C7D6B]/10 bg-white/70 px-3 py-3 hover:bg-white transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={form.category === cat.value}
                      onChange={() => setForm({ ...form, category: cat.value })}
                      className="accent-[#2C5F8A]"
                    />
                    <span className={`w-4 h-10 rounded-full ${cat.color} flex-shrink-0`} />
                    <span className="text-sm font-medium text-[#122033]">{cat.label}</span>
                  </label>
                ))}
              </div>
            </Section>

            <Section title="שעות">
              <div className="grid grid-cols-2 gap-3">
                <Field label="שעת התחלה *">
                  <input
                    type="time"
                    className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </Field>
                <Field label="שעת סיום">
                  <input
                    type="time"
                    className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none"
                    value={form.end_time}
                    onChange={e => setForm({ ...form, end_time: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="שדה נוסף">
                <div className="flex items-center gap-2 text-xs text-[#8C7D6B] px-1">
                  <span>11 / 50</span>
                </div>
              </Field>
            </Section>

            <Section title="לוג זמנים (אוטומטי)">
              <Field label="הערות">
                <textarea
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none resize-none h-20"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value.slice(0, MAX_NOTES) })}
                  placeholder="הכנס הערות..."
                />
                <Counter current={form.notes.length} max={MAX_NOTES} />
              </Field>
              <Field label="סיכום">
                <textarea
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none resize-none h-20"
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value.slice(0, MAX_SUMMARY) })}
                  placeholder="הכנס סיכום..."
                />
                <Counter current={form.summary.length} max={MAX_SUMMARY} />
              </Field>
              <Field label="משתתפים">
                <textarea
                  className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none resize-none h-20"
                  value={form.participants}
                  onChange={e => setForm({ ...form, participants: e.target.value.slice(0, MAX_PARTICIPANTS) })}
                  placeholder="הכנס משתתפים..."
                />
                <Counter current={form.participants.length} max={MAX_PARTICIPANTS} />
              </Field>
            </Section>
          </div>

          <div className="px-5 py-4 border-t border-[#8C7D6B]/10 bg-white/75 backdrop-blur-md flex items-center justify-between">
            <span className="text-xs text-[#8C7D6B]">0 / 0</span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm text-gray-600 hover:bg-white rounded-2xl transition-colors"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2C5F8A] text-white text-sm rounded-2xl hover:bg-[#1A3A5C] disabled:opacity-50 transition-colors shadow-sm"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                שמור
              </button>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/65 p-4 shadow-sm">
      <h3 className="text-xs font-semibold text-[#8C7D6B] uppercase tracking-[0.22em] mb-4">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Counter({ current, max }) {
  return (
    <div className="text-left mt-1">
      <span className="text-[11px] text-[#8C7D6B]">{current} / {max}</span>
    </div>
  );
}