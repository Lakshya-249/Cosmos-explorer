import { useState } from "react";
import { getSelectedCollection } from "../utils/collection.store";

export const useConditions = () => {
  const [conditions, setConditions] = useState({
    baseCond: [],
  });

  const { id, database, collection } = getSelectedCollection() || {};
  if (!id || !database || !collection) {
    throw new Error("No collection selected");
  }

  const collection_id = `${collection} | ${database}`;
  const fetchConditions = () => {
    return conditions[collection_id] || [];
  };

  const addCondition = () => {
    const current = conditions[collection_id] || [];
    setConditions({
      ...conditions,
      [collection_id]: [
        ...current,
        {
          id: Date.now(),
          field: "",
          operator: "eq",
          value: "",
          connector: current.length > 0 ? "and" : null,
        },
      ],
    });
  };

  const updateCondition = (id, updates) => {
    const current = conditions[collection_id] || [];
    setConditions({
      ...conditions,
      [collection_id]: current.map((cond) =>
        cond.id === id ? { ...cond, ...updates } : cond,
      ),
    });
  };

  const removeCondition = (id) => {
    const current = conditions[collection_id] || [];
    setConditions({
      ...conditions,
      [collection_id]: current.filter((cond) => cond.id !== id),
    });
  };

  return {
    // conditions,
    fetchConditions,
    addCondition,
    updateCondition,
    removeCondition,
  };
};
