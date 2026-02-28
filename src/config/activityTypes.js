export const ACTIVITY_TYPES = [
  { id: "gym", name: "Gym", color: "#3b82f6" },
  { id: "dog-food", name: "Dog Food", color: "#22c55e" },
  { id: "cat-food", name: "Cat Food", color: "#f59e0b" },
  { id: "wash-car", name: "Wash Car", color: "#06b6d4" },
  { id: "wash-sheets", name: "Wash Sheets", color: "#8b5cf6" },
];

export const getActivityTypeById = (id) =>
  ACTIVITY_TYPES.find((t) => t.id === id);
