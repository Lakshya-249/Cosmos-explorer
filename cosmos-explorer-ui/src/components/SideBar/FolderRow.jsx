import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";

const FolderRow = ({ open, isOpen, folder, toggleFolder }) => {
  return (
    <div
      onClick={() => toggleFolder(folder.id)}
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

        {open && <span className="truncate max-w-[180px]">{folder.name}</span>}
      </span>

      {open &&
        (isOpen ? (
          <ChevronDown size={16} className="text-gray-500" />
        ) : (
          <ChevronRight size={16} className="text-gray-500" />
        ))}
    </div>
  );
};

export default FolderRow;
