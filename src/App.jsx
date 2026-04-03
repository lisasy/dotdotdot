import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import CalendarMonth from "./components/CalendarMonth";
import TodaySheet from "./components/TodaySheet";
import { useActivities } from "./hooks/useActivities";
import { ACTIVITY_TYPES } from "./config/activityTypes";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateForInput(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

function getMonthLabel(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export default function App() {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [viewFilter, setViewFilter] = useState("all");
  const [visibleMonthLabel, setVisibleMonthLabel] = useState(() => getMonthLabel(today));
  const [visibleMonthIdx, setVisibleMonthIdx] = useState(0);

  const mainRef = useRef(null);

  const months = useMemo(() => {
    const start = new Date(2026, 1, 1); // Feb 2026
    const list = [];
    let cursor = new Date(start);
    while (
      cursor.getFullYear() < today.getFullYear() ||
      (cursor.getFullYear() === today.getFullYear() && cursor.getMonth() <= today.getMonth())
    ) {
      list.push(new Date(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return list;
  }, [today]);

  const isViewingCurrentMonth = visibleMonthIdx === months.length - 1;
  const isAtStart = visibleMonthIdx === 0;

  const {
    activities,
    addActivity,
    deleteActivity,
    getActivitiesByDate,
  } = useActivities();

  const handleDateClick = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleTypeTap = useCallback(
    (type, activity, dateStr) => {
      if (activity) {
        deleteActivity(activity.id);
      } else {
        addActivity({ date: dateStr, typeId: type.id });
      }
    },
    [addActivity, deleteActivity]
  );

  // Detect which month is visible based on scroll position
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    let rafId = null;

    const update = () => {
      const monthEls = el.querySelectorAll("[data-month-index]");
      if (!monthEls.length) return;

      const containerTop = el.getBoundingClientRect().top + 20;
      let closest = null;
      let closestDist = Infinity;

      monthEls.forEach((monthEl) => {
        const dist = Math.abs(monthEl.getBoundingClientRect().top - containerTop);
        if (dist < closestDist) {
          closestDist = dist;
          closest = monthEl;
        }
      });

      if (closest) {
        const idx = parseInt(closest.getAttribute("data-month-index"), 10);
        setVisibleMonthIdx(idx);
        setVisibleMonthLabel(getMonthLabel(months[idx]));
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    rafId = requestAnimationFrame(update);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", handleScroll);
    };
  }, [months]);

  const scrollToMonthIndex = useCallback((idx) => {
    const el = mainRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-month-index="${idx}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const goToPrevMonth = useCallback(() => {
    if (visibleMonthIdx > 0) scrollToMonthIndex(visibleMonthIdx - 1);
  }, [visibleMonthIdx, scrollToMonthIndex]);

  const goToNextMonth = useCallback(() => {
    if (visibleMonthIdx < months.length - 1) scrollToMonthIndex(visibleMonthIdx + 1);
  }, [visibleMonthIdx, months.length, scrollToMonthIndex]);

  const goToToday = useCallback(() => {
    scrollToMonthIndex(months.length - 1);
    setSelectedDate(new Date());
  }, [months.length, scrollToMonthIndex]);

  // Auto-scroll to current month on mount (instant, no animation)
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove("scroll-smooth");
    requestAnimationFrame(() => {
      const target = el.querySelector(`[data-month-index="${months.length - 1}"]`);
      if (target) target.scrollIntoView({ block: "start" });
      requestAnimationFrame(() => {
        el.classList.add("scroll-smooth");
      });
    });
  }, [months.length]);

  const activitiesForDate = getActivitiesByDate(
    selectedDate ? formatDateForInput(selectedDate) : formatDateForInput(new Date())
  );

  const selectedDateKey = formatDateForInput(selectedDate || new Date());

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row bg-[#eae9e3]">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden pb-[280px] lg:pb-0 lg:mr-80">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#eae9e3] px-4 py-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={goToToday}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isViewingCurrentMonth
                ? "text-neutral-400 cursor-default"
                : "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200"}
            `}
            disabled={isViewingCurrentMonth}
          >
            Today
          </button>

          <div className="flex-1 flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={goToPrevMonth}
              disabled={isAtStart}
              className={`
                p-1.5 rounded-lg transition-colors
                ${isAtStart
                  ? "text-neutral-300 cursor-default"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"}
              `}
              aria-label="Previous month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-base font-semibold text-neutral-800 min-w-[160px] text-center select-none transition-all duration-150">
              {visibleMonthLabel}
            </h1>
            <button
              type="button"
              onClick={goToNextMonth}
              disabled={isViewingCurrentMonth}
              className={`
                p-1.5 rounded-lg transition-colors
                ${isViewingCurrentMonth
                  ? "text-neutral-300 cursor-default"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"}
              `}
              aria-label="Next month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <select
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value)}
            className="appearance-none bg-transparent border-none text-neutral-500 hover:text-neutral-700 cursor-pointer text-sm font-medium focus:outline-none focus:ring-0"
            aria-label="Filter by activity type"
          >
            <option value="all">All</option>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </header>

        {/* Scroll-snap timeline — one month visible, snaps between months */}
        <main
          ref={mainRef}
          className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain scroll-smooth snap-y snap-mandatory"
        >
          {months.map((monthDate, idx) => (
            <div
              key={monthDate.toISOString()}
              data-month-index={idx}
              className="snap-start h-full px-4 py-2 lg:px-6 lg:py-4"
            >
              <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none h-full">
                <CalendarMonth
                  monthDate={monthDate}
                  activities={activities}
                  viewFilter={viewFilter}
                  selectedDateKey={selectedDateKey}
                  onDateClick={handleDateClick}
                  fillHeight
                />
              </div>
            </div>
          ))}
        </main>
      </div>

      {/* Today sheet */}
      <aside
        className={`
          fixed bottom-0 left-0 right-0
          lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto
          lg:w-80 lg:min-w-80 lg:max-w-sm
          flex-shrink-0
          bg-transparent lg:bg-[#eae9e3]
          flex flex-col
          lg:h-screen lg:overflow-y-auto
          z-10
        `}
      >
        <div className="lg:sticky lg:top-0 lg:z-10 lg:bg-[#eae9e3] lg:pt-6">
          <TodaySheet
            selectedDate={selectedDate || new Date()}
            activitiesForDate={activitiesForDate}
            onTypeTap={handleTypeTap}
          />
        </div>
      </aside>
    </div>
  );
}
