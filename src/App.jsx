import { useState, useCallback } from "react";
import Calendar from "./components/Calendar";
import ActivityPanel from "./components/ActivityPanel";
import { useActivities } from "./hooks/useActivities";
import { ACTIVITY_TYPES } from "./config/activityTypes";

function formatDateForInput(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelInitialDate, setPanelInitialDate] = useState(null);
  const [editActivity, setEditActivity] = useState(null);
  const [viewFilter, setViewFilter] = useState("all");

  const {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByDate,
  } = useActivities();

  const openPanel = useCallback((date = null) => {
    setPanelInitialDate(date ?? new Date());
    setEditActivity(null);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setEditActivity(null);
  }, []);

  const handleDateClick = useCallback(
    (date) => {
      setPanelInitialDate(date);
      setEditActivity(null);
      setPanelOpen(true);
    },
    []
  );

  const handleSave = useCallback(
    (id, { date, typeId }) => {
      if (id) {
        updateActivity(id, { date, typeId });
      } else {
        addActivity({ date, typeId });
      }
    },
    [addActivity, updateActivity]
  );

  const panelDate = editActivity
    ? editActivity.date
    : panelInitialDate
      ? formatDateForInput(panelInitialDate)
      : formatDateForInput(new Date());
  const activitiesForDate = panelOpen ? getActivitiesByDate(panelDate) : [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative">
      <div
        className={`
          w-full max-w-2xl
          transition-all duration-300 ease-out
          ${panelOpen ? "lg:mr-64" : ""}
        `}
      >
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl font-medium text-neutral-800">Calendar Logs</h1>
            <div className="flex items-center gap-3">
              <label htmlFor="view-filter" className="text-sm text-neutral-600">
                View
              </label>
              <select
                id="view-filter"
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800
                  focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 bg-white"
              >
                <option value="all">All</option>
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Calendar
            currentDate={currentDate}
            onMonthChange={(delta) =>
              setCurrentDate(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
              )
            }
            activities={activities}
            viewFilter={viewFilter}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      {/* Sliding panel - from right on desktop, overlay on mobile */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full sm:max-w-sm lg:w-80
          bg-white border-l border-neutral-200 shadow-xl
          transform transition-transform duration-300 ease-out z-40
          flex flex-col
          ${panelOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6 overflow-y-auto flex-1">
          <ActivityPanel
            isOpen={panelOpen}
            onClose={closePanel}
            initialDate={panelInitialDate}
            editActivity={editActivity}
            activitiesForDate={activitiesForDate}
            onSave={handleSave}
            onDelete={deleteActivity}
            onEdit={(a) => setEditActivity(a)}
          />
        </div>
      </div>

      {/* Backdrop for mobile */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* FAB */}
      <button
        type="button"
        onClick={() => openPanel()}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-neutral-800
          text-white shadow-lg hover:bg-neutral-700
          flex items-center justify-center transition z-20
          focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2
          focus:ring-offset-[#eae9e3]"
        aria-label="Create activity"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
