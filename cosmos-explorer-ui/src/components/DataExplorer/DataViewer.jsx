import { memo, useState } from "react";
import { RefreshCw, Plus } from "../../icons/index.jsx";
import "react18-json-view/src/style.css";
import Pagination from "./Pagination.jsx";
import CreateForm from "./CreateForm.jsx";
import DocumentList from "./DocumentList.jsx";

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
  onAddData,
  addLoading,
  onLimitChange,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemData, setNewItemData] = useState(
    '{\n  "id": "",\n  "name": "",\n  "email": ""\n}',
  );

  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleSaveEdit = async (id) => {
    try {
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
      await onAddData(parsedData);
      setShowCreateForm(false);
      setNewItemData('{\n  "id": "",\n  "name": "",\n  "email": ""\n}');
    } catch (error) {
      console.log("Error creating new item:", error);
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
            disabled={addLoading}
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
        <CreateForm
          setShowCreateForm={setShowCreateForm}
          newItemData={newItemData}
          setNewItemData={setNewItemData}
          handleCreate={handleCreate}
          addLoading={addLoading}
        />
      )}

      {/* Document List */}

      {data && data.length ? (
        <DocumentList
          data={data}
          editIndex={editIndex}
          handleSaveEdit={handleSaveEdit}
          updateLoading={updateLoading}
          setEditIndex={setEditIndex}
          setEditValue={setEditValue}
          onDelete={onDelete}
          deleteLoading={deleteLoading}
          deletingId={deletingId}
          editValue={editValue}
        />
      ) : (
        <p className="p-4 text-gray-500">No data available.</p>
      )}

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
};

export default memo(JsonViewer);
