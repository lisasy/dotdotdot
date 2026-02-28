import { useState, useEffect } from "react";
import { ACTIVITY_TYPES, getActivityTypeById } from "../config/activityTypes";

function formatDateForInput(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function ActivityPanel({
  isOpen,
  onClose,
  initialDate,
  editActivity,
  activitiesForDate = [],
  onSave,
  onDelete,
  onEdit,
}) {
  const [date, setDate] = useState("");
  const [typeId, setTypeId] = useState(ACTIVITY_TYPES[0].id);

  const isEditing = !!editActivity;

  useEffect(() => {
    if (isOpen) {
      setDate(
        initialDate ? formatDateForInput(initialDate) : formatDateForInput(new Date())
      );
      setTypeId(editActivity?.typeId ?? ACTIVITY_TYPES[0].id);
    }
  }, [isOpen, initialDate, editActivity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !typeId) return;
    if (isEditing) {
      onSave(editActivity.id, { date, typeId });
    } else {
      onSave(null, { date, typeId });
    }
    onClose();
  };

  const handleDelete = () => {
    if (isEditing && confirm("Delete this activity?")) {
      onDelete(editActivity.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-neutral-800">
          {isEditing ? "Edit Activity" : "Create Activity"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
        <div>
          <label htmlFor="activity-date" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Date
          </label>
          <input
            id="activity-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400"
            required
          />
        </div>

        <div role="radiogroup" aria-label="Activity type">
          <span className="block text-sm font-medium text-neutral-700 mb-1.5">
            Activity Type
          </span>
          <div className="flex flex-col gap-2 w-full">
            {ACTIVITY_TYPES.map((type) => (
              <label
                key={type.id}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left cursor-pointer
                  transition focus-within:ring-2 focus-within:ring-neutral-400 focus-within:ring-offset-1
                  ${typeId === type.id
                    ? "border-neutral-500 bg-neutral-50 ring-1 ring-neutral-400"
                    : "border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50/50"
                  }
                `}
              >
                <input
                  type="radio"
                  name="activity-type"
                  value={type.id}
                  checked={typeId === type.id}
                  onChange={() => setTypeId(type.id)}
                  className="sr-only"
                />
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: type.color }}
                  aria-hidden
                />
                <span className="text-sm font-medium text-neutral-800">{type.name}</span>
              </label>
            ))}
          </div>
        </div>

        {activitiesForDate.length > 0 && (
          <div className="border-t border-neutral-200 pt-4">
            <p className="text-sm font-medium text-neutral-700 mb-2">
              Logged for this date
            </p>
            <ul className="space-y-2">
              {activitiesForDate.map((a) => {
                const type = getActivityTypeById(a.typeId);
                return (
                  <li
                    key={a.id}
                    className="flex items-center justify-between gap-2 py-2 px-3
                      rounded-lg bg-neutral-50 border border-neutral-100"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: type?.color }}
                      />
                      <span className="text-sm text-neutral-800">{type?.name}</span>
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(a)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded transition"
                        aria-label="Edit"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Delete this activity?")) onDelete(a.id);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        aria-label="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-4">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600
                hover:bg-red-50 rounded-lg transition"
            >
              Delete
            </button>
          )}
          <div className="flex-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-600
                hover:bg-neutral-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-neutral-800
                hover:bg-neutral-700 rounded-lg transition"
            >
              {isEditing ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
