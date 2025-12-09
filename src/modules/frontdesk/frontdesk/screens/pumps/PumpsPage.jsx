import React, { useState, useMemo } from "react";
import PumpsCard from "./components/PumpsCard";
import { PUMPS_MOCK } from "./pumps.mock.js";

export default function PumpsPage({ initialPumps = null, onClearTransaction = null }) {
  // Only use mock data if explicitly provided, otherwise start with empty array (idle state)
  const [pumps, setPumps] = useState(() => {
    if (initialPumps === null) {
      return [];
    }
    return JSON.parse(JSON.stringify(initialPumps));
  });
  const [selectedNozzle, setSelectedNozzle] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [attendantFilter, setAttendantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const nozzleList = useMemo(() => {
    let idx = 0;
    return pumps.flatMap((pump) =>
      pump.nozzles.map((nozzle) => {
        idx += 1;
        return {
          ...nozzle,
          pumpId: pump.id,
          pumpName: pump.name,
          grade: pump.grade,
          price: pump.price,
          transactions: (pump.transactions || []).filter((t) => t.nozzle === nozzle.number),
          displayNumber: idx,
          displayLabel: `Pump ${idx}`,
        };
      })
    );
  }, [pumps]);

  const getPumpById = (id) => pumps.find((p) => p.id === id);

  const handleNozzleClick = (nozzle) => {
    setSelectedNozzle(nozzle);
    setAttendantFilter("all");
    setStatusFilter("all");
    setShowTransactions(true);
  };

  const updatePumpTransactions = (pumpId, transactionIds = []) => {
    const updated = pumps.map((pump) => {
      if (pump.id !== pumpId) return pump;

      const updatedTransactions = pump.transactions.map((t) =>
        transactionIds.includes(t.id) ? { ...t, status: "cleared" } : t
      );

      const updatedNozzles = pump.nozzles.map((n) => {
        const clearedForThisNozzle = updatedTransactions.some(
          (ut) => ut.nozzle === n.number && ut.status === "cleared"
        );
        if (clearedForThisNozzle && n.status === "filling") {
          return { ...n, status: "idle", currentSale: 0, currentLiters: 0, attendant: null };
        }
        return n;
      });

      return { ...pump, transactions: updatedTransactions, nozzles: updatedNozzles };
    });

    setPumps(updated);
    return updated;
  };

  const handleClearSingleTransaction = (transaction) => {
    if (!selectedNozzle) return;
    const pumpId = selectedNozzle.pumpId;
    const updated = updatePumpTransactions(pumpId, [transaction.id]);

    if (onClearTransaction && transaction.status === "pending") {
      onClearTransaction(transaction.amount, transaction.attendant, { id: pumpId });
    }

    const updatedPump = updated.find((p) => p.id === pumpId);
    const hasPending = updatedPump.transactions.some((t) => t.status === "pending");
    if (!hasPending) setShowTransactions(false);
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedNozzle) return [];
    const pump = getPumpById(selectedNozzle.pumpId);
    if (!pump) return [];

    return pump.transactions.filter((t) => {
      const matchesNozzle = t.nozzle === selectedNozzle.number;
      const matchesAttendant = attendantFilter === "all" || t.attendant === attendantFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesNozzle && matchesAttendant && matchesStatus;
    });
  }, [selectedNozzle, pumps, attendantFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pump Management</h1>

      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Quick Clear</h3>
          <div className="text-sm text-slate-500">
            Total Pending: ZMW{" "}
            {pumps
              .reduce(
                (sum, p) =>
                  sum +
                  p.transactions.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0),
                0
              )
              .toFixed(2)}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {Array.from(new Set(pumps.flatMap((p) => p.transactions.map((t) => t.attendant).filter(Boolean)))).map(
            (att) => {
              const total = pumps.reduce(
                (s, p) =>
                  s + p.transactions.filter((t) => t.attendant === att && t.status === "pending").reduce((a, t) => a + t.amount, 0),
                0
              );
              if (total === 0) return null;
              return (
                <div key={att} className="bg-amber-50 p-3 rounded-md border">
                  <div className="font-medium">{att}</div>
                  <div className="font-semibold text-amber-700">ZMW {total.toFixed(2)}</div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <PumpsCard nozzles={nozzleList} onNozzleClick={handleNozzleClick} />

      {showTransactions && selectedNozzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedNozzle.pumpName} • Nozzle {selectedNozzle.number}
                </h3>
                <div className="text-sm text-slate-500">
                  {selectedNozzle.grade} • ZMW {selectedNozzle.price.toFixed(2)}/L
                </div>
              </div>
              <button onClick={() => setShowTransactions(false)} className="text-slate-600 px-3 py-2">
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center text-slate-500 py-8">No transactions for this nozzle</div>
              ) : (
                // show all transactions (pending + cleared). latest first if available
                filteredTransactions
                  .slice()
                  .reverse()
                  .map((tx) => {
                    const isPending = tx.status === "pending";
                    const bgClass = isPending ? "bg-amber-50" : "bg-gray-50";
                    return (
                      <div key={tx.id} className={`p-3 rounded-lg border ${bgClass}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{tx.id}</div>
                            <div className="text-sm text-slate-600">
                              {tx.time} • {tx.attendant || "—"}
                            </div>
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
                              onClick={() => handleClearSingleTransaction(tx)}
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
    </div>
  );
}