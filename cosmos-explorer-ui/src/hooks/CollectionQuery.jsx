import { useState } from "react";
import { APIURL } from "../utils/contant.js";
import { getSelectedCollection } from "../utils/collection.store.js";

export const useQuery = () => {
  const [data, setData] = useState({
    "collection-db": [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuery = async (query) => {
    const { id, database, collection } = getSelectedCollection() || {};
    if (!id || !database || !collection) {
      throw new Error("No collection selected");
    }
    setIsLoading(true);
    setError(null);
    const collection_id = `${collection} | ${database}`;

    try {
      const response = await fetch(
        `${APIURL}/api/connections/${id}/databases/${database}/collections/${collection}/filter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData((d) => ({ ...d, [collection_id]: result?.items || [] }));
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchQuery, data, setData };
};
