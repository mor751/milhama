import React, { useState } from "react";
import { Radio, RefreshCw, ArrowLeft, Clock, MapPin, Users, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_STYLES = {
  situation_report_command: {
    glow: "from-[#C4A882]/18 via-white to-white",
    accentBg: "bg-[#C4A882]/16",
    accentBorder: "border-[#C4A882]/40",
    accent: "text-[#8C7D6B]",
    line: "bg-[#C4A882]",
  },
  situation_report_senior: {
    glow: "from-[#7BA3C9]/18 via-white to-white",
    accentBg: "bg-[#7BA3C9]/16",
    accentBorder: "border-[#7BA3C9]/40",
    accent: "text-[#5A8AB5]",
    line: "bg-[#7BA3C9]",
  },
  situation_report_logistics: {
    glow: "from-[#C98A8A]/18 via-white to-white",
    accentBg: "bg-[#C98A8A]/16",
    accentBorder: "border-[#C98A8A]/40",
    accent: "text-[#B06060]",
    line: "bg-[#C98A8A]",
  },
  operations: {
    glow: "from-[#A8A8A8]/18 via-white to-white",
    accentBg: "bg-[#A8A8A8]/16",
    accentBorder: "border-[#A8A8A8]/40",
    accent: "text-[#6B7280]",
    line: "bg-[#A8A8A8]",
  },
  night_report: {
    glow: "from-[#7BA3C9]/18 via-white to-white",
    accentBg: "bg-[#7BA3C9]/16",
    accentBorder: "border-[#7BA3C9]/40",
    accent: "text-[#5A8AB5]",
    line: "bg-[#7BA3C9]",
  },
};

const ICONS = {
  broadcast: Radio,
  refresh: RefreshCw,
  arrow: ArrowLeft,
};

export default function EventRow({ event, index, onDelete, canEdit = false }) {
  const [hovered, setHovered] = useState(false);
  const style = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.operations;
  const Icon = ICONS[event.icon_type] || RefreshCw;

  const timeRange = event.end_time
    ? `${event.time} - ${event.end_time}`
    : event.time;

  return (
    <div className="relative" dir="rtl">
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-l ${style.glow} px-5 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(15,23,42,0.12)] cursor-pointer`}
      >
        <div className={`absolute top-0 right-0 h-full w-1.5 ${style.line}`} />

        <div className="flex items-center gap-4 pr-2">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${style.accentBorder} ${style.accentBg} ${style.accent}`}>
            <Icon className="h-4 w-4" strokeWidth={1.7} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[15px] md:text-base font-semibold text-[#122033] leading-snug truncate">
              {event.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#8C7D6B]">
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              )}
              {event.participants && (
                <span className="flex items-center gap-1 truncate max-w-[220px]">
                  <Users className="h-3 w-3" />
                  {event.participants}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {canEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete(event.id);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-white/90 text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="rounded-2xl border border-[#8C7D6B]/10 bg-white/90 px-4 py-2 text-center shadow-sm">
              <div className="text-[10px] font-semibold tracking-[0.18em] text-[#8C7D6B] uppercase">שעה</div>
              <div className="font-mono text-lg font-bold tracking-[0.15em] text-[#122033]">{event.time}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="absolute right-2 top-full mt-2 z-50 w-80 rounded-3xl border border-white/80 bg-white/95 p-4 shadow-2xl"
            dir="rtl"
          >
            <p className="text-sm font-bold text-[#122033] mb-3">{event.title}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#8C7D6B] mb-3">
              {timeRange && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeRange}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              )}
              {event.participants && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {event.participants}
                </span>
              )}
            </div>

            {event.notes && (
              <p className="text-xs text-gray-500 mb-4 leading-6">{event.notes}</p>
            )}

            <button className="px-3 py-2 bg-[#2C5F8A] text-white text-xs rounded-2xl hover:bg-[#1A3A5C] transition-colors">
              קרא עוד
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
