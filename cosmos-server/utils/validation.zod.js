import { z } from "zod";

export const validationErrorResponse = (errors) => {
  return {
    message: "Validation failed",
    errors: errors?.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    })),
  };
};

const ValidationSchemas = {
  addConnectionSchema: z.object({
    name: z.string().min(1, "Name is required"),
    endpoint: z.url("Invalid URL format"),
    key: z.string().min(1, "Key is required"),
  }),

  connectionSchema: z.object({
    id: z.string().optional(),
    database: z.string().min(1, "Database name is required"),
    collection: z.string().min(1, "Collection name is required"),
  }),
};

export default ValidationSchemas;
