import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DateNavigator({ currentDate, onDateChange }) {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `${day}.${month}.${year}`;
  };

  const getDayName = (date) => {
    const days = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳", "שבת"];
    return days[new Date(date).getDay()];
  };

  const getHebrewDate = (date) => {
    try {
      const parts = new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).formatToParts(new Date(date));
      const day = parts.find((p) => p.type === "day")?.value;
      const month = parts.find((p) => p.type === "month")?.value;
      const year = parts.find((p) => p.type === "year")?.value;

      if (!day || !month || !year) return "";

      const toHebrewNumerals = (num) => {
        const n = Number(num);
        if (!Number.isFinite(n) || n <= 0) return "";
        const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
        const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
        const hundreds = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];

        const value = n;
        const parts = [];

        let remaining = value;
        if (remaining >= 100) {
          const h = Math.floor(remaining / 100);
          parts.push(hundreds[h]);
          remaining = remaining % 100;
        }

        if (remaining === 15) {
          parts.push("טו");
          remaining = 0;
        } else if (remaining === 16) {
          parts.push("טז");
          remaining = 0;
        } else if (remaining >= 10) {
          const t = Math.floor(remaining / 10);
          parts.push(tens[t]);
          remaining = remaining % 10;
        }

        if (remaining > 0) {
          parts.push(ones[remaining]);
        }

        const joined = parts.join("");
        if (joined.length <= 1) {
          return `${joined}׳`;
        }
        const head = joined.slice(0, -1);
        const tail = joined.slice(-1);
        return `${head}״${tail}`;
      };

      const hebrewDay = toHebrewNumerals(day);
      const hebrewYear = toHebrewNumerals(Number(year) - 5000);

      return `${hebrewDay} ${month} ${hebrewYear}`;
    } catch {
      return "";
    }
  };

  const navigate = (direction) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + direction);
    onDateChange(d.toISOString().split("T")[0]);
  };

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/75 px-2 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md" dir="rtl">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="h-10 w-10 rounded-xl text-[#6E6256] hover:bg-[#8C7D6B]/10 hover:text-[#1A1A1A]"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="min-w-[150px] px-2 text-left text-[#122033]" dir="rtl">
        <div className="text-[11px] font-semibold tracking-[0.18em] text-[#8C7D6B] uppercase">
          {getDayName(currentDate)}
        </div>
        <div className="font-mono text-base font-bold tracking-[0.18em]">
          {formatDate(currentDate)}
        </div>
        <div className="text-[11px] font-medium text-[#8C7D6B] mt-0.5">
          {getHebrewDate(currentDate)}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(1)}
        className="h-10 w-10 rounded-xl text-[#6E6256] hover:bg-[#8C7D6B]/10 hover:text-[#1A1A1A]"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
    </div>
  );
}
