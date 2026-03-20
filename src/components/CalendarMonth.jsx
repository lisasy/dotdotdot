import { useMemo } from "react";
import { ACTIVITY_TYPES, getActivityTypeById } from "../config/activityTypes";

const WEEKDAYS_SHORT = ["Su", "M", "T", "W", "Th", "F", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

export default function CalendarMonth({
  monthDate,
  activities,
  viewFilter,
  selectedDateKey,
  onDateClick,
  fillHeight = false,
}) {
  const { days, monthLabel } = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
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
  }, [monthDate]);

  const activitiesByDate = useMemo(() => {
    const map = {};
    const typeIds = viewFilter === "all"
      ? null
      : new Set([viewFilter]);
    activities.forEach((a) => {
      if (typeIds && !typeIds.has(a.typeId)) return;
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [activities, viewFilter]);

  const todayKey = formatDateKey(new Date());

  const rowCount = days.length / 7;

  return (
    <section
      data-month={monthLabel}
      aria-label={`Calendar for ${monthLabel}`}
      className={fillHeight ? "h-full flex flex-col" : ""}
    >
      <div
        className={`
          grid grid-cols-7 gap-px bg-neutral-200/80 rounded-xl overflow-hidden
          ${fillHeight ? "flex-1" : ""}
        `}
        style={fillHeight ? { gridTemplateRows: `auto repeat(${rowCount}, 1fr)` } : undefined}
      >
        {WEEKDAYS_SHORT.map((day) => (
          <div
            key={day}
            className="bg-white py-1.5 text-center text-xs font-medium text-neutral-500"
          >
            {day}
          </div>
        ))}
        {days.map(({ date, isCurrentMonth }) => {
          const key = formatDateKey(date);
          const dayActivities = (activitiesByDate[key] || []).slice(0, 9);
          const isSelected = selectedDateKey === key;
          const isFuture = key > todayKey;

          return (
            <button
              key={key}
              type="button"
              onClick={() => !isFuture && onDateClick(date)}
              disabled={isFuture}
              className={`
                group min-h-[56px] sm:min-h-[72px] p-1.5 sm:p-2 bg-white text-left
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-inset
                ${!isCurrentMonth ? "text-neutral-400" : "text-neutral-800"}
                ${isFuture
                  ? "text-neutral-300 bg-neutral-50/50 cursor-not-allowed opacity-60"
                  : "hover:bg-neutral-50 active:scale-[0.98] cursor-pointer"}
                ${isSelected && !isFuture ? "bg-[#F2F2F2] rounded-lg" : ""}
              `}
            >
              <span className="block text-sm font-medium mb-1">{date.getDate()}</span>
              <div className="grid grid-cols-3 gap-0.5 lg:gap-1 max-w-[36px] lg:max-w-[60px] mx-auto">
                {dayActivities.length > 0 && Array.from({ length: 9 }).map((_, i) => {
                  const a = dayActivities[i];
                  const type = a ? getActivityTypeById(a.typeId) : null;
                  return (
                    <span
                      key={a?.id ?? i}
                      className={`
                        aspect-square w-[10px] lg:w-4 rounded-[3px] flex-shrink-0
                        transition-shadow duration-200
                        ${type ? "shadow-[0_1px_3px_rgba(0,0,0,0.12)]" : ""}
                        ${!isFuture ? "group-hover:animate-[dot-flutter_0.5s_ease-in-out]" : ""}
                      `}
                      style={{
                        backgroundColor: type?.color || "transparent",
                        animationDelay: !isFuture ? `${i * 45}ms` : undefined,
                      }}
                      title={type?.name}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
