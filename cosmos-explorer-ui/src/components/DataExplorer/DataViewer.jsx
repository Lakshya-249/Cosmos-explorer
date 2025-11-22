import { memo, useState } from "react";
import { RefreshCw, Plus, X, Save, Edit3, Trash2 } from "../../icons/index.jsx";

import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

const JsonViewer = ({
  data,
  onUpdate,
  onDelete,
  deleteLoading,
  deletingId,
  onRefresh,
  pagination,
  onPageChange,
  updateLoading,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemData, setNewItemData] = useState(
    '{\n  "id": "",\n  "name": "",\n  "email": ""\n}'
  );

  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  console.log("Deleting ID: ", deletingId);

  const handleSaveEdit = async (id) => {
    try {
      console.log("Edit Value: ", editValue);

      const parsedData = JSON.parse(editValue);
      await onUpdate(id || "fdscx", parsedData);
      setEditValue("");
      setEditIndex(null);
    } catch (error) {
      console.log("Error: ", error);

      alert("Invalid JSON format while saving edit.");
    }
  };

  const handleCreate = async () => {
    try {
      const parsedData = JSON.parse(newItemData);
      await onUpdate(-1, parsedData);
      setShowCreateForm(false);
      setNewItemData('{\n  "id": "",\n  "name": "",\n  "email": ""\n}');
    } catch (error) {
      alert("❌ Invalid JSON format. Please check your syntax.");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-800">📂 Data Viewer</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
          <button
            onClick={onRefresh}
            className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="p-5 bg-green-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Create New Document</h4>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <textarea
            value={newItemData}
            onChange={(e) => setNewItemData(e.target.value)}
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-1 px-4 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>
      )}

      {/* Document List */}

      {data && data.length ? (
        data.map((item, index) => (
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
                {editIndex === item.id ? (
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
        ))
      ) : (
        <p className="p-4 text-gray-500">No data available.</p>
      )}

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <span className="text-sm text-gray-600">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >=
                Math.ceil(pagination.total / pagination.limit)
              }
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(JsonViewer);
