import React, { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted =
    isMounted && time
      ? time.toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      : "--:--:--";

  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md">
      <div
        className="text-2xl md:text-3xl font-bold tracking-[0.22em] text-[#122033]"
        style={{ fontFamily: '"DS-Digital", monospace' }}
        suppressHydrationWarning
      >
        {formatted}
      </div>
    </div>
  );
}
