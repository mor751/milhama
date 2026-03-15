import React, { useEffect, useRef, useState } from "react";
import backImage from "../../assets/c92efbb7-467f-49d2-8659-c7959c66cf60.jpg";

export default function RabbinateClock({ imageUrl }) {
  const resolvedImageUrl = typeof imageUrl === "string" ? imageUrl : imageUrl?.src;
  const resolvedBackImage = typeof backImage === "string" ? backImage : backImage?.src;
  const [time, setTime] = useState(new Date());
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimeoutRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startSpin = () => {
    setIsSpinning(true);
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  useEffect(() => {
    const scheduleNext = () => {
      const now = new Date();
      const next = new Date(now);
      next.setMinutes(0, 0, 0);
      next.setHours(now.getHours() + 1);
      return next.getTime() - now.getTime();
    };

    const timeout = setTimeout(() => {
      startSpin();
      const hourly = setInterval(startSpin, 60 * 60 * 1000);
      spinTimeoutRef.current = hourly;
    }, scheduleNext());

    return () => {
      clearTimeout(timeout);
      if (spinTimeoutRef.current) {
        clearInterval(spinTimeoutRef.current);
      }
      spinTimeoutRef.current = null;
    };
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");

  return (
    <div className="rounded-[28px] border border-transparent bg-transparent p-4 shadow-none">
      <div
        className="relative mx-auto aspect-square w-full max-w-[230px]"
        style={{ perspective: "900px" }}
      >
        <div
          className="relative z-10 h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            animation: isSpinning ? "rkFlip360 3s ease-in-out" : "none",
            willChange: "transform",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={resolvedImageUrl}
              alt="Clock image"
              className="h-full w-full rounded-full object-cover shadow-md"
            />
            <div className="absolute left-1/2 top-[35%] -translate-x-1/2 z-20">
              <span
                dir="ltr"
                className="inline-flex items-center gap-4 text-[35px] font-bold tracking-[0.22em] text-[#122033]"
                style={{ fontFamily: '"DS-Digital", monospace' }}
              >
                <span>{hours}</span>
                <span>{minutes}</span>
              </span>
            </div>
          </div>
          <div
            className="absolute inset-0 rounded-full shadow-md"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src={resolvedBackImage}
              alt="Back image"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
