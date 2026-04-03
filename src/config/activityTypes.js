export const ACTIVITY_TYPES = [
  { id: "gym", name: "Gym", color: "#C4B23A" },
  { id: "pet-food", name: "Pet Food", color: "#E8836A" },
  { id: "track-finance", name: "Track Finance", color: "#5BBF8A" },
  { id: "groceries", name: "Groceries", color: "#5A6FF5" },
];

export const getActivityTypeById = (id) =>
  ACTIVITY_TYPES.find((t) => t.id === id);
