import { ConnectionStore } from "../utils/connection.store.js";
import ValidationSchemas, {
  validationErrorResponse,
} from "../utils/validation.zod.js";

import { randomUUID } from "crypto"; // Importing uuid to generate unique IDs

const internalServerError = (res, error) => {
  console.error("Internal Server Error:", error);
  return res.status(500).json({
    message: "Internal Server Error",
    error: error.message,
  });
};

const userController = {
  addConnection: async (req, res) => {
    try {
      const validation = ValidationSchemas.addConnectionSchema.safeParse(
        req.body
      );
      if (!validation.success) {
        return res
          .status(400)
          .json(validationErrorResponse(validation.error.errors));
      }

      const { name, endpoint, key } = validation.data;
      const id = randomUUID();
      await ConnectionStore.saveConnection(id, endpoint, key, name);

      res.status(200).json({
        message: "Connection added successfully",
        data: { id, name },
      });
    } catch (error) {
      return internalServerError(res, error);
    }
  },

  getConnections: async (req, res) => {
    try {
      const connections = await ConnectionStore.getAllConnections();
      res.status(200).json({
        message: "Connections retrieved successfully",
        connections: connections.map((c) => ({
          id: c.id,
          name: c.name,
        })),
      });
    } catch (error) {
      return internalServerError(res, error);
    }
  },

  getDatabases: async (req, res) => {
    try {
      const { id } = req.params;
      const client = await ConnectionStore.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const databases = await client.databases.readAll().fetchAll();

      res.status(200).json({
        message: "Databases retrieved successfully",
        databases:
          databases?.resources?.map((d, i) => {
            return {
              parentId: id,
              id: `${id}-${i}`,
              name: d.id,
            };
          }) || [],
      });
    } catch (error) {
      return internalServerError(res, error);
    }
  },

  getCollections: async (req, res) => {
    try {
      const { id, database } = req.params;
      const client = await ConnectionStore.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const db = client.database(database);
      const collections = await db.containers.readAll().fetchAll();

      res.status(200).json({
        message: "Collections retrieved successfully",
        collections: collections.resources.map((c) => c.id),
      });
    } catch (error) {
      return internalServerError(res, error);
    }
  },

  getFilterData: async (req, res) => {
    try {
      const validation = ValidationSchemas.connectionSchema.safeParse(
        req.params
      );
      if (!validation.success) {
        return res
          .status(400)
          .json(validationErrorResponse(validation.error.errors));
      }

      const { id, database, collection } = validation.data;

      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
      }
      console.log(`Query: ${query}`);

      const client = await ConnectionStore.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const db = client.database(database);
      const container = db.container(collection);
      const querySpec = {
        query,
      };
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

      res.status(200).json({ message: "Data Fetched Succesfully", items });
    } catch (error) {
      return internalServerError(res, error);
    }
  },

  addDataToCollection: async (req, res) => {
    try {
      const validation = ValidationSchemas.connectionSchema.safeParse(
        req.params
      );
      if (!validation.success) {
        return res
          .status(400)
          .json(validationErrorResponse(validation.error.errors));
      }

      const { id, database, collection } = validation.data;

      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Data is required" });
      }

      const client = await ConnectionStore.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const db = client.database(database);
      const container = db.container(collection);
      const { resource: createdItem } = await container.items.create(data);

      res.status(201).json({
        message: "Data added successfully",
        item: createdItem,
      });
    } catch (error) {
      return internalServerError(res, error);
    }
  },

  updateDataInCollection: async (req, res) => {
    try {
      const validation = ValidationSchemas.connectionSchema.safeParse(
        req.params
      );
      if (!validation.success) {
        return res
          .status(400)
          .json(validationErrorResponse(validation.error.errors));
      }

      const { id, database, collection } = validation.data;

      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Data is required" });
      }

      const client = await ConnectionStore.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const db = client.database(database);
      const container = db.container(collection);
      const { resource: updatedItem } = await container.items.upsert(data);

      res.status(200).json({
        message: "Data updated successfully",
        item: updatedItem,
      });
    } catch (error) {
      return internalServerError(res, error);
    }
  },

  deleteDataFromCollection: async (req, res) => {
    try {
      const validation = ValidationSchemas.connectionSchema.safeParse(
        req.params
      );
      if (!validation.success) {
        return res
          .status(400)
          .json(validationErrorResponse(validation.error.errors));
      }

      const { id, database, collection } = validation.data;

      const dataId = req.body.id;
      if (!dataId) {
        return res.status(400).json({ error: "Data ID is required" });
      }

      const client = await ConnectionStore.getClient(id);
      if (!client) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const db = client.database(database);
      const container = db.container(collection);
      await container.item(dataId, dataId).delete();

      res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
      return internalServerError(res, error);
    }
  },
};

export default userController;
