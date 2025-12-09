export default function Cart({ cart, total, onRemove }) {
  return (
    <div className="bg-gray-800 p-4 rounded text-white">
      <h3 className="text-lg font-bold mb-2">Cart</h3>

      {cart.length === 0 && <p className="text-gray-400">No items</p>}

      {cart.length > 0 && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-1 px-2">Code</th>
              <th className="py-1 px-2">Date</th>
              <th className="py-1 px-2">Qty</th>
              <th className="py-1 px-2">Price</th>
              <th className="py-1 px-2">Total</th>
              <th className="py-1 px-2">Discount</th>
              <th className="py-1 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id} className="border-b border-gray-700">
                <td className="py-1 px-2">{item.code || item.id}</td>
                <td className="py-1 px-2">{item.date || new Date().toLocaleDateString()}</td>
                <td className="py-1 px-2">{item.qty}</td>
                <td className="py-1 px-2">K{item.price.toFixed(2)}</td>
                <td className="py-1 px-2">K{(item.price * item.qty).toFixed(2)}</td>
                <td className="py-1 px-2">{item.discount ? `K${item.discount.toFixed(2)}` : "-"}</td>
                <td className="py-1 px-2">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>K{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
