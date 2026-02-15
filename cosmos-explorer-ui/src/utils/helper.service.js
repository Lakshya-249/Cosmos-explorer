export function extractKeys(objs) {
  if (!objs || !objs.length) return [];

  const keysSet = new Set();

  const traverse = (obj, currentPrefix = "") => {
    for (const key in obj) {
      const newKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      keysSet.add(newKey);

      const value = obj[key];
      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          // If array of objects, traverse each object
          value.forEach((item) => {
            if (item && typeof item === "object") traverse(item, newKey);
          });
        } else {
          traverse(value, newKey);
        }
      }
    }
  };

  objs.forEach((obj) => traverse(obj));

  return Array.from(keysSet);
}

export function getSuggestions(input, keys) {
  return keys.filter((k) => k.toLowerCase().includes(input.toLowerCase()));
}

export function GetSuggestionsArray(data, collection) {
  if (!data || !data[collection] || !data[collection].length)
    return [
      {
        label: "No suggestions",
        value: "",
      },
    ];
  const keys = extractKeys(data[collection]);
  return keys.map((key) => ({
    label: key,
    value: key,
  }));
}

export const OPERATORS = [
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
