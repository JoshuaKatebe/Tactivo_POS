import React, { useState, useMemo, useEffect } from "react";
import { useFuel } from "@/context/FuelContext";
import PumpsCard from "./components/PumpsCard";
import { PUMPS_MOCK } from "./pumps.mock.js";
import { fuelApi, fuelTransactionsApi } from "@/api/fuel";
import { pumpsApi } from "@/api/pumps";
import { useStation } from "@/context/StationContext";

export default function PumpsPage({ initialPumps = null, onClearTransaction = null, darkMode = false }) {
  const { currentStation } = useStation();
  const [pumps, setPumps] = useState([]);
  const [selectedNozzle, setSelectedNozzle] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [attendantFilter, setAttendantFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // liveStatuses and liveError removed, using context instead
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load pump configurations and transactions from API
  useEffect(() => {
    const loadPumps = async () => {
      if (!currentStation?.id) {
        // No station selected - show empty pumps (idle state)
        setPumps([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch pump configurations, transactions, AND fuel grades
        const [pumpConfigs, transactions, gradesResponse] = await Promise.all([
          pumpsApi.getAll({
            station_id: currentStation.id,
            active: true,
          }),
          fuelTransactionsApi.getAll({
            station_id: currentStation.id,
            synced: false,
            limit: 1000,
          }),
          fuelApi.getFuelGrades()
        ]);

        const fuelGrades = gradesResponse?.data?.FuelGrades || [];
        let transformedPumps = [];

        // If we have pump configurations in the database, use them
        if (pumpConfigs && pumpConfigs.length > 0) {
          // Transform API data to match UI structure
          transformedPumps = pumpConfigs.map((pumpConfig) => {
            // Determine price from centralized fuel grades configuration
            const grade = pumpConfig.grade || "Unknown";
            const matchingGrade = fuelGrades.find(g =>
              g.Name.toLowerCase() === grade.toLowerCase() ||
              grade.toLowerCase().includes(g.Name.toLowerCase())
            );
            const currentPrice = matchingGrade ? matchingGrade.Price : (pumpConfig.price || 0);

            // Get transactions for this pump
            const pumpTransactions = transactions.filter(
              (tx) => tx.pump_id === pumpConfig.id || tx.pump_number === pumpConfig.pump_number
            );

            // Transform transactions to match UI format
            const formattedTransactions = pumpTransactions.map((tx) => ({
              id: tx.id,
              nozzle: tx.nozzle_number || tx.nozzle || 1,
              amount: parseFloat(tx.amount || tx.total_amount || 0),
              volume: parseFloat(tx.volume || tx.liters || 0),
              time: tx.created_at ? new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--',
              status: tx.synced ? "cleared" : "pending",
              attendant: tx.attendant || tx.employee_name || "Unknown",
              pricePerL: tx.price_per_liter || currentPrice || 0,
            }));

            // Get nozzle configurations
            const nozzles = (pumpConfig.nozzles || []).map((nozzle) => {
              // Find current transaction for this nozzle
              const currentTx = formattedTransactions.find(
                (t) => t.nozzle === nozzle.number && t.status === "pending"
              );

              // Initial status - will be updated by live statuses
              return {
                number: nozzle.number,
                status: currentTx ? "filling" : "idle", // Default, will be overridden by live status
                currentSale: currentTx?.amount || 0,
                currentLiters: currentTx?.volume || 0,
                attendant: currentTx?.attendant || null,
              };
            });

            return {
              id: pumpConfig.id,
              name: pumpConfig.name || `Pump ${pumpConfig.pump_number}`,
              grade: grade,
              price: currentPrice || 0,
              pump_number: pumpConfig.pump_number, // Store for live status matching
              nozzles: nozzles.length > 0 ? nozzles : [
                { number: 1, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
                { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
              ],
              transactions: formattedTransactions,
            };
          });
        } else if (liveStatuses && Object.keys(liveStatuses).length > 0) {
          // FALLBACK: No database configs, but live status data is available
          // Generate pump configurations from live status data
          console.log("No pump configurations in database. Generating from live status data...");

          transformedPumps = Object.keys(liveStatuses).map((pumpKey) => {
            const liveStatus = liveStatuses[pumpKey];
            const pumpNumber = parseInt(pumpKey);

            // Determine nozzles from live data
            // If there's an active nozzle, include it; otherwise default to 2 nozzles
            const activeNozzle = liveStatus.Nozzle || 0;
            const lastNozzle = liveStatus.LastNozzle || 0;
            const maxNozzle = Math.max(activeNozzle, lastNozzle, 2);

            const nozzles = [];
            for (let i = 1; i <= maxNozzle; i++) {
              nozzles.push({
                number: i,
                status: "idle", // Will be updated by live status merge
                currentSale: 0,
                currentLiters: 0,
                attendant: null,
              });
            }

            // Extract fuel grade and price from live data
            const fuelGrade = liveStatus.FuelGradeName || liveStatus.LastFuelGradeName || "Unknown";
            const price = liveStatus.Price || liveStatus.LastPrice || 0;

            return {
              id: `pump-${pumpNumber}`,
              name: `Pump ${pumpNumber}`,
              grade: fuelGrade,
              price: price,
              pump_number: pumpNumber,
              nozzles: nozzles,
              transactions: [], // No transaction history without database
            };
          });
        }

        // Set pumps (could be from database, from live data, or empty)
        setPumps(transformedPumps);
      } catch (err) {
        console.error("Error loading pumps:", err);
        setError(err.message || "Failed to load pumps");
        // Don't use mock data on error - show empty pumps (idle state)
        setPumps([]);
      } finally {
        setLoading(false);
      }
    };

    loadPumps();
  }, [currentStation?.id]);

  // Use global FuelContext for live statuses
  const { pumps: liveStatuses, loading: liveLoading, authorizePump, stopPump, emergencyStop } = useFuel();

  // Helper function to determine pump status from API response
  const getPumpStatusFromApi = (liveStatus) => {
    if (!liveStatus) return { status: "idle", isWorking: true };

    // Check if pump has an active transaction (currently filling)
    // Active pumps have: Volume > 0, Transaction > 0, Nozzle > 0
    const hasActiveTransaction = liveStatus.Volume !== undefined &&
      liveStatus.Volume > 0 &&
      liveStatus.Transaction !== undefined &&
      liveStatus.Transaction > 0 &&
      liveStatus.Nozzle !== undefined &&
      liveStatus.Nozzle > 0;

    if (hasActiveTransaction) {
      return { status: "filling", isWorking: true };
    }

    // Check if pump is in "Finished" state (idle after transaction)
    if (liveStatus.State === "Finished") {
      return { status: "idle", isWorking: true };
    }

    // Check if pump has Last* fields but no active transaction (idle, ready)
    // Idle pumps have: Nozzle === 0 and LastTransaction exists
    if (liveStatus.Nozzle === 0 && liveStatus.LastTransaction !== undefined) {
      return { status: "idle", isWorking: true };
    }

    // If pump has no meaningful data at all, might be offline
    // But be lenient - if it has any data structure, assume it's working but idle
    if (!liveStatus.Volume &&
      !liveStatus.LastVolume &&
      !liveStatus.State &&
      liveStatus.Nozzle === undefined) {
      return { status: "offline", isWorking: false };
    }

    // Default to idle (pump is working but not active)
    return { status: "idle", isWorking: true };
  };

  // Merge live statuses with configuration
  useEffect(() => {
    setPumps((prevPumps) => {
      if (prevPumps.length === 0) return prevPumps;

      // If we have live statuses, merge them
      if (Object.keys(liveStatuses || {}).length > 0) {
        return prevPumps.map((pump) => {
          const pumpNumber = pump.pump_number || parseInt(pump.id.replace('pump-', '')) || null;
          if (!pumpNumber) return pump;

          // Try both string and number keys for pump number
          // API returns pumps with string keys like "1", "2", etc.
          const liveStatus = liveStatuses[String(pumpNumber)] ||
            liveStatuses[pumpNumber] ||
            liveStatuses[`${pumpNumber}`];

          if (!liveStatus) {
            // If no live status for this pump, keep current status (don't mark as offline immediately)
            // The pump might just not be connected yet
            return pump;
          }


          // Determine overall pump status from API response
          const { status: pumpStatus, isWorking } = getPumpStatusFromApi(liveStatus);

          // Update nozzle statuses based on live data
          const updatedNozzles = pump.nozzles.map((nozzle) => {
            // Check if this specific nozzle is active (has active transaction)
            const isThisNozzleActive = liveStatus.Nozzle === nozzle.number &&
              liveStatus.Volume !== undefined &&
              liveStatus.Volume > 0 &&
              liveStatus.Transaction !== undefined &&
              liveStatus.Transaction > 0;

            // Determine nozzle status
            let nozzleStatus = pumpStatus;

            // If this nozzle is actively filling, override to filling
            if (isThisNozzleActive) {
              nozzleStatus = "filling";
            } else if (!isWorking) {
              // If pump is not working, mark nozzle as offline
              nozzleStatus = "offline";
            } else {
              // Otherwise use pump status (idle)
              nozzleStatus = "idle";
            }

            // Update current sale and liters only if this nozzle is active
            const currentSale = isThisNozzleActive ? (liveStatus.Amount || 0) : 0;
            const currentLiters = isThisNozzleActive ? (liveStatus.Volume || 0) : 0;

            return {
              ...nozzle,
              status: nozzleStatus,
              currentSale: currentSale,
              currentLiters: currentLiters,
              // Update attendant if available
              attendant: isThisNozzleActive ? (liveStatus.User || nozzle.attendant) : nozzle.attendant,
            };
          });

          return {
            ...pump,
            nozzles: updatedNozzles,
            isWorking, // Store working status for reference
          };
        });
      } else {
        // No live statuses yet, but keep pumps with their default status
        return prevPumps;
      }
    });
  }, [liveStatuses]);

  // Initial load of config is still needed (useEffect above)


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

  // Define all class variables before any conditional returns
  const containerClass = darkMode ? "space-y-4" : "space-y-6";
  const titleClass = darkMode ? "text-xl font-semibold text-white" : "text-2xl font-semibold";
  const statusTextClass = darkMode ? "text-sm text-slate-300" : "text-sm text-slate-600";
  const cardBgClass = darkMode ? "bg-slate-800 rounded-lg border border-slate-700 p-3" : "bg-white rounded-lg border p-4";
  const textClass = darkMode ? "text-white" : "";
  const mutedTextClass = darkMode ? "text-slate-400" : "text-slate-500";

  if (loading) {
    return (
      <div className={containerClass}>
        <h1 className={titleClass}>Pump Management</h1>
        <div className="text-center py-8">
          <div className={darkMode ? "text-lg mb-2 text-white" : "text-lg mb-2"}>Loading pumps...</div>
          <div className={mutedTextClass}>Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h1 className={titleClass}>Pump Management</h1>

      {!darkMode && (
        <div className={`flex items-center justify-between ${statusTextClass}`}>
          <span>
            {error ? (
              <span className="text-amber-600">Using fallback data: {error}</span>
            ) : (
              <span>Live pump status from Tactivo Server</span>
            )}
          </span>
          <span>
            <span>
              {liveLoading ? (
                <span className={mutedTextClass}>Connecting to pumps...</span>
              ) : liveStatuses ? (
                <span className="text-emerald-600">
                  Pumps online: {Object.keys(liveStatuses || {}).length}
                </span>
              ) : (
                <span className="text-red-500">Offline</span>
              )}
            </span>
          </span>
        </div>
      )}

      <div className={cardBgClass}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-medium ${textClass}`}>Quick Clear</h3>
          <div className={`text-sm ${mutedTextClass}`}>
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
                <div key={att} className={darkMode ? "bg-amber-900/30 p-3 rounded-md border border-amber-700/50" : "bg-amber-50 p-3 rounded-md border"}>
                  <div className={`font-medium ${darkMode ? "text-white" : ""}`}>{att}</div>
                  <div className={`font-semibold ${darkMode ? "text-amber-400" : "text-amber-700"}`}>ZMW {total.toFixed(2)}</div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <PumpsCard pumps={pumps} onNozzleClick={handleNozzleClick} darkMode={darkMode} />

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