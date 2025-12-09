const PRODUCTS = [
  { id: 1, name: "Engine Oil 1L", price: 85 },
  { id: 2, name: "Coolant 1L", price: 65 },
  { id: 3, name: "Water 500ml", price: 5 },
];

export default function ProductSearch({ onSelect }) {
  return (
    <div className="p-2">
      <input
        type="text"
        placeholder="Search product"
        className="w-full p-2 rounded bg-gray-200 text-black"
      />
      <div className="mt-2 space-y-1">
        {PRODUCTS.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full bg-gray-700 px-3 py-2 rounded text-left text-white"
          >
            {p.name} - K{p.price}
          </button>
        ))}
      </div>
    </div>
  );
}
