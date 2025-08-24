import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { CosmosClient } from "@azure/cosmos";
import { getConnectionClient, setConnectionClient } from "./client.store.js";

const adapter = new JSONFile("database/cosmos-config.json");
const db = new Low(adapter, { cosmosConnections: [] });

export class ConnectionStore {
  static async saveConnection(id, endpoint, key, name) {
    try {
      await db.read();
      const existing = db.data.cosmosConnections.find((c) => c.id === id);
      if (existing) {
        // update existing connection
        existing.endpoint = endpoint;
        existing.key = key;
      } else {
        db.data.cosmosConnections.push({
          id,
          endpoint,
          key,
          name,
        });
      }
      await db.write();
    } catch (error) {
      console.error("Error saving connection:", error);
      throw new Error("Failed to save connection");
    }
  }

  static async getConnection(id) {
    await db.read();
    return db.data.cosmosConnections.find((c) => c.id === id) || null;
  }

  static async getAllConnections() {
    await db.read();
    return db.data.cosmosConnections;
  }

  static async getClient(id) {
    await db.read();
    const conn = db.data.cosmosConnections.find((c) => c.id === id);
    if (!conn) return null;
    if (getConnectionClient(id)) {
      return getConnectionClient(id);
    }
    const newClient = new CosmosClient({
      endpoint: conn.endpoint,
      key: conn.key,
    });
    setConnectionClient(id, newClient);
    return newClient;
  }

  static async deleteConnection(id) {
    await db.read();
    db.data.cosmosConnections = db.data.cosmosConnections.filter(
      (c) => c.id !== id
    );
    await db.write();
  }
}
