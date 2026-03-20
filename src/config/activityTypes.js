// 9 activity types matching mock palette (max 9 dots per date)
export const ACTIVITY_TYPES = [
  { id: "gym", name: "Gym", color: "#8b5cf6" },
  { id: "echo-food", name: "Echo Food", color: "#3b82f6" },
  { id: "cat-food", name: "Cat Food", color: "#22c55e" },
  { id: "laundry", name: "Laundry", color: "#ec4899" },
  { id: "change-sheets", name: "Change Sheets", color: "#f59e0b" },
  { id: "wash-car", name: "Wash Car", color: "#84cc16" },
  { id: "tan", name: "Tan", color: "#ef4444" },
  { id: "yoga", name: "Yoga", color: "#ea580c" },
  { id: "meditate", name: "Meditate", color: "#eab308" },
];

export const getActivityTypeById = (id) =>
  ACTIVITY_TYPES.find((t) => t.id === id);
