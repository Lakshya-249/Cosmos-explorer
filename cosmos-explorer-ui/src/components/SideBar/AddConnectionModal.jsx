import { useState } from "react";

export default function AddConnectionModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", endpoint: "", key: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.endpoint || !form.key) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-5 w-[28rem] transform transition-all duration-200 scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Add Connection
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Endpoint */}
          <textarea
            name="endpoint"
            placeholder="Endpoint (e.g. https://your-db-url)"
            value={form.endpoint}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Key */}
          <textarea
            name="key"
            placeholder="Key"
            value={form.key}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
