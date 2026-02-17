import { File, Loader } from "lucide-react";
import React from "react";

const FileRow = ({
  handleSelectedFile,
  isLoading,
  open,
  files = [],
  folder,
  sub,
  selected,
}) => {
  return (
    <div
      className="ml-6 mt-1 space-y-1 border-l border-gray-100 pl-3
      transition-all duration-300"
    >
      {isLoading && open && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader className="animate-spin" size={14} />
        </div>
      )}

      {!isLoading &&
        files.map((file) => {
          const isActive =
            selected?.id === folder.id &&
            selected?.database === sub.name &&
            selected?.collection === file;

          return (
            <div
              key={file}
              onClick={() => handleSelectedFile(folder.id, sub.name, file)}
              className={`flex items-center gap-2 p-1 rounded-md cursor-pointer transition
                ${
                  isActive
                    ? "bg-gray-50 border border-gray-200"
                    : "hover:bg-gray-50"
                }`}
            >
              <File
                size={14}
                className={isActive ? "text-blue-600" : "text-gray-500"}
              />

              {open && <span className="truncate max-w-[150px]">{file}</span>}
            </div>
          );
        })}
    </div>
  );
};

export default React.memo(FileRow);
