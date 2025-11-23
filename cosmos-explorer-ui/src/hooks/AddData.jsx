import { useState } from "react";
import { APIURL } from "../utils/contant.js";
import { getSelectedCollection } from "../utils/collection.store";

export const useAddData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const addData = async (data) => {
    const { id, database, collection } = getSelectedCollection() || {};
    if (!id || !database || !collection) {
      throw new Error("No collection selected");
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${APIURL}/api/connections/${id}/databases/${database}/collections/${collection}/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add data");
      }
      const result = await response.json();
      await new Promise((r) => setTimeout(r, 2000));
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Failed to add data");
      console.error("Error adding data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    data,
    addData,
  };
};
