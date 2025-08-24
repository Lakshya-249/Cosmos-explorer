import { useState } from "react";
import AddConnectionModal from "./AddConnectionModal";
import { Menu, Link } from "../../icons";

export default function SidebarHeader({ onAddConnection, open, setOpen }) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
      {/* App Title */}
      <span className="font-bold text-white text-lg tracking-wide">
        {open ? "My App" : "MA"}
      </span>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        {/* Add Connection Button (only when open) */}
        {open && (
          <button
            onClick={() => setModalOpen(true)}
            className="p-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Add Connection"
          >
            <Link className="w-5 h-5" />
          </button>
        )}

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddConnectionModal
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            onAddConnection(data);
            setModalOpen(false);
          }}
        />
      )}
    </header>
  );
}
