import { memo, useState } from "react";
import { Search, Plus, X, Save } from "../../icons/index";
import QueryBuilder from "./QueryBuilder";
import JsonViewer from "./DataViewer";
import { useQuery } from "../../hooks/CollectionQuery";
import { useDelete } from "../../hooks/Delete";
import { useUpdate } from "../../hooks/Update";
import { useAddData } from "../../hooks/AddData";

const CosmosDBExplorer = ({ selectedCollection }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemData, setNewItemData] = useState(
    '{\n  "id": "",\n  "name": "",\n  "email": ""\n}'
  );
  const [deletingId, setDeletingId] = useState(null);

  const {
    isLoading,
    error: queryError,
    fetchQuery,
    data,
    setData: setList,
  } = useQuery();

  const handleCreate = async () => {
    try {
      const parsedData = JSON.parse(newItemData);
      console.log(parsedData);

      await addData(parsedData);

      setSuccess("Data added successfully: Please Refresh Page.");
      setShowCreateForm(false);
      setNewItemData('{\n  "id": "",\n  "name": "",\n  "email": ""\n}');
    } catch (error) {
      console.log("Error creating new item:", error);
      alert("Invalid JSON format. Please check your syntax.");
    }
  };

  const handleExecuteQuery = async (query, queryMode) => {
    setError(null);
    setSuccess(null);

    try {
      await fetchQuery(query);
      if (queryError) {
        setError("Error Getting Data:", queryError);
        return;
      }

      console.log(`Executing ${queryMode} query:`, query);
    } catch (err) {
      setError(err.message);
    }
  };

  const {
    isLoading: deleteLoading,
    error: deleteerror,
    deleteData,
    data: deletedData,
  } = useDelete();

  const handleDelete = async (did) => {
    const start = Date.now();
    setError(null);

    try {
      setDeletingId(did);
      await deleteData(did);
      if (deleteerror) {
        setError("Error deleting data:", deleteerror);
        return;
      }

      setList((prev) => prev.filter((item) => item.id !== did));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const {
    isLoading: updateLoading,
    error: updateError,
    updateData,
    data: updatedData,
  } = useUpdate();

  const handleUpdate = async (did, data) => {
    const start = Date.now();
    setError(null);

    try {
      await updateData(data);
      if (updateError) {
        setError("Error updating data:", updateError);
        return;
      }

      setList((prev) => prev.map((item) => (item.id === did ? data : item)));

      setSuccess("Data updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const {
    isLoading: addLoading,
    error: addError,
    addData,
    data: addedData,
  } = useAddData();

  const handleAddData = async (data) => {
    try {
      await addData(data);

      if (addError) {
        setError("Error adding data:", addError);
        return;
      }

      console.log("Added Data:", addedData);

      setSuccess("Data added successfully: Please Refresh Page.");

      // setList((prev) => [...prev, addedData]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cosmos DB Explorer :{" "}
            {selectedCollection || "No Collection Selected"}
          </h1>
          <p className="text-gray-600">
            Query and explore your Cosmos DB data with ease
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* xl:grid-cols-2 */}
          <div className="space-y-6">
            <QueryBuilder onExecuteQuery={handleExecuteQuery} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-red-800">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-green-800">
                    <strong>Success:</strong> {success}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Executing query...</span>
                </div>
              </div>
            ) : data && data?.length ? (
              <JsonViewer
                data={data}
                onDelete={handleDelete}
                deleteLoading={deleteLoading}
                deletingId={deletingId}
                onUpdate={handleUpdate}
                updateLoading={updateLoading}
                onAddData={handleAddData}
                addLoading={addLoading}
              />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg py-2">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 mb-2">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create</span>
                  </button>
                </div>
                {/* Create Form Modal */}
                {showCreateForm && (
                  <div className="p-4 border-b border-gray-200 bg-green-50 mb-2">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Create New Document
                      </h4>
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
                )}
                <div className="text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Execute a query to view results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CosmosDBExplorer);
