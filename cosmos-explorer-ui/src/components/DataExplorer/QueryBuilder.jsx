import React, { useCallback, useEffect, useState } from "react";
import { Play, Plus, Trash2 } from "lucide-react";

const QueryBuilder = ({ onExecuteQuery }) => {
  const [queryMode, setQueryMode] = useState("visual"); // 'visual' or 'sql'
  const [sqlQuery, setSqlQuery] = useState("SELECT TOP 10 * FROM c");
  const [orderBy, setOrderBy] = useState({
    field: "",
    direction: "ASC",
  });
  const [conditions, setConditions] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const operators = [
    { value: "eq", label: "Equals (=)", example: 'c.name = "John"' },
    { value: "ne", label: "Not Equals (≠)", example: 'c.status != "inactive"' },
    { value: "gt", label: "Greater Than (>)", example: "c.age > 30" },
    { value: "lt", label: "Less Than (<)", example: "c.score < 100" },
    { value: "gte", label: "Greater Than Equal (≥)", example: "c.age >= 18" },
    { value: "lte", label: "Less Than Equal (≤)", example: "c.price <= 1000" },
    {
      value: "inArray",
      label: "In Array",
      example: 'c.role IN ("admin", "user")',
    },
    {
      value: "ieq",
      label: "Case Insensitive Equals",
      example: 'UPPER(c.name) = UPPER("john")',
    },
    {
      value: "ilike",
      label: "Case Insensitive Contains",
      example: 'CONTAINS(UPPER(c.description), UPPER("test"))',
    },
  ];

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now(),
        field: "",
        operator: "eq",
        value: "",
        connector: conditions.length > 0 ? "and" : null,
      },
    ]);
  };

  const updateCondition = (id, updates) => {
    setConditions(
      conditions.map((cond) =>
        cond.id === id ? { ...cond, ...updates } : cond
      )
    );
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter((cond) => cond.id !== id));
  };

  const generateQuery = () => {
    if (queryMode === "sql") return sqlQuery;

    let orderClause = "";
    if (orderBy.field) {
      orderClause = ` ORDER BY c.${orderBy.field} ${orderBy.direction}`;
    }

    if (conditions.length === 0 && !orderBy.field)
      return "SELECT TOP 10 * FROM c";

    let whereClause = "";
    let validConditions = conditions.filter((cond) => cond.field && cond.value);

    if (validConditions.length === 0 && !orderBy.field)
      return "SELECT TOP 10 * FROM c";

    validConditions.forEach((cond, index) => {
      let conditionSql = "";
      let value = cond.value;

      // Format value based on type and operator
      if (cond.operator === "inArray") {
        try {
          const arrayValues = JSON.parse(cond.value);
          const formattedValues = arrayValues
            .map((v) => (typeof v === "string" ? `"${v}"` : v))
            .join(", ");
          conditionSql = `c.${cond.field} IN (${formattedValues})`;
        } catch (e) {
          const arrayValues = cond.value.split(",").map((v) => v.trim());
          const formattedValues = arrayValues
            .map((v) => (isNaN(v) ? `"${v}"` : v))
            .join(", ");
          conditionSql = `c.${cond.field} IN (${formattedValues})`;
        }
      } else {
        // Handle different operators
        const isStringValue =
          isNaN(value) &&
          value !== "true" &&
          value !== "false" &&
          value !== "null";
        const formattedValue = isStringValue ? `"${value}"` : value;

        switch (cond.operator) {
          case "eq":
            conditionSql = `c.${cond.field} = ${formattedValue}`;
            break;
          case "ne":
            conditionSql = `c.${cond.field} != ${formattedValue}`;
            break;
          case "gt":
            conditionSql = `c.${cond.field} > ${formattedValue}`;
            break;
          case "lt":
            conditionSql = `c.${cond.field} < ${formattedValue}`;
            break;
          case "gte":
            conditionSql = `c.${cond.field} >= ${formattedValue}`;
            break;
          case "lte":
            conditionSql = `c.${cond.field} <= ${formattedValue}`;
            break;
          case "ieq":
            conditionSql = `UPPER(c.${cond.field}) = UPPER(${formattedValue})`;
            break;
          case "ilike":
            conditionSql = `CONTAINS(UPPER(c.${cond.field}), UPPER(${formattedValue}))`;
            break;
          default:
            conditionSql = `c.${cond.field} = ${formattedValue}`;
        }
      }

      // Add connector for multiple conditions
      if (index === 0) {
        whereClause = conditionSql;
      } else {
        const connector = cond.connector?.toUpperCase() || "AND";
        whereClause += ` ${connector} ${conditionSql}`;
      }
    });

    console.log("order clause: ", orderClause);

    return `SELECT TOP 10 * FROM c${
      whereClause ? " WHERE " + whereClause : ""
    }${orderClause}`;
  };

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
        executeQuery();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [executeQuery]);

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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Conditions</span>
            <button
              onClick={addCondition}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Condition</span>
            </button>
          </div>

          {conditions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No conditions added. Click "Add Condition" to start building your
              query.
            </div>
          ) : (
            <div className="space-y-3">
              {conditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className="flex flex-wrap items-center space-x-2 p-3 space-y-2 bg-gray-50 rounded-lg"
                >
                  {index > 0 && (
                    <select
                      value={condition.connector}
                      onChange={(e) =>
                        updateCondition(condition.id, {
                          connector: e.target.value,
                        })
                      }
                      className="px-1 py-1 bg-black/2 text-gray-600 rounded text-sm"
                    >
                      <option value="and">AND</option>
                      <option value="or">OR</option>
                    </select>
                  )}

                  <input
                    type="text"
                    placeholder="Field name"
                    value={condition.field}
                    onChange={(e) =>
                      updateCondition(condition.id, { field: e.target.value })
                    }
                    className="flex-1 px-2 py-1 bg-black/2 rounded text-sm"
                  />

                  <select
                    value={condition.operator}
                    onChange={(e) =>
                      updateCondition(condition.id, {
                        operator: e.target.value,
                      })
                    }
                    className="px-3 py-1 rounded text-sm text-gray-600 bg-black/2"
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder={
                      condition.operator === "inArray"
                        ? '"value1", "value2"'
                        : "Value"
                    }
                    value={condition.value}
                    onChange={(e) =>
                      updateCondition(condition.id, { value: e.target.value })
                    }
                    className="flex-1 px-3 py-1 bg-black/2 rounded text-sm"
                  />

                  <button
                    onClick={() => removeCondition(condition.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Order By</span>
            </div>

            <div className="flex flex-wrap items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Field name"
                value={orderBy.field}
                onChange={(e) =>
                  setOrderBy((prev) => ({ ...prev, field: e.target.value }))
                }
                className="flex-1 px-2 py-1 bg-black/2 rounded text-sm"
              />

              <select
                value={orderBy.direction}
                onChange={(e) =>
                  setOrderBy((prev) => ({ ...prev, direction: e.target.value }))
                }
                className="px-3 py-1 rounded text-sm bg-black/2 text-gray-600"
              >
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
            <div className="text-gray-400 text-xs mb-1">
              Generated Cosmos DB SQL Query:
            </div>
            {generateQuery()}
          </div>
        </div>
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
