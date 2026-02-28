import { useMemo } from "react";
import { ACTIVITY_TYPES, getActivityTypeById } from "../config/activityTypes";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

export default function Calendar({
  currentDate,
  onMonthChange,
  activities,
  viewFilter,
  onDateClick,
}) {
  const { days, monthLabel } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = startPad - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push({
        date: new Date(year, month, d),
        isCurrentMonth: true,
      });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
      });
    }

    return {
      days,
      monthLabel: `${MONTHS[month]} ${year}`,
    };
  }, [currentDate]);

  const activitiesByDate = useMemo(() => {
    const map = {};
    const typeIds = viewFilter === "all"
      ? null
      : new Set(ACTIVITY_TYPES.filter((t) => t.id === viewFilter).map((t) => t.id));
    activities.forEach((a) => {
      if (typeIds && !typeIds.has(a.typeId)) return;
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [activities, viewFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-neutral-800">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMonthChange(-1)}
            className="rounded p-2 text-neutral-600 transition hover:bg-neutral-200/80 hover:text-neutral-900"
            aria-label="Previous month"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(1)}
            className="rounded p-2 text-neutral-600 transition hover:bg-neutral-200/80 hover:text-neutral-900"
            aria-label="Next month"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-neutral-200 rounded-lg overflow-hidden">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="bg-white py-2 text-center text-xs font-medium text-neutral-500"
          >
            {day}
          </div>
        ))}
        {days.map(({ date, isCurrentMonth }) => {
          const key = formatDateKey(date);
          const dayActivities = activitiesByDate[key] || [];
          const isToday =
            formatDateKey(new Date()) === formatDateKey(date);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onDateClick(date)}
              className={`
                min-h-[52px] sm:min-h-[64px] p-1 sm:p-2 bg-white text-left
                transition hover:bg-neutral-50 focus:outline-none focus:ring-2
                focus:ring-neutral-300 focus:ring-inset
                ${!isCurrentMonth ? "text-neutral-400" : "text-neutral-800"}
                ${isToday ? "ring-1 ring-inset ring-neutral-300" : ""}
              `}
            >
              <span className="block text-sm font-medium mb-1">{date.getDate()}</span>
              <div className="flex flex-wrap gap-1 justify-center">
                {dayActivities.slice(0, 4).map((a) => {
                  const type = getActivityTypeById(a.typeId);
                  return (
                    <span
                      key={a.id}
                      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: type?.color || "#666" }}
                      title={type?.name}
                    />
                  );
                })}
                {dayActivities.length > 4 && (
                  <span className="text-[10px] text-neutral-400">+{dayActivities.length - 4}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
