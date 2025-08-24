export const setSelectedCollection = (id, database, collection) => {
  sessionStorage.setItem(
    "selectedCollection",
    JSON.stringify({ id, database, collection })
  );
};

export const getSelectedCollection = () => {
  const selectedCollection = sessionStorage.getItem("selectedCollection");
  return selectedCollection ? JSON.parse(selectedCollection) : null;
};
