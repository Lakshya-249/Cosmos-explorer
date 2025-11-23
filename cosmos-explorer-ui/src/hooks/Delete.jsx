import { useState } from "react";
import { APIURL } from "../utils/contant.js";
import { getSelectedCollection } from "../utils/collection.store.js";

export const useDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setDelete] = useState(null);

  const deleteData = async (did) => {
    const { id, database, collection } = getSelectedCollection() || {};
    if (!id || !database || !collection) {
      throw new Error("No collection selected");
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${APIURL}/api/connections/${id}/databases/${database}/collections/${collection}/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: did }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete data");
      }
      const result = await response.json();

      await new Promise((r) => setTimeout(r, 1000));
      setDelete(result);
      return result;
    } catch (err) {
      setError(err.message || "Failed to delete data");
      console.error("Error deleting data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, deleteData };
};
