import { useState } from "react";
import { useAddData } from "./AddData";
import { useUpdate } from "./Update";
import { useDelete } from "./Delete";
import { useQuery } from "./CollectionQuery";

export const useExplorerCrud = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemData, setNewItemData] = useState(
    '{\n  "id": "",\n  "name": "",\n  "email": ""\n}',
  );
  const [deletingId, setDeletingId] = useState(null);
  const {
    isLoading,
    error: queryError,
    fetchQuery,
    data,
    setData: setList,
  } = useQuery();

  const {
    isLoading: deleteLoading,
    error: deleteerror,
    deleteData,
  } = useDelete();

  const {
    isLoading: updateLoading,
    error: updateError,
    updateData,
  } = useUpdate();

  const {
    isLoading: addLoading,
    error: addError,
    addData,
    data: addedData,
  } = useAddData();

  const handleCreate = async () => {
    try {
      const parsedData = JSON.parse(newItemData);
      console.log(parsedData);

      await addData(parsedData);

      setSuccess("Data added successfully: Please Refresh Page.");
      setShowCreateForm(false);
      setNewItemData('{\n  "id": "",\n  "name": "",\n  "email": ""\n}');
    } catch (error) {
      console.log("Error creating new item:", error);
      alert("Invalid JSON format. Please check your syntax.");
    }
  };

  const handleExecuteQuery = async (query, queryMode) => {
    setError(null);
    setSuccess(null);

    try {
      await fetchQuery(query);
      if (queryError) {
        setError("Error Getting Data:", queryError);
        return;
      }

      console.log(`Executing ${queryMode} query:`, query);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (did) => {
    setError(null);

    try {
      setDeletingId(did);
      await deleteData(did);
      if (deleteerror) {
        setError("Error deleting data:", deleteerror);
        return;
      }

      setList((prev) => prev.filter((item) => item.id !== did));
      setSuccess("Data deleted successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (did, data) => {
    setError(null);

    try {
      await updateData(data);
      if (updateError) {
        setError("Error updating data:", updateError);
        return;
      }

      setList((prev) => prev.map((item) => (item.id === did ? data : item)));

      setSuccess("Data updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddData = async (data) => {
    try {
      await addData(data);

      if (addError) {
        setError("Error adding data:", addError);
        return;
      }

      console.log("Added Data:", addedData);

      setSuccess("Data added successfully: Please Refresh Page.");

      // setList((prev) => [...prev, addedData]);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    data,
    error,
    success,
    deletingId,
    handleExecuteQuery,
    handleDelete,
    handleUpdate,
    handleCreate,
    handleAddData,
    showCreateForm,
    setShowCreateForm,
    isLoading,
    deleteLoading,
    updateLoading,
    addLoading,
    newItemData,
    setNewItemData,
  };
};
