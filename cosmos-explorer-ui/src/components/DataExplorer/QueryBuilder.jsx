import { useCallback, useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useConditions } from "../../hooks/Conditions";
import { useQuery } from "../../hooks/Query";
import ConditionFilter from "./ConditionFilter";

const QueryBuilder = ({
  onExecuteQuery,
  offset = 0,
  limit = 10,
  suggestions = [{ value: "value", label: "key" }],
}) => {
  const [isExecuting, setIsExecuting] = useState(false);

  const { fetchConditions, addCondition, updateCondition, removeCondition } =
    useConditions();

  const conditions = fetchConditions();

  const {
    makeQuery,
    queryMode,
    setQueryMode,
    sqlQuery,
    setSqlQuery,
    orderBy,
    setOrderBy,
  } = useQuery();

  const generateQuery = useCallback(
    () => makeQuery(conditions, offset, limit),
    [queryMode, sqlQuery, orderBy, conditions, offset, limit],
  );

  const executeQuery = useCallback(async () => {
    setIsExecuting(true);
    try {
      const query = generateQuery();
      await onExecuteQuery(query, queryMode);
    } finally {
      setIsExecuting(false);
    }
  }, [generateQuery, queryMode, onExecuteQuery]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        executeQuery();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [executeQuery]);

  useEffect(() => {
    executeQuery();
  }, [offset, limit]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Query Builder</h2>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setQueryMode("visual")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                queryMode === "visual"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Visual
            </button>
            <button
              onClick={() => setQueryMode("sql")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                queryMode === "sql"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              SQL
            </button>
          </div>
        </div>
      </div>

      {queryMode === "visual" ? (
        <ConditionFilter
          conditions={conditions}
          addCondition={addCondition}
          updateCondition={updateCondition}
          removeCondition={removeCondition}
          suggestions={suggestions}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          generateQuery={generateQuery}
        />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              SQL Query
            </label>
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="SELECT * FROM c WHERE c.name = 'John'"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={executeQuery}
          disabled={isExecuting}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>{isExecuting ? "Executing..." : "Execute Query"}</span>
        </button>
      </div>
    </div>
  );
};

export default QueryBuilder;
