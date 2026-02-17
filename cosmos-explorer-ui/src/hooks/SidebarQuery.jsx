import { useState, useCallback } from "react";
import { useDatabase } from "./Database";
import { useCollection } from "./Collection";
import { useConnection } from "./Connection";
import {
  getSelectedCollection,
  setSelectedCollection,
} from "../utils/collection.store";

export const useSidebarQuery = (onCollectionClick) => {
  const [openFolders, setOpenFolders] = useState({});
  const [openSubFolders, setOpenSubFolders] = useState({});
  const [errorPopUp, setErrorPopup] = useState("");
  const [selected, setSelected] = useState(getSelectedCollection());

  console.log("INitial selected", selected);

  const { addConnection, getConnections, isLoading, connections } =
    useConnection();

  const { getDatabases, databases, isLoading: dbLoading } = useDatabase();

  const { getCollections, collections, filesLoader } = useCollection();

  const toggleFolder = async (id) => {
    setOpenFolders((prev) => {
      const isOpening = !prev[id];

      if (!isOpening) return { ...prev, [id]: false };

      return { ...prev, [id]: true };
    });

    const alreadyLoaded = databases.some((db) => db.parentId === id);
    if (alreadyLoaded) return;

    try {
      await getDatabases(id);
    } catch (err) {
      setErrorPopup(err.message || "Failed to fetch databases");
    }
  };

  const toggleSubFolder = async (dbId, parentId, dbName) => {
    setOpenSubFolders((prev) => {
      const isOpening = !prev[dbId];

      if (!isOpening) return { ...prev, [dbId]: false };

      return { ...prev, [dbId]: true };
    });

    const alreadyLoaded = collections[dbId];
    if (alreadyLoaded) return;

    try {
      await getCollections(dbId, parentId, dbName);
    } catch (err) {
      setErrorPopup(err.message || "Failed to fetch collections");
    }
  };

  const onAddConnection = async (data) => {
    try {
      await addConnection(data);
    } catch (err) {
      setErrorPopup(err.message || "Failed to add connection");
    }
  };

  const handleSelectedFile = useCallback(
    (id, database, file) => {
      setSelected({ id, database, collection: file });
      onCollectionClick({ id, file, database });
      setSelectedCollection(id, database, file);
    },
    [onCollectionClick],
  );

  return {
    toggleFolder,
    toggleSubFolder,
    onAddConnection,
    handleSelectedFile,
    openFolders,
    openSubFolders,
    errorPopUp,
    selected,
    getConnections,
    isLoading,
    connections,
    databases,
    dbLoading,
    collections,
    filesLoader,
    setErrorPopup,
  };
};
