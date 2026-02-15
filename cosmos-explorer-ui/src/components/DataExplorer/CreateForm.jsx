import { X, Save } from "../../icons/index";

const CreateForm = ({
  setShowCreateForm,
  newItemData,
  setNewItemData,
  handleCreate,
  addLoading,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-green-50 mb-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Create New Document</h4>
        <button
          onClick={() => setShowCreateForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <textarea
        value={newItemData}
        onChange={(e) => setNewItemData(e.target.value)}
        className="w-full h-32 px-3 py-2 border border-gray-300 rounded font-mono text-sm resize-none"
        placeholder="Enter JSON data for the new document..."
      />
      <div className="flex justify-end space-x-2 mt-3">
        <button
          onClick={() => setShowCreateForm(false)}
          className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={addLoading}
          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 cursor-pointer"
        >
          <Save className="w-3 h-3" />
          <span>{addLoading ? "Creating..." : "Create"}</span>
        </button>
      </div>
    </div>
  );
};

export default CreateForm;
