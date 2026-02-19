import { useState } from "react";

export const useQuery = () => {
  const [queryMode, setQueryMode] = useState("visual"); // 'visual' or 'sql'
  const [sqlQuery, setSqlQuery] = useState("SELECT TOP 10 * FROM c");
  const [orderBy, setOrderBy] = useState({
    field: "",
    direction: "ASC",
  });

  const makeQuery = (conditions, offset, limit) => {
    if (queryMode === "sql") return sqlQuery;

    let orderClause = "";
    if (orderBy.field) {
      orderClause = ` ORDER BY c.${orderBy.field} ${orderBy.direction}`;
    }

    if (conditions.length === 0 && !orderBy.field)
      return `SELECT * FROM c OFFSET ${offset} LIMIT ${limit}`;

    let whereClause = "";
    let validConditions = conditions.filter(
      (cond) => cond.field && cond.value && cond.enabled,
    );

    if (validConditions.length === 0 && !orderBy.field)
      return `SELECT * FROM c OFFSET ${offset} LIMIT ${limit}`;

    validConditions.forEach((cond, index) => {
      let conditionSql = "";
      let value = cond.value;

      if (cond.operator === "inArray") {
        try {
          const arrayValues = JSON.parse(cond.value);
          const formattedValues = arrayValues
            .map((v) => (typeof v === "string" ? `"${v}"` : v))
            .join(", ");
          conditionSql = `c.${cond.field} IN (${formattedValues})`;
        } catch (e) {
          console.log("Error parsing array:", e);
          const arrayValues = cond.value.split(",").map((v) => v.trim());
          const formattedValues = arrayValues
            .map((v) => (isNaN(v) ? `"${v}"` : v))
            .join(", ");
          conditionSql = `c.${cond.field} IN (${formattedValues})`;
        }
      } else {
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

      if (index === 0) {
        whereClause = conditionSql;
      } else {
        const connector = cond.connector?.toUpperCase() || "AND";
        whereClause += ` ${connector} ${conditionSql}`;
      }
    });

    return `SELECT * FROM c${
      whereClause ? " WHERE " + whereClause : ""
    }${orderClause} OFFSET ${offset} LIMIT ${limit}`;
  };

  return {
    makeQuery,
    queryMode,
    setQueryMode,
    sqlQuery,
    setSqlQuery,
    orderBy,
    setOrderBy,
  };
};
