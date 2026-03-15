import React from "react";
import LiveClock from "./LiveClock";
import DateNavigator from "./DateNavigator";

export default function DashboardHeader({ currentDate, onDateChange }) {
  return (
    <header className="relative z-50 px-4 md:px-8 pt-6" dir="rtl">
      <div className="relative mx-auto max-w-[1400px] rounded-[32px] border border-white/70 bg-white/72 px-4 md:px-8 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div className="relative flex items-center justify-between gap-4" dir="ltr">
          <DateNavigator currentDate={currentDate} onDateChange={onDateChange} />

          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <LiveClock />
          </div>

          <div className="hidden md:flex flex-col items-end" dir="rtl">
            <h1 className="text-lg font-bold text-[#122033]">
              {"\u05E9\u05E2\u05DC\u05F4\u05D7 - \u05E9\u05D5\u05DC\u05D7\u05DF \u05DE\u05E8\u05DB\u05D6\u05D9 \u05E8\u05D1\u05E6\u05F4\u05E8"}
            </h1>
          </div>
        </div>

        <div className="md:hidden flex justify-center mt-4">
          <LiveClock />
        </div>
      </div>
    </header>
  );
}
