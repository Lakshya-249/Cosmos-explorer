import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Loader,
} from "lucide-react";

const SubFolderRow = ({
  subFolderLoader,
  children,
  openSubFolders,
  collections,
  filesLoader,
  toggleSubFolderClose,
  toggleSubFolderOpen,
  handleSelectedFile,
  folder,
  open,
}) => {
  return (
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
                    <FolderOpen size={16} className="text-green-600" />
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
                      toggleSubFolderOpen(sub.id, sub.parentId, sub.name)
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
                        handleSelectedFile(folder.id, sub.name, file)
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
  );
};

export default SubFolderRow;
