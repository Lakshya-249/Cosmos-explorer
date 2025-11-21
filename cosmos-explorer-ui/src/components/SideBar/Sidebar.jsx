import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  File,
} from "../../icons/index.jsx";
import SidebarHeader from "./SidebarHeader";
import Loader from "../Loader.jsx";
import { useConnection } from "../../hooks/Connection.jsx";
import { useDatabase } from "../../hooks/Database.jsx";
import { useCollection } from "../../hooks/Collection.jsx";
import { ErrorPopup } from "../ErrorPop.jsx";
import { setSelectedCollection } from "../../utils/collection.store.js";

export default function Sidebar({ open, setOpen, setCollectionSelected }) {
  const [openFolders, setOpenFolders] = useState({});
  const [openSubFolders, setOpenSubFolders] = useState({});
  const { addConnection, getConnections, isLoading, error, connections } =
    useConnection();
  const {
    getDatabases,
    databases,
    isLoading: subFolderLoader,
    error: subFolderError,
  } = useDatabase();

  const [errorPopUp, setErrorPopup] = useState("");

  const {
    getCollections,
    isLoading: filesLoader,
    collections,
    error: filesError,
  } = useCollection();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        await getConnections();
      } catch (err) {
        console.error("Error fetching connections:", err);
        setErrorPopup("Failed to fetch connections: ", err.message);
      }
    };

    fetchConnections();
  }, []);

  const toggleFolderOpen = async (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
    if (subFolderLoader) return;

    await getDatabases(id);
    if (subFolderError) {
      console.error("Error fetching databases:", subFolderError);
      setErrorPopup("Failed to fetch databases: " + subFolderError);
      return;
    }
  };

  const toggleFolderClose = (id) => {
    setOpenFolders((prev) => ({ ...prev, [id]: false }));
  };

  const toggleSubFolderOpen = async (id, parentId, name) => {
    setOpenSubFolders((prev) => ({ ...prev, [id]: !prev[id] }));
    if (filesLoader[id]) return;
    await getCollections(id, parentId, name);
    console.log(collections);

    if (filesError) {
      console.error("Error fetching collections:", filesError);
      setErrorPopup("Failed to fetch collections: " + filesError);
      return;
    }
  };

  const toggleSubFolderClose = (id) => {
    setOpenSubFolders((prev) => ({ ...prev, [id]: false }));
  };

  const onAddConnection = async (data) => {
    await addConnection(data);
    if (error) {
      console.error("Error adding connection:", error);
      setErrorPopup("Failed to add connection: " + error);
      return;
    }
  };

  const handleSelectedFile = (id, database, file) => {
    setCollectionSelected(file);
    setSelectedCollection(id, database, file);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white border-r shadow-md 
        transition-all duration-300 z-50 flex flex-col
        ${open ? "w-85" : "w-20"}`}
    >
      {/* Sidebar Header */}
      <SidebarHeader
        open={open}
        setOpen={setOpen}
        onAddConnection={onAddConnection}
      />

      {/* Error Popup */}
      <ErrorPopup message={errorPopUp} onClose={() => setErrorPopup("")} />

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {connections.map((folder) => {
          const isOpen = openFolders[folder.id] || false;
          const children = databases.filter((sf) => sf.parentId === folder.id);

          return (
            <div key={folder.id}>
              {/* Folder Row */}
              <div
                className="flex items-center justify-between cursor-pointer p-2 rounded-md
                  hover:bg-gray-100 transition"
              >
                <span className="flex items-center gap-3 text-gray-700 font-medium">
                  <span className="bg-blue-50 p-1 rounded-md">
                    {isOpen ? (
                      <FolderOpen size={18} className="text-blue-600" />
                    ) : (
                      <Folder size={18} className="text-blue-600" />
                    )}
                  </span>
                  {open && folder.name}
                </span>
                {open &&
                  (isOpen ? (
                    <ChevronDown
                      size={16}
                      className="text-gray-500"
                      onClick={() => toggleFolderClose(folder.id)}
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-gray-500"
                      onClick={() => toggleFolderOpen(folder.id)}
                    />
                  ))}
              </div>

              {/* Subfolders (simple expand/collapse) */}
              {isOpen && (
                <div className="ml-6 mt-2 space-y-2 border-l border-gray-200 pl-3">
                  {subFolderLoader && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Loader />
                    </div>
                  )}
                  {children.map((sub) => {
                    const subOpen = openSubFolders[sub.id] || false;
                    const files = collections[sub.id] || [];
                    const isLoading = filesLoader[sub.id] || false;

                    return (
                      <div key={sub.id}>
                        {/* Subfolder */}

                        <div
                          className="flex items-center justify-between cursor-pointer p-2 rounded-md
                            hover:bg-gray-50 transition"
                        >
                          <span className="flex items-center gap-3 text-gray-600">
                            <span className="bg-green-50 p-1 rounded-md">
                              {subOpen ? (
                                <FolderOpen
                                  size={16}
                                  className="text-green-600"
                                />
                              ) : (
                                <Folder size={16} className="text-green-600" />
                              )}
                            </span>
                            {open && sub.name}
                          </span>
                          {open &&
                            (subOpen ? (
                              <ChevronDown
                                size={14}
                                className="text-gray-400"
                                onClick={() => toggleSubFolderClose(sub.id)}
                              />
                            ) : (
                              <ChevronRight
                                size={14}
                                className="text-gray-400"
                                onClick={() =>
                                  toggleSubFolderOpen(
                                    sub.id,
                                    sub.parentId,
                                    sub.name
                                  )
                                }
                              />
                            ))}
                        </div>

                        {/* Files */}
                        {subOpen && (
                          <div className="ml-6 mt-1 space-y-1 border-l border-gray-100 pl-3">
                            {isLoading && open && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Loader />
                              </div>
                            )}
                            {!isLoading &&
                              files.map((file, idx) => (
                                <div
                                  key={idx}
                                  onClick={() =>
                                    handleSelectedFile(
                                      folder.id,
                                      sub.name,
                                      file
                                    )
                                  }
                                  className="flex items-center gap-2 p-1 rounded-md cursor-pointer flex-wrap
                                    hover:bg-blue-50 hover:text-blue-600 transition"
                                >
                                  <File size={14} className="text-gray-500" />
                                  {open && file}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div
            className="flex items-center justify-between cursor-pointer p-2 rounded-md
                  hover:bg-gray-100 transition"
          >
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
