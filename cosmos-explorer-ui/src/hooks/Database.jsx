import { useState } from "react";
import { APIURL } from "../utils/contant.js";

export const useDatabase = () => {
  const [databases, setDatabases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDatabase = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${APIURL}/api/add-database`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add database");
      }

      const result = await response.json();

      return result;
    } catch (err) {
      setError(err.message || "Failed to add database");
      console.error("Error adding database:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDatabases = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${APIURL}/api/connections/${id}/databases`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch databases");
      }
      const result = await response.json();

      const newSubFolders = (result?.databases || []).filter((sf) => {
        return !databases.some((s) => s.id === sf.id);
      });
      setDatabases((prev) => [...prev, ...newSubFolders]);
      // return result;
    } catch (err) {
      setError(err.message || "Failed to fetch databases");
      console.error("Error fetching databases:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    addDatabase,
    getDatabases,
    databases,
    isLoading,
    error,
  };
};
