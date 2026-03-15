"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import LegendPanel from "../components/dashboard/LegendPanel";
import EventRow from "../components/dashboard/EventRow";
import EventEditor from "../components/dashboard/EventEditor";
import ActionToolbar from "../components/dashboard/ActionToolbar";
import EventDetailPanel from "../components/dashboard/EventDetailPanel";
import {
  createEventId,
  getDefaultDashboardData,
  loadDashboardData,
  saveDashboardData,
} from "../components/dashboard/dashboardStorage";
import CategoryEditor from "../components/dashboard/CategoryEditor";

import emblemUrl from "../assets/grok-image-1e975a25-ff86-4256-a8c4-4edfa63da234.png";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "EK_rabaz123";

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showEditor, setShowEditor] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dashboardData, setDashboardData] = useState(() =>
    getDefaultDashboardData()
  );
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showBlessing, setShowBlessing] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const categories = dashboardData.categories || [];
  const events = dashboardData.events || [];

  const sortedEvents = events
    .filter((event) => event.date === currentDate)
    .sort((a, b) => {
      if (a.sort_order != null && b.sort_order != null) return a.sort_order - b.sort_order;
      return (a.time || "").localeCompare(b.time || "");
    });

  const updateDashboardData = (updater) => {
    setDashboardData((current) => {
      const next = updater(current);
      void saveDashboardData(next);
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = async () => {
    const latest = await loadDashboardData();
    setDashboardData(latest);
  };

  useEffect(() => {
    let isMounted = true;
    loadDashboardData().then((data) => {
      if (isMounted) {
        setDashboardData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateEvent = async (eventData) => {
    updateDashboardData((current) => ({
      ...current,
      events: [...current.events, { ...eventData, id: createEventId() }],
    }));
  };

  const handleCreateCategory = async (categoryData) => {
    updateDashboardData((current) => {
      const existingValues = new Set(current.categories.map((item) => item.value));
      let value = categoryData.value;
      while (existingValues.has(value)) {
        value = `${categoryData.value}_${Math.random().toString(36).slice(2, 6)}`;
      }
      return {
        ...current,
        categories: [...current.categories, { ...categoryData, value }],
      };
    });
  };

  const handleUpdateCategory = async (updatedCategory) => {
    updateDashboardData((current) => ({
      ...current,
      categories: current.categories.map((item) =>
        item.value === updatedCategory.value ? { ...item, ...updatedCategory } : item
      ),
    }));
  };

  const handleDeleteCategory = async (category) => {
    if (categories.length <= 1) {
      window.alert("\u05DC\u05D0 \u05E0\u05D9\u05EA\u05DF \u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D4.");
      return;
    }
    const confirmed = window.confirm("\u05DC\u05DE\u05D7\u05D5\u05E7 \u05D0\u05EA \u05D4\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4\u003F \u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD \u05D9\u05E9\u05D5\u05D9\u05DB\u05D5 \u05DC\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05D0\u05D7\u05E8\u05EA.");
    if (!confirmed) return;

    updateDashboardData((current) => {
      const remaining = current.categories.filter((item) => item.value !== category.value);
      const fallbackValue = remaining[0]?.value || null;
      return {
        ...current,
        categories: remaining,
        events: current.events.map((event) =>
          event.category === category.value ? { ...event, category: fallbackValue } : event
        ),
      };
    });
  };

  const handleUpdateEvent = async (eventId, updates) => {
    updateDashboardData((current) => ({
      ...current,
      events: current.events.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      ),
    }));
  };

  const handleDeleteEvent = async (eventId) => {
    updateDashboardData((current) => ({
      ...current,
      events: current.events.filter((event) => event.id !== eventId),
    }));

    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }
  };

  const handleCloseSection = async () => {
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    if (!lastEvent) return;
    await handleDeleteEvent(lastEvent.id);
  };

  const playTaDam = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    const tone = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.connect(gain);
      osc.start(start);
      osc.stop(start + duration);
    };

    tone(523.25, now, 0.28);
    tone(659.25, now + 0.08, 0.28);
    tone(783.99, now + 0.16, 0.32);

    setTimeout(() => {
      ctx.close();
    }, 700);
  };

  const handleBlessingClick = () => {
    playTaDam();
    confetti({
      particleCount: 140,
      spread: 70,
      startVelocity: 32,
      gravity: 0.9,
      origin: { x: 0.98, y: 0.02 },
    });
    setShowBlessing(false);
  };

  const handleAdminSubmit = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassword("");
      setAdminError("");
      return;
    }
    setAdminError("\u05E1\u05D9\u05E1\u05DE\u05D4 \u05E9\u05D2\u05D5\u05D9\u05D4");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f7f4ef_38%,_#eef3f8_100%)] text-[#1A1A1A]" dir="rtl">
      {showBlessing && (
        <button
          type="button"
          onClick={handleBlessingClick}
          className="fixed right-4 top-4 z-[60] h-10 w-10 rounded-xl border border-[#8C7D6B]/20 bg-white/90 text-[11px] font-bold text-[#122033] shadow-sm hover:bg-white transition-colors"
        >
          {"\u05D1\u05E1\u05F4\u05D3"}
        </button>
      )}
      {!isAdmin && (
        <button
          type="button"
          onClick={() => setShowAdminModal(true)}
          className="fixed bottom-4 left-4 z-[60] rounded-xl border border-[#8C7D6B]/20 bg-white/90 px-3 py-2 text-xs font-semibold text-[#122033] shadow-sm hover:bg-white transition-colors"
        >
          {"\u05D4\u05E8\u05E9\u05D0\u05D5\u05EA \u05DE\u05E0\u05D4\u05DC\u05D9\u05DD"}
        </button>
      )}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-[-8rem] h-72 w-72 rounded-full bg-[#C4A882]/10 blur-3xl" />
        <div className="absolute top-24 right-[-6rem] h-80 w-80 rounded-full bg-[#7BA3C9]/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#C98A8A]/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <DashboardHeader
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />

        <ActionToolbar
          onEditEvents={() => setShowEditor(true)}
          onAddEvent={() => setShowEditor(true)}
          onCloseSection={handleCloseSection}
          hasEvents={sortedEvents.length > 0}
        />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-8 print:px-2 print:py-2">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            <div className="md:w-72 flex-shrink-0 order-2 md:order-1 print:hidden">
              <div className="md:sticky md:top-6">
                <LegendPanel
                  emblemUrl={emblemUrl}
                  categories={categories}
                  onAddCategory={() => setShowCategoryEditor(true)}
                  onEditCategory={(category) => setEditingCategory(category)}
                  onDeleteCategory={handleDeleteCategory}
                  canEdit={isAdmin}
                />
              </div>
            </div>

            <div className="flex-1 order-1 md:order-2">
              <div className="rounded-[32px] border border-white/70 bg-white/72 p-4 md:p-6 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
                <div className="space-y-3">
                  {sortedEvents.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 rounded-[28px] bg-[#FAF9F7] border border-dashed border-[#8C7D6B]/20"
                    >
                      <p className="text-[#6E6256] text-sm md:text-base">{"\u05D0\u05D9\u05DF \u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD \u05DE\u05EA\u05D5\u05DB\u05E0\u05E0\u05D9\u05DD \u05DC\u05D9\u05D5\u05DD \u05D6\u05D4"}</p>
                      <button
                        onClick={() => setShowEditor(true)}
                        className="mt-5 px-5 py-2.5 bg-[#2C5F8A] text-white text-sm rounded-2xl hover:bg-[#1A3A5C] transition-colors shadow-sm"
                      >
                        {"+ \u05D4\u05D5\u05E1\u05E3 \u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD"}
                      </button>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDate}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {sortedEvents.map((event, index) => (
                          <div
                            key={event.id}
                            onClick={() => {
                              if (isAdmin) setSelectedEvent(event);
                            }}
                            className="cursor-pointer"
                          >
                            <EventRow
                              event={event}
                              index={index}
                              onDelete={handleDeleteEvent}
                              canEdit={isAdmin}
                            />
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-l from-[#C4A882] via-[#7BA3C9] to-[#C98A8A] print:hidden" />

      {showEditor && (
        <EventEditor
          currentDate={currentDate}
          categories={categories}
          existingEvents={sortedEvents}
          onCreateEvent={handleCreateEvent}
          onClose={() => setShowEditor(false)}
        />
      )}

      {(showCategoryEditor || editingCategory) && (
        <CategoryEditor
          existingCategories={categories}
          initialCategory={editingCategory}
          onCreate={isAdmin ? handleCreateCategory : null}
          onUpdate={isAdmin ? handleUpdateCategory : null}
          onClose={() => {
            setShowCategoryEditor(false);
            setEditingCategory(null);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent}
          categories={categories}
          onClose={() => setSelectedEvent(null)}
          onSaveEvent={async (eventId, updates) => {
            if (!isAdmin) return;
            await handleUpdateEvent(eventId, updates);
            setSelectedEvent(null);
          }}
        />
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-[#122033]/30 backdrop-blur-sm" onClick={() => setShowAdminModal(false)} />
          <div className="relative w-full max-w-sm rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#122033]">
                {"\u05D4\u05E8\u05E9\u05D0\u05D5\u05EA \u05DE\u05E0\u05D4\u05DC\u05D9\u05DD"}
              </h2>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-2 hover:bg-white rounded-2xl transition-colors"
              >
                <span className="text-gray-500">×</span>
              </button>
            </div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">
              {"\u05E1\u05D9\u05E1\u05DE\u05D4"}
            </label>
            <div className="relative">
              <input
                type={showAdminPassword ? "text" : "password"}
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setAdminError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdminSubmit();
                }}
                className="w-full rounded-2xl border border-[#8C7D6B]/12 bg-[#FAF9F7] px-4 py-3 text-sm focus:outline-none pr-11"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white transition-colors text-[#6E6256]"
              >
                {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {adminError && <div className="text-xs text-red-500 mt-2">{adminError}</div>}
            <div className="mt-4 flex items-center gap-2 justify-end">
              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2.5 text-sm text-gray-500 hover:bg-white rounded-2xl transition-colors"
              >
                {"\u05D1\u05D9\u05D8\u05D5\u05DC"}
              </button>
              <button
                onClick={handleAdminSubmit}
                className="px-4 py-2.5 text-sm text-white bg-[#2C5F8A] hover:bg-[#1A3A5C] rounded-2xl transition-colors"
              >
                {"\u05D0\u05D9\u05E9\u05D5\u05E8"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


