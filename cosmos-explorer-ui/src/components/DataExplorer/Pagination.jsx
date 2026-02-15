const Pagination = ({ pagination, onPageChange, onLimitChange }) => {
  if (!pagination || pagination.total < pagination.limit) {
    return <></>;
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
      <span className="text-sm text-gray-600">Page {pagination.page}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <select
          type="number"
          min={1}
          value={pagination.limit}
          onChange={(e) => {
            const value = Math.max(1, Number(e.target.value));
            onLimitChange(value);
          }}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={75}>75</option>
          <option value={100}>100</option>
        </select>

        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.total < pagination.limit}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
