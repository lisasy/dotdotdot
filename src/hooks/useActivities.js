import { useState, useEffect } from "react";

const STORAGE_KEY = "calendar_logs_activities";

export function useActivities() {
  const [activities, setActivities] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      id: crypto.randomUUID(),
    };
    setActivities((prev) => [...prev, newActivity]);
    return newActivity.id;
  };

  const updateActivity = (id, updates) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteActivity = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const getActivitiesByDate = (dateStr) =>
    activities.filter((a) => a.date === dateStr);

  return {
    activities,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByDate,
  };
}
