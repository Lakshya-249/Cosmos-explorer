import { OPERATORS } from "../../utils/helper.service";
import { Plus, Trash2 } from "lucide-react";
import Select from "react-select";

const ConditionFilter = ({
  conditions,
  addCondition,
  updateCondition,
  suggestions,
  removeCondition,
  orderBy,
  setOrderBy,
  generateQuery,
}) => {
  const operators = OPERATORS;

  return (
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

              {/* <input
              type="text"
              placeholder="Field name"
              value={condition.field}
              onChange={(e) =>
                updateCondition(condition.id, { field: e.target.value })
              }
              className="flex-1 px-2 py-1 bg-black/2 rounded text-sm"
            />*/}

              <div className="flex-1">
                <Select
                  options={suggestions}
                  value={
                    suggestions.find((opt) => opt.value === condition.field) ||
                    null
                  }
                  onChange={(selectedOption) =>
                    updateCondition(condition.id, {
                      field: selectedOption?.value || "",
                    })
                  }
                  placeholder="Search Field name..."
                  isSearchable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      fontSize: "14px",
                      minWidth: "250px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>

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
                className="flex-1 px-3 py-2 bg-black/2 rounded text-sm"
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
  );
};

export default ConditionFilter;
