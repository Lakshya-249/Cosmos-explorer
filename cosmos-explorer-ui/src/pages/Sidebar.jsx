import { useEffect, useState } from "react";
import SidebarHeader from "../components/SideBar/SidebarHeader.jsx";
import Loader from "../components/Loader.jsx";
import { useConnection } from "../hooks/Connection.jsx";
import { useDatabase } from "../hooks/Database.jsx";
import { useCollection } from "../hooks/Collection.jsx";
import { ErrorPopup } from "../components/ErrorPop.jsx";
import { setSelectedCollection } from "../utils/collection.store.js";
import FolderRow from "../components/SideBar/FolderRow.jsx";
import SubFolderRow from "../components/SideBar/SubFolderRow.jsx";

export default function Sidebar({ open, setOpen, onCollectionClick }) {
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
    onCollectionClick({ id, file, database });
    setSelectedCollection(id, database, file);
  };

  return (
    <div
      className={`h-full bg-white border-r shadow-md
        transition-all duration-300 flex flex-col
        ${open ? "w-80" : "w-20"}`}
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
              <FolderRow
                isOpen={isOpen}
                open={open}
                toggleFolderClose={toggleFolderClose}
                toggleFolderOpen={toggleFolderOpen}
                folder={folder}
              />

              {/* Subfolders (simple expand/collapse) */}
              {isOpen && (
                <SubFolderRow
                  isOpen={isOpen}
                  open={open}
                  toggleSubFolderClose={toggleSubFolderClose}
                  toggleSubFolderOpen={toggleSubFolderOpen}
                  subFolderLoader={subFolderLoader}
                  openSubFolders={openSubFolders}
                  handleSelectedFile={handleSelectedFile}
                  collections={collections}
                  filesLoader={filesLoader}
                  folder={folder}
                  children={children}
                />
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
