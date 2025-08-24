import { useState } from "react";
import { APIURL } from "../utils/contant.js";

export const useCollection = () => {
  const [collections, setCollections] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [error, setError] = useState(null);

  const getCollections = async (id, parentId, database) => {
    setIsLoading({ [id]: true });
    setError(null);
    try {
      const response = await fetch(
        `${APIURL}/api/connections/${parentId}/databases/${database}/collections`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }
      const result = await response.json();

      setCollections((prev) => ({ ...prev, [id]: result?.collections || [] }));
      console.log("Collections fetched:", collections);

      // return result;
    } catch (err) {
      setError(err.message || "Failed to fetch collections");
      console.error("Error fetching collections:", err);
      // throw err;
    } finally {
      setIsLoading({ [id]: false });
    }
  };

  return {
    getCollections,
    collections,
    isLoading,
    error,
  };
};
