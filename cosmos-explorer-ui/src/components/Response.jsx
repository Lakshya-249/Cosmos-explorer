export const ErrorResponse = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="text-red-800">
          <strong>Error:</strong> {error}
        </div>
      </div>
    </div>
  );
};

export const SuccessResponse = ({ success }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="text-green-800">
          <strong>Success:</strong> {success}
        </div>
      </div>
    </div>
  );
};
