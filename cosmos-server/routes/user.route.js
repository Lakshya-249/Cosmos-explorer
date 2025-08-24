import { Router } from "express";
import userController from "../controller/user.controller.js";

const router = Router();

router.post("/add-connection", userController.addConnection);

router.get("/get-connections", userController.getConnections);

router.get("/connections/:id/databases", userController.getDatabases);

router.get(
  "/connections/:id/databases/:database/collections",
  userController.getCollections
);

router.post(
  "/connections/:id/databases/:database/collections/:collection/filter",
  userController.getFilterData
);

router.post(
  "/connections/:id/databases/:database/collections/:collection/add",
  userController.addDataToCollection
);

router.put(
  "/connections/:id/databases/:database/collections/:collection/update",
  userController.updateDataInCollection
);

router.delete(
  "/connections/:id/databases/:database/collections/:collection/delete",
  userController.deleteDataFromCollection
);

export default router;
