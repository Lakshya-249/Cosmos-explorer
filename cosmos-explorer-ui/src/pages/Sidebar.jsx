import { useEffect } from "react";
import SidebarHeader from "../components/SideBar/SidebarHeader.jsx";
import Loader from "../components/Loader.jsx";
import { ErrorPopup } from "../components/ErrorPop.jsx";
import FolderRow from "../components/SideBar/FolderRow.jsx";
import SubFolderRow from "../components/SideBar/SubFolderRow.jsx";
import { useSidebarQuery } from "../hooks/SidebarQuery.jsx";

export default function Sidebar({ open, setOpen, onCollectionClick }) {
  const {
    toggleFolder,
    toggleSubFolder,
    onAddConnection,
    handleSelectedFile,
    openFolders,
    openSubFolders,
    errorPopUp,
    getConnections,
    isLoading,
    connections,
    databases,
    dbLoading,
    collections,
    filesLoader,
    setErrorPopup,
  } = useSidebarQuery(onCollectionClick);

  useEffect(() => {
    const loadConnections = async () => {
      try {
        await getConnections();
      } catch (err) {
        setErrorPopup(err.message || "Failed to fetch connections");
      }
    };

    loadConnections();
  }, []);

  return (
    <div
      className={`h-full bg-white border-r shadow-md
        transition-all duration-300 flex flex-col
        ${open ? "w-80" : "w-20"}`}
    >
      <SidebarHeader
        open={open}
        setOpen={setOpen}
        onAddConnection={onAddConnection}
      />

      <ErrorPopup message={errorPopUp} onClose={() => setErrorPopup("")} />

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {connections.map((folder) => {
          const isOpen = openFolders[folder.id] || false;
          const children = databases.filter((db) => db.parentId === folder.id);

          return (
            <div key={folder.id}>
              <FolderRow
                isOpen={isOpen}
                open={open}
                toggleFolder={() => toggleFolder(folder.id)}
                folder={folder}
              />

              {isOpen && (
                <SubFolderRow
                  open={open}
                  folder={folder}
                  children={children}
                  toggleSubFolderOpen={toggleSubFolder}
                  openSubFolders={openSubFolders}
                  handleSelectedFile={handleSelectedFile}
                  collections={collections}
                  filesLoader={filesLoader}
                  dbLoading={dbLoading}
                />
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
