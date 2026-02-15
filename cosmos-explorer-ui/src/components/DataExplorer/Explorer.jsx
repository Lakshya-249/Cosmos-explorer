import { memo, useState } from "react";
import QueryBuilder from "./QueryBuilder";
import JsonViewer from "./DataViewer";
import { useQuery } from "../../hooks/CollectionQuery";
import { useDelete } from "../../hooks/Delete";
import { useUpdate } from "../../hooks/Update";
import { useAddData } from "../../hooks/AddData";
import { GetSuggestionsArray } from "../../utils/helper.service";
import { useMemo } from "react";
import CreateForm from "./CreateForm";
import { Loader2 } from "../Loader";
import { ErrorResponse, SuccessResponse } from "../Response";
import { Search, Plus } from "../../icons/index";

const CosmosDBExplorer = ({ selectedCollection }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemData, setNewItemData] = useState(
    '{\n  "id": "",\n  "name": "",\n  "email": ""\n}',
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
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
  } = useDelete();

  const handleDelete = async (did) => {
    setError(null);

    try {
      setDeletingId(did);
      await deleteData(did);
      if (deleteerror) {
        setError("Error deleting data:", deleteerror);
        return;
      }

      setList((prev) => prev.filter((item) => item.id !== did));
      setSuccess("Data deleted successfully");
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
  } = useUpdate();

  const handleUpdate = async (did, data) => {
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

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // reset to first page
  };

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const suggestions = useMemo(() => {
    return GetSuggestionsArray(data, selectedCollection);
  }, [data, selectedCollection]);

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
            <QueryBuilder
              onExecuteQuery={handleExecuteQuery}
              offset={offset}
              limit={limit}
              suggestions={suggestions}
            />

            {error && <ErrorResponse error={error} />}

            {success && <SuccessResponse success={success} />}
          </div>
          <div className="space-y-6">
            {isLoading ? (
              <Loader2 />
            ) : data &&
              data[selectedCollection] &&
              data[selectedCollection]?.length ? (
              <JsonViewer
                data={data[selectedCollection]}
                onDelete={handleDelete}
                deleteLoading={deleteLoading}
                deletingId={deletingId}
                onUpdate={handleUpdate}
                updateLoading={updateLoading}
                onAddData={handleAddData}
                addLoading={addLoading}
                pagination={{
                  page,
                  limit,
                  total: data[selectedCollection]?.length || 0,
                }}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
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
                  <CreateForm
                    setShowCreateForm={setShowCreateForm}
                    newItemData={newItemData}
                    setNewItemData={setNewItemData}
                    handleCreate={handleCreate}
                    addLoading={addLoading}
                  />
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
