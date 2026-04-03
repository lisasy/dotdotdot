import { ACTIVITY_TYPES } from "../config/activityTypes";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDisplayDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
  const dateStr = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return isToday ? `Today · ${dateStr}` : dateStr;
}

export default function TodaySheet({
  selectedDate,
  activitiesForDate,
  onTypeTap,
}) {
  const dateStr = selectedDate
    ? selectedDate.toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  const displayDate = selectedDate || new Date();

  const loggedByType = {};
  activitiesForDate.forEach((a) => {
    loggedByType[a.typeId] = a;
  });

  return (
    <div className="flex flex-col bg-white rounded-t-2xl lg:rounded-xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:shadow-none border border-neutral-200/80 lg:border-0">
      {/* Grabber - mobile */}
      <div className="lg:hidden flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-neutral-300" aria-hidden />
      </div>

      <div className="px-4 sm:px-6 pb-6 pt-2 lg:pt-6">
        <h3 className="text-base font-semibold text-neutral-800 mb-4">
          {formatDisplayDate(displayDate)}
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {ACTIVITY_TYPES.map((type) => {
            const activity = loggedByType[type.id];
            const isLogged = !!activity;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onTypeTap(type, activity, dateStr)}
                className={`
                  relative flex flex-col items-start justify-end
                  rounded-2xl px-4 py-5 lg:aspect-square lg:p-4
                  transition-all duration-200 ease-out
                  hover:opacity-90 active:scale-[0.97]
                  focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-inset
                  ${isLogged ? "" : "bg-[#F2F2F0]"}
                `}
                style={
                  isLogged
                    ? { backgroundColor: `${type.color}18` }
                    : undefined
                }
              >
                {isLogged && (
                  <span className="absolute top-3 right-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke={type.color}
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
                <span
                  className="w-3 h-3 rounded-md mb-2"
                  style={{
                    backgroundColor: isLogged ? type.color : "#c4c4c4",
                  }}
                  aria-hidden
                />
                <span className="text-sm font-medium text-neutral-800">
                  {type.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
