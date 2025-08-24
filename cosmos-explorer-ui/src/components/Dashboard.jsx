// Main Explorer Component
import React, { useState, useCallback } from "react";
import {
  Search,
  Play,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";

// Query Builder Component
const QueryBuilder = ({ onExecuteQuery }) => {
  const [queryMode, setQueryMode] = useState("visual"); // 'visual' or 'sql'
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM c");
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

    if (conditions.length === 0) return "SELECT * FROM c";

    let whereClause = "";
    let validConditions = conditions.filter((cond) => cond.field && cond.value);

    if (validConditions.length === 0) return "SELECT * FROM c";

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

    return `SELECT * FROM c WHERE ${whereClause}`;
  };

  const executeQuery = async () => {
    setIsExecuting(true);
    try {
      const query = generateQuery();
      await onExecuteQuery(query, queryMode);
    } finally {
      setIsExecuting(false);
    }
  };

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
                  className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                >
                  {index > 0 && (
                    <select
                      value={condition.connector}
                      onChange={(e) =>
                        updateCondition(condition.id, {
                          connector: e.target.value,
                        })
                      }
                      className="px-2 py-1 border rounded text-sm bg-white"
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
                    className="flex-1 px-3 py-1 border rounded text-sm"
                  />

                  <select
                    value={condition.operator}
                    onChange={(e) =>
                      updateCondition(condition.id, {
                        operator: e.target.value,
                      })
                    }
                    className="px-3 py-1 border rounded text-sm bg-white"
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
                    className="flex-1 px-3 py-1 border rounded text-sm"
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

// JSON Data Viewer Component
const JsonViewer = ({
  data,
  onUpdate,
  onDelete,
  onRefresh,
  pagination,
  onPageChange,
}) => {
  const [expandedPaths, setExpandedPaths] = useState(new Set(["root"]));
  const [hiddenFields, setHiddenFields] = useState(new Set());
  const [editingItem, setEditingItem] = useState(null);
  const [editedData, setEditedData] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemData, setNewItemData] = useState(
    '{\n  "id": "",\n  "name": "",\n  "email": ""\n}'
  );

  const toggleExpanded = (pathKey) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(pathKey)) {
      newExpanded.delete(pathKey);
    } else {
      newExpanded.add(pathKey);
    }
    setExpandedPaths(newExpanded);
  };

  const toggleFieldVisibility = (field) => {
    const newHidden = new Set(hiddenFields);
    if (newHidden.has(field)) {
      newHidden.delete(field);
    } else {
      newHidden.add(field);
    }
    setHiddenFields(newHidden);
  };

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
  };

  const startEditing = (index, item) => {
    setEditingItem(index);
    setEditedData(JSON.stringify(item, null, 2));
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditedData("");
  };

  const saveEdit = async () => {
    try {
      const parsedData = JSON.parse(editedData);
      await onUpdate(editingItem, parsedData);
      setEditingItem(null);
      setEditedData("");
    } catch (error) {
      alert("Invalid JSON format. Please check your syntax.");
    }
  };

  const handleDelete = async (index, item) => {
    if (
      window.confirm(
        `Are you sure you want to delete the item with ID: ${item.id}?`
      )
    ) {
      await onDelete(index, item);
    }
  };

  const handleCreate = async () => {
    try {
      const parsedData = JSON.parse(newItemData);
      await onUpdate(-1, parsedData); // -1 indicates new item
      setShowCreateForm(false);
      setNewItemData('{\n  "id": "",\n  "name": "",\n  "email": ""\n}');
    } catch (error) {
      alert("Invalid JSON format. Please check your syntax.");
    }
  };

  const getValueType = (value) => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  };

  const getValueColor = (type) => {
    switch (type) {
      case "string":
        return "text-green-600";
      case "number":
        return "text-blue-600";
      case "boolean":
        return "text-purple-600";
      case "null":
        return "text-gray-500";
      case "array":
        return "text-orange-600";
      case "object":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  const renderValue = (key, value, currentPath = []) => {
    const pathKey = [...currentPath, key].join(".");
    const type = getValueType(value);
    const isExpanded = expandedPaths.has(pathKey);
    const isHidden = hiddenFields.has(key);

    if (type === "object" && value !== null) {
      return (
        <div key={key} className="mb-2 transform-gpu">
          <div className="flex items-center space-x-2 group">
            <button
              onClick={() => toggleExpanded(pathKey)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-150"
            >
              <div className="transition-transform duration-200">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
              <span className="font-medium text-gray-800">"{key}":</span>
            </button>
            <span className="text-gray-500 text-xs">
              {Object.keys(value).length}{" "}
              {Object.keys(value).length === 1 ? "property" : "properties"}
            </span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity duration-200">
              <button
                onClick={() => toggleFieldVisibility(key)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                title={isHidden ? "Show field" : "Hide field"}
              >
                {isHidden ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(value)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                title="Copy to clipboard"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div
            className={`ml-6 mt-1 border-l-2 border-gray-200 pl-4 transition-all duration-300 overflow-hidden ${
              isExpanded && !isHidden
                ? "opacity-100 max-h-none"
                : "opacity-0 max-h-0"
            }`}
          >
            {isExpanded &&
              !isHidden &&
              Object.entries(value).map(([k, v]) =>
                renderValue(k, v, [...currentPath, key])
              )}
          </div>
        </div>
      );
    }

    if (type === "array") {
      return (
        <div key={key} className="mb-2 transform-gpu">
          <div className="flex items-center space-x-2 group">
            <button
              onClick={() => toggleExpanded(pathKey)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-150"
            >
              <div className="transition-transform duration-200">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
              <span className="font-medium text-gray-800">"{key}":</span>
            </button>
            <span className="text-orange-600 text-xs">
              [{value.length} {value.length === 1 ? "item" : "items"}]
            </span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity duration-200">
              <button
                onClick={() => toggleFieldVisibility(key)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                title={isHidden ? "Show field" : "Hide field"}
              >
                {isHidden ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(value)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                title="Copy to clipboard"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div
            className={`ml-6 mt-1 border-l-2 border-gray-200 pl-4 transition-all duration-300 overflow-hidden ${
              isExpanded && !isHidden
                ? "opacity-100 max-h-none"
                : "opacity-0 max-h-0"
            }`}
          >
            {isExpanded &&
              !isHidden &&
              value.map((item, index) =>
                renderValue(index, item, [...currentPath, key])
              )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={key}
        className="mb-1 flex items-center space-x-2 group transform-gpu"
      >
        <span className="font-medium text-gray-800 min-w-0">"{key}":</span>
        <span className={`${getValueColor(type)} break-all`}>
          {type === "string" ? `"${value}"` : JSON.stringify(value)}
        </span>
        <span className="text-xs text-gray-400">({type})</span>
        <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity duration-200">
          <button
            onClick={() => toggleFieldVisibility(key)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
            title={isHidden ? "Show field" : "Hide field"}
          >
            {isHidden ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => copyToClipboard(value)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
            title="Copy to clipboard"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Data Viewer</h3>
          {pagination && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>
                Showing {pagination.start + 1}-
                {Math.min(
                  pagination.start + pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setExpandedPaths(new Set())}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Collapse All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => {
              const allPaths = new Set(["root"]);
              const addPaths = (obj, currentPath = []) => {
                if (typeof obj === "object" && obj !== null) {
                  Object.keys(obj).forEach((key) => {
                    const newPath = [...currentPath, key].join(".");
                    allPaths.add(newPath);
                    addPaths(obj[key], [...currentPath, key]);
                  });
                }
              };
              if (Array.isArray(data)) {
                data.forEach((item, index) => addPaths(item, [index]));
              } else {
                addPaths(data);
              }
              setExpandedPaths(allPaths);
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Expand All
          </button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="p-4 border-b border-gray-200 bg-green-50">
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
              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              <Save className="w-3 h-3" />
              <span>Create</span>
            </button>
          </div>
        </div>
      )}

      <div
        className="p-4 max-h-[600px] overflow-auto scroll-smooth scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
        style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
      >
        {Array.isArray(data) ? (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-medium text-gray-800">Documents</span>
              <span className="text-orange-600 text-sm">
                [{data.length} items]
              </span>
            </div>
            {data.map((item, index) => (
              <div
                key={item.id || index}
                className="mb-4 border border-gray-200 rounded-lg transform-gpu will-change-transform"
              >
                <div className="flex items-center justify-between p-3 bg-gray-50 border-b transition-colors duration-150">
                  <div className="text-sm text-gray-600">
                    Document{" "}
                    {pagination ? pagination.start + index + 1 : index + 1}
                    {item.id && (
                      <span className="ml-2 font-mono text-xs">
                        ID: {item.id}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(item)}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                      title="Copy document"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEditing(index, item)}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-150"
                      title="Edit document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index, item)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-150"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingItem === index ? (
                  <div className="p-3">
                    <textarea
                      value={editedData}
                      onChange={(e) => setEditedData(e.target.value)}
                      className="w-full h-64 px-3 py-2 border border-gray-300 rounded font-mono text-sm resize-none"
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={cancelEditing}
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 text-sm"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={saveEdit}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    {typeof item === "object" && item !== null ? (
                      Object.entries(item).map(([key, value]) =>
                        renderValue(key, value, [index])
                      )
                    ) : (
                      <span className={getValueColor(getValueType(item))}>
                        {JSON.stringify(item)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : data && typeof data === "object" ? (
          Object.entries(data).map(([key, value]) => renderValue(key, value))
        ) : (
          <span className={getValueColor(getValueType(data))}>
            {JSON.stringify(data, null, 2)}
          </span>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex items-center space-x-1">
              {Array.from(
                {
                  length: Math.min(
                    5,
                    Math.ceil(pagination.total / pagination.limit)
                  ),
                },
                (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  if (
                    pageNum <= Math.ceil(pagination.total / pagination.limit)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-2 py-1 text-sm rounded ${
                          pageNum === pagination.page
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                }
              )}
            </div>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={
                pagination.page >=
                Math.ceil(pagination.total / pagination.limit)
              }
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Explorer Component
const CosmosDBExplorer = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mockData = [
    {
      id: "1",
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA",
      },
      roles: ["admin", "user"],
      active: true,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      age: 25,
      email: "jane.smith@example.com",
      address: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        country: "USA",
      },
      roles: ["user"],
      active: false,
      createdAt: "2024-01-20T14:15:00Z",
    },
  ];

  const handleExecuteQuery = async (query, queryMode) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, return mock data
      // In real implementation, you would call your Cosmos DB API here
      console.log(`Executing ${queryMode} query:`, query);

      setResults(mockData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cosmos DB Explorer
          </h1>
          <p className="text-gray-600">
            Query and explore your Cosmos DB data with ease
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Executing query...</span>
                </div>
              </div>
            ) : results ? (
              <JsonViewer data={results} />
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8">
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

export default CosmosDBExplorer;
