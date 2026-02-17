import { useState } from "react";
import { APIURL } from "../utils/contant.js";

export const useConnection = () => {
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addConnection = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${APIURL}/api/add-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add connection");
      }

      const result = await response.json();

      setConnections((prev) => [...prev, result?.data]);
      // return result; // return result so caller can use it
    } catch (err) {
      setError(err.message || "Failed to add connection");
      console.error("Error adding connection:", err);
      // throw err; // rethrow for caller
    } finally {
      setIsLoading(false);
    }
  };

  const getConnections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${APIURL}/api/get-connections`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }
      const result = await response.json();

      setConnections(result?.connections || []);
      // return result; // return result so caller can use it
    } catch (err) {
      setError(err.message || "Failed to fetch connections");
      console.error("Error fetching connections:", err);
      // throw err; // rethrow for caller
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addConnection,
    getConnections,
    connections,
    isLoading,
    error,
  };
};
