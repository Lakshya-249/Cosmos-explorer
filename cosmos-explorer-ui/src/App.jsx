import { useState, useEffect } from "react";
import Sidebar from "./pages/Sidebar.jsx";
import CosmosDBExplorer from "./pages/Explorer.jsx";
import { setSelectedCollection } from "./utils/collection.store.js";
import EmptyState from "./components/EmptyState.jsx";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [tabs, setTabs] = useState(() => {
    const saved = sessionStorage.getItem("cosmos_tabs");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("cosmos_active_tab");
  });

  const openTab = ({ id, file: collection, database }) => {
    const collectionId = `${collection} | ${database}`;
    const exists = tabs.find((tab) => tab.id === collectionId);

    if (exists) {
      setActiveTab(exists.id);
      return;
    }

    const newTab = {
      ac_id: id,
      id: collectionId,
      title: collection,
      db: database,
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTab(collectionId);
  };

  const closeTab = (id) => {
    const filtered = tabs.filter((tab) => tab.id !== id);
    setTabs(filtered);

    if (activeTab === id) {
      const next = filtered[filtered.length - 1];
      setActiveTab(next ? next.id : null);
      if (next) {
        setSelectedCollection(next.ac_id, next.db, next.title);
      } else {
        setSelectedCollection(null, null, null);
      }
    }
  };

  useEffect(() => {
    sessionStorage.setItem("cosmos_tabs", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    if (activeTab) {
      sessionStorage.setItem("cosmos_active_tab", activeTab);
    }
  }, [activeTab]);

  const handleActiveTab = (tab) => {
    setActiveTab(tab.id);
    setSelectedCollection(tab.ac_id, tab.db, tab.title);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onCollectionClick={openTab}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TAB BAR */}
        <div className="flex bg-gray-100 border-b border-gray-300 shrink-0">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 cursor-pointer border-r border-gray-300 ${
                activeTab === tab.id ? "bg-white font-semibold" : "bg-gray-100"
              }`}
              onClick={() => handleActiveTab(tab)}
            >
              <span className="mr-2">{tab.title || "yoo"}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="text-gray-500 hover:text-red-500 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ACTIVE TAB CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex-1 overflow-hidden">
            {tabs.length === 0 ? (
              <EmptyState />
            ) : (
              tabs.map((tab) => (
                <div
                  key={tab.id}
                  style={{ display: activeTab === tab.id ? "block" : "none" }}
                  className="h-full overflow-y-auto"
                >
                  <CosmosDBExplorer selectedCollection={tab?.id} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
