import { Edit3, Trash2, X, Save } from "lucide-react";
import JsonView from "react18-json-view";

const DocumentList = ({
  data,
  editIndex,
  handleSaveEdit,
  updateLoading,
  setEditIndex,
  setEditValue,
  onDelete,
  deleteLoading,
  deletingId,
  editValue,
}) => {
  return (
    <>
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-md m-3 shadow-sm"
        >
          {/* Actions */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm px-4 py-2 text-gray-500">
              Document {index + 1}
            </span>
            <div className="flex space-x-2">
              {editIndex === item?.id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    disabled={updateLoading && editIndex === item.id}
                    className="flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                  >
                    {updateLoading && editIndex === item.id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full mr-1"></div>
                    ) : (
                      <Save className="w-3 h-3 mr-1" />
                    )}{" "}
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditIndex(null);
                      setEditValue("");
                    }}
                    className="flex items-center px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                  >
                    <X className="w-3 h-3 mr-1" /> Cancel
                  </button>
                </>
              ) : (
                <div className="flex space-x-4 p-2">
                  <button
                    onClick={() => {
                      setEditIndex(item.id);
                      setEditValue(JSON.stringify(item, null, 2));
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-150 cursor-pointer"
                    title="Edit document"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item?.id || "fjiono")}
                    disabled={deleteLoading && deletingId === item.id}
                    className="text-red-500 hover:text-red-700 relative cursor-pointer"
                  >
                    {deleteLoading && deletingId === item.id ? (
                      <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* JSON Viewer / Editor */}
          {editIndex === item.id ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full h-48 px-3 py-2 border border-gray-300 rounded font-mono text-sm resize-none"
            />
          ) : (
            <div className="max-h-[500px] overflow-auto hide-scrollbar bg-white rounded-b py-2 px-4">
              <JsonView
                src={item}
                collapsed={0}
                enableClipboard={true}
                displayDataTypes={false}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
