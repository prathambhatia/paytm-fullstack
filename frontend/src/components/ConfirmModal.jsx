export const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-md w-80 text-center">
        <p className="mb-4 font-semibold">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="btn text-white px-4 py-1 rounded hover:btn"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-[#1E1E1E] text-white px-4 py-1 rounded hover:bg-[#1E1E1E]"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
