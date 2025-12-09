import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import NozzleCard from "@/modules/frontdesk/screens/pumps/components/NozzleCard"; // nozzle UI reused
import AttendantDetailsModal from "./AttendantDetailsModal";

export default function ProductsPanel({
  products,
  addToCart,
  currentCategory,
  pumps = [],
  onClearAttendant = () => { },
  onNozzleClick = () => { },
}) {
  const [search, setSearch] = useState("");
  const [selectedNozzle, setSelectedNozzle] = useState(null);
  const [selectedAttendant, setSelectedAttendant] = useState(null); // name string

  const filtered = products.filter((p) =>
    (currentCategory === "all" || p.category === currentCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // aggregate pending totals by attendant across all pumps (quick clear)
  const attendantSummaries = useMemo(() => {
    const map = {};
    pumps.forEach((pump) => {
      (pump.transactions || [])
        .filter((t) => t.status === "pending")
        .forEach((t) => {
          const att = t.attendant || "Unknown";
          if (!map[att]) map[att] = { amount: 0, ids: [], pumpIds: new Set() };
          map[att].amount += Number(t.amount || 0);
          map[att].ids.push(t.id);
          map[att].pumpIds.add(pump.id);
        });
    });
    // convert pumpIds sets to arrays
    return Object.entries(map).map(([attendant, meta]) => ({
      attendant,
      amount: meta.amount,
      ids: meta.ids,
      pumpIds: Array.from(meta.pumpIds),
    }));
  }, [pumps]);

  // flatten nozzles so each nozzle is treated as independent
  const nozzleList = useMemo(() => {
    let globalIndex = 0;
    return pumps.flatMap((pump) =>
      (pump.nozzles || []).map((n) => {
        globalIndex += 1;
        return {
          ...n,
          pumpId: pump.id,
          pumpName: pump.name,
          grade: pump.grade,
          price: pump.price,
          transactions: (pump.transactions || []).filter((t) => t.nozzle === n.number),
          displayNumber: globalIndex,
          displayLabel: `Pump ${globalIndex}`,
        };
      })
    );
  }, [pumps]);

  // build the list of items shown in the product grid:
  // - if category === "pump" show nozzleList as "products"
  // - otherwise show normal products
  const displayItems = useMemo(() => {
    if (currentCategory === "pump") {
      return nozzleList.map((n) => ({
        id: `pump-${n.displayNumber}-${n.pumpId}-${n.number}`,
        name: n.displayLabel,
        price: n.price ?? 0,
        icon: null, // No icon here; NozzleCard used for full pump tile when needed
        _isPump: true,
        nozzle: n,
      }));
    }
    return products.map((p) => ({ ...p, _isPump: false }));
  }, [currentCategory, nozzleList, products]);

  // apply search filter to displayItems (same search used earlier)
  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return displayItems.filter((it) => {
      if (!q) return true;
      return String(it.name).toLowerCase().includes(q) || String(it.id).toLowerCase().includes(q);
    });
  }, [displayItems, search]);

  const handleNozzleOpen = (nozzle) => {
    // expose click to parent (Pos) and also open local modal
    setSelectedNozzle(nozzle);
    onNozzleClick(nozzle);
  };

  const handleClearFromModal = (amount, attendant, pump, ids) => {
    // call parent quick-clear (Pos will add cart item / prefill payment)
    onClearAttendant(amount, attendant, { id: pump.pumpId || pump.id, name: pump.pumpName || pump.name }, ids);
    // If clearing from nozzle modal, close it
    if (selectedNozzle) setSelectedNozzle(null);
  };

  return (
    <div className="w-1/2 min-w-[400px] p-4 bg-gradient-to-b from-blue-50 to-blue-100 
                    border-r border-blue-300 text-black flex flex-col">

      {/* Quick Clear — show attendants with their pending totals (aggregated across pumps) */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2 text-blue-900">Quick Clear (Attendants)</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {attendantSummaries.length === 0 && <div className="text-sm text-gray-500">No pending sales</div>}

          {attendantSummaries.map((a) => (
            <div
              key={a.attendant}
              onClick={() => setSelectedAttendant(a.attendant)}
              className={cn("min-w-[220px] p-3 rounded-lg shadow-sm bg-white border cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group", a.amount > 0 ? "border-amber-300" : "border-gray-200")}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-slate-900 truncate group-hover:text-blue-700 transition-colors">{a.attendant}</div>
                <div className="text-sm text-slate-600">ZMW {Number(a.amount || 0).toFixed(2)}</div>
              </div>
              <div className="text-sm text-slate-700 mb-2">
                Total Pending: <span className="font-semibold text-amber-700">ZMW {Number(a.amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">View History</span>
                {/* 
                // Removed direct clear button in favor of modal
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent modal opening if we want direct clear
                    onClearAttendant(a.amount, a.attendant, { pumpIds: a.pumpIds }, a.ids)
                  }}
                  className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                  title={`Prepare clearance for ${a.attendant}`}
                >
                  Clear
                </button> 
               */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NOTE: pumps (nozzles) are now rendered inside the product grid so they are searchable / scrollable */}
      {/* Title */}
      <h2 className="text-lg font-bold mb-2 text-blue-900">Products</h2>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-blue-300 focus:ring-blue-500"
        />
      </div>

      {/* Product Grid (now shows pumps as regular product tiles) */}
      <div className="grid grid-cols-4 gap-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {visibleItems.map((item) => {
          if (item._isPump) {
            // render pump tile using NozzleCard UI
            return (
              <div key={item.id} className="p-0">
                <NozzleCard nozzle={item.nozzle} onClick={(n) => handleNozzleOpen(n)} />
              </div>
            );
          }

          return (
            <Card
              key={item.id}
              onClick={() => addToCart(item)}
              className={cn(
                "p-3 cursor-pointer shadow-sm transition-all border border-transparent",
                "hover:shadow-md hover:border-blue-400 hover:bg-blue-200",
                "flex flex-col items-center text-center bg-white"
              )}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="font-semibold text-blue-900">{item.name}</div>
              <div className="text-blue-700 font-bold text-sm">ZMW {item.price.toFixed(2)}</div>
            </Card>
          );
        })}

        {visibleItems.length === 0 && (
          <div className="col-span-4 text-center text-gray-600 mt-4">No items found</div>
        )}
      </div>

      {/* Simple nozzle transactions modal (opened when nozzle clicked) */}
      {selectedNozzle && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">{selectedNozzle.pumpName} • {selectedNozzle.displayLabel ?? `Nozzle ${selectedNozzle.number}`}</h4>
                <div className="text-sm text-slate-500">{selectedNozzle.grade} • ZMW {selectedNozzle.price.toFixed(2)}/L</div>
              </div>
              <button onClick={() => setSelectedNozzle(null)} className="px-3 py-1">Close</button>
            </div>

            <div className="space-y-3">
              {(selectedNozzle.transactions || []).length === 0 ? (
                <div className="text-center text-slate-500 py-8">No transactions</div>
              ) : (
                (selectedNozzle.transactions || []).slice().reverse().map((tx) => {
                  const isPending = tx.status === "pending";
                  return (
                    <div key={tx.id} className={`p-3 rounded-lg border ${isPending ? "bg-amber-50" : "bg-gray-50"}`}>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{tx.id}</div>
                          <div className="text-sm text-slate-600">{tx.time} • {tx.attendant || "—"}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">ZMW {Number(tx.amount || 0).toFixed(2)}</div>
                          <div className="text-xs mt-1">{isPending ? "Pending" : "Cleared"}</div>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-slate-700 flex items-center justify-between">
                        <div>Litres: <span className="font-semibold">{Number(tx.volume ?? tx.liters ?? 0).toFixed(2)} L</span></div>
                        <div>Price/L: <span className="font-semibold">ZMW {(tx.pricePerL ?? selectedNozzle.price ?? 0).toFixed(2)}</span></div>
                      </div>

                      {isPending && (
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleClearFromModal(tx.amount, tx.attendant, selectedNozzle, [tx.id])}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEW: Attendant Details Modal */}
      {selectedAttendant && (
        <AttendantDetailsModal
          attendant={selectedAttendant}
          pumps={pumps}
          onClose={() => setSelectedAttendant(null)}
          onClear={handleClearFromModal}
        />
      )}
    </div>
  );
}
