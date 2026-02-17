import { memo, useState, useMemo } from "react";
import QueryBuilder from "../components/DataExplorer/QueryBuilder";
import JsonViewer from "../components/DataExplorer/DataViewer";
import CreateForm from "../components/DataExplorer/CreateForm";
import { Loader2 } from "../components/Loader";
import { ErrorResponse, SuccessResponse } from "../components/Response";
import { Search, Plus } from "../icons/index";
import { useExtractKeys } from "../hooks/ExtractKeys";
import { useExplorerCrud } from "../hooks/ExplorerCrud";

const CosmosDBExplorer = ({ selectedCollection }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data,
    error,
    success,
    deletingId,
    handleExecuteQuery,
    handleDelete,
    handleUpdate,
    handleCreate,
    handleAddData,
    showCreateForm,
    setShowCreateForm,
    isLoading,
    deleteLoading,
    updateLoading,
    addLoading,
    newItemData,
    setNewItemData,
  } = useExplorerCrud();

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // reset to first page
  };

  const offset = useMemo(() => (page - 1) * limit, [page, limit]);

  const { extractKeys } = useExtractKeys();

  const suggestions = useMemo(() => {
    let results = extractKeys(data, selectedCollection);
    return results;
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
              collection={selectedCollection}
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
