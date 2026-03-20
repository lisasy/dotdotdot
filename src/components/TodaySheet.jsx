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
  if (isToday) {
    return `Today ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
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
  const count = activitiesForDate.length;

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-neutral-800">
            {formatDisplayDate(displayDate)}
          </h3>
          <span className="text-sm text-neutral-500">
            {count} selected
          </span>
        </div>

        <div className="space-y-2">
          {ACTIVITY_TYPES.map((type) => {
            const activity = loggedByType[type.id];
            const isLogged = !!activity;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onTypeTap(type, activity, dateStr)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200 ease-out
                  hover:opacity-90 active:scale-[0.99]
                  focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-inset
                  ${isLogged
                    ? ""
                    : "bg-[#F2F2F2] hover:bg-neutral-200/80"
                  }
                `}
                style={
                  isLogged
                    ? {
                        backgroundColor: `${type.color}18`,
                      }
                    : undefined
                }
              >
                <span
                  className="w-3 h-3 rounded-md flex-shrink-0"
                  style={{
                    backgroundColor: isLogged ? type.color : "#d4d4d4",
                  }}
                  aria-hidden
                />
                <span className="flex-1 text-sm font-medium text-neutral-800">
                  {type.name}
                </span>
                {isLogged && (
                  <svg
                    className="w-5 h-5 text-blue-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
