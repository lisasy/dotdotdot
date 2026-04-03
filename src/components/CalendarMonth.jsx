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
          grid grid-cols-7 gap-[4px] rounded-xl overflow-hidden
          ${fillHeight ? "flex-1" : ""}
        `}
        style={fillHeight ? { gridTemplateRows: `auto repeat(${rowCount}, 1fr)` } : undefined}
      >
        {WEEKDAYS_SHORT.map((day) => (
          <div
            key={day}
            className="py-1.5 text-center text-xs font-medium text-neutral-500"
          >
            {day}
          </div>
        ))}
        {days.map(({ date, isCurrentMonth }) => {
          const key = formatDateKey(date);
          const dayActivities = (activitiesByDate[key] || []).slice(0, 9);
          const isSelected = selectedDateKey === key;
          const isFuture = key > todayKey;
          const hasActivity = dayActivities.length > 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => !isFuture && onDateClick(date)}
              disabled={isFuture}
              className={`
                group min-h-[56px] sm:min-h-[72px] p-1.5 sm:p-2
                flex flex-col
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-neutral-400/30 focus:ring-inset
                ${!isCurrentMonth ? "text-neutral-400/60" : "text-neutral-700"}
                ${isFuture
                  ? "text-neutral-400/40 cursor-not-allowed opacity-50"
                  : "hover:bg-white/40 active:scale-[0.98] cursor-pointer"}
                ${isSelected && !isFuture ? "bg-white/60 rounded-lg" : ""}
                ${hasActivity && !isFuture && !isSelected ? "bg-white/30 rounded-lg" : ""}
              `}
            >
              <span className="text-sm font-medium mb-1">{date.getDate()}</span>
              <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5 lg:gap-1 max-w-[24px] lg:max-w-[34px]">
                {ACTIVITY_TYPES.map((type, i) => {
                  const isLogged = dayActivities.some((a) => a.typeId === type.id);
                  if (!isLogged) return null;
                  return (
                    <span
                      key={type.id}
                      className={`
                        relative aspect-square w-[10px] lg:w-[15px] rounded-[3px] flex-shrink-0
                        shadow-[0_1px_3px_rgba(0,0,0,0.12)]
                        transition-all duration-200
                        peer
                        ${!isFuture ? "group-hover:animate-[dot-flutter_0.5s_ease-in-out]" : ""}
                        [&:hover>.dot-tooltip]:opacity-100 [&:hover>.dot-tooltip]:translate-y-0
                      `}
                      style={{
                        backgroundColor: type.color,
                        animationDelay: !isFuture ? `${i * 45}ms` : undefined,
                      }}
                    >
                      <span
                        className="dot-tooltip pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5
                          px-2 py-1 rounded-md bg-neutral-800 text-white text-[10px] lg:text-xs font-medium
                          whitespace-nowrap opacity-0 translate-y-1
                          transition-all duration-150 ease-out z-30"
                      >
                        {type.name}
                      </span>
                    </span>
                  );
                })}
              </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
