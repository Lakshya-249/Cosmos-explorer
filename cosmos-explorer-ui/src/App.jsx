import { useState } from "react";
import Sidebar from "./components/SideBar/Sidebar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Explorer from "./components/DataExplorer/Explorer.jsx";
import { getSelectedCollection } from "./utils/collection.store.js";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collectionSelected, setCollectionSelected] = useState(
    getSelectedCollection()?.collection
  );

  return (
    <div className="flex h-screen overflow-y-auto">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        setCollectionSelected={setCollectionSelected}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* <Dashboard /> */}
        <Explorer selectedCollection={collectionSelected} />
      </div>
    </div>
  );
}
