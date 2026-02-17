import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Loader,
} from "lucide-react";
import FileRow from "./FileRow";

const SubFolderRow = ({
  children,
  openSubFolders,
  collections,
  filesLoader,
  toggleSubFolderOpen,
  handleSelectedFile,
  folder,
  open,
  dbLoading,
}) => {
  return (
    <div className="ml-6 mt-2 space-y-2 border-l border-gray-200 pl-3">
      {/* Database loading (while fetching databases) */}
      {dbLoading && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader className="animate-spin" size={16} />
        </div>
      )}

      {children.map((sub) => {
        const subOpen = openSubFolders?.[sub.id] ?? false;
        const files = collections?.[sub.id] ?? [];
        const isLoading = filesLoader?.[sub.id] ?? false;

        return (
          <div key={sub.id}>
            {/* SUBFOLDER ROW */}
            <div
              onClick={() =>
                toggleSubFolderOpen(sub.id, sub.parentId, sub.name)
              }
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

                {open && (
                  <span className="truncate max-w-[160px]">{sub.name}</span>
                )}
              </span>

              {open &&
                (subOpen ? (
                  <ChevronDown size={14} className="text-gray-400" />
                ) : (
                  <ChevronRight size={14} className="text-gray-400" />
                ))}
            </div>

            {/* FILES */}
            {subOpen && (
              <FileRow
                handleSelectedFile={handleSelectedFile}
                isLoading={isLoading}
                open={open}
                files={files}
                folder={folder}
                sub={sub}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SubFolderRow;
