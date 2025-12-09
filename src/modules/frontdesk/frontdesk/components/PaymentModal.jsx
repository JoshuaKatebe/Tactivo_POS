export default function PaymentModal({ total, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg w-96 text-white">

        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>

        <p className="mb-4 text-lg">Total: <span className="font-bold">K{total.toFixed(2)}</span></p>

        <div className="space-y-3">

          <button
            className="w-full bg-blue-600 py-3 rounded-lg font-semibold"
            onClick={() => onConfirm("Cash")}
          >
            Cash
          </button>

          <button
            className="w-full bg-yellow-600 py-3 rounded-lg font-semibold"
            onClick={() => onConfirm("Mobile Money")}
          >
            Mobile Money
          </button>

          <button
            className="w-full bg-purple-700 py-3 rounded-lg font-semibold"
            onClick={() => onConfirm("Credit Customer")}
          >
            Credit Customer (Account)
          </button>

        </div>

        <button
          className="w-full mt-5 bg-gray-700 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
