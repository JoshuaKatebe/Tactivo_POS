import React, { useState, useEffect } from 'react';
import { useStation } from '@/context/StationContext';
import { useFuel } from '@/context/FuelContext';
import { attendantsApi } from '@/api/attendants';
import { shiftsApi } from '@/api/shifts';
import { fuelApi, fuelTransactionsApi } from '@/api/fuel';
import { pumpsApi } from '@/api/pumps';
import AttendantLogin from '@/components/AttendantLogin';
import ShiftPanel from '@/components/ShiftPanel';
import { LogOut, Play, CheckCircle, Loader2, Droplet, DollarSign, Gauge } from 'lucide-react';

export default function PumpSimulator() {
    const { currentStation } = useStation();
    const { pumps: liveStatuses, updatePumpStatus } = useFuel(); // Import updatePumpStatus

    // Attendant and shift state
    const [attendant, setAttendant] = useState(null);
    const [shift, setShift] = useState(null);
    const [shiftTransactions, setShiftTransactions] = useState([]);

    // Pump configuration state
    const [selectedPump, setSelectedPump] = useState(1);
    const [selectedNozzle, setSelectedNozzle] = useState(1);
    const [fuelType, setFuelType] = useState('');
    const [presetType, setPresetType] = useState('Amount');
    const [presetValue, setPresetValue] = useState('');
    const [pricePerLiter, setPricePerLiter] = useState(0);

    // Dynamic pump configs and fuel types from server
    const [pumpConfigs, setPumpConfigs] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [loadingPumps, setLoadingPumps] = useState(true);

    // UI state
    const [authorizing, setAuthorizing] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState(null);
    const [error, setError] = useState(null);

    const darkMode = false; // Get from theme context if available

    // Load pump configurations (Hardcoded for Simulator)
    useEffect(() => {
        const loadPumpConfigs = async () => {
            // Hardcoded fuel types as requested
            const hardcodedFuels = [
                {
                    id: 'petrol',
                    name: 'Petrol',
                    nozzle: 1,
                    price: 29.92,
                    color: 'blue',
                    fuelGradeId: 'hardcoded-petrol'
                },
                {
                    id: 'diesel',
                    name: 'Diesel',
                    nozzle: 2,
                    price: 26.98,
                    color: 'amber',
                    fuelGradeId: 'hardcoded-diesel'
                }
            ];

            setFuelTypes(hardcodedFuels);

            // Default selection
            setFuelType(hardcodedFuels[0].id);
            setSelectedNozzle(hardcodedFuels[0].nozzle);
            setPricePerLiter(hardcodedFuels[0].price);
            setLoadingPumps(false);
        };

        loadPumpConfigs();
    }, [currentStation?.id]);

    // Helper function to assign colors to fuel types
    function getFuelColor(grade) {
        const gradeLower = grade.toLowerCase();
        if (gradeLower.includes('diesel')) return 'amber';
        if (gradeLower.includes('98') || gradeLower.includes('premium')) return 'purple';
        if (gradeLower.includes('95') || gradeLower.includes('petrol') || gradeLower.includes('gasoline')) return 'blue';
        return 'slate';
    }

    // Handle attendant login
    async function handleAttendantLogin(attendantData) {
        console.log('Attendant logged in:', attendantData);
        setAttendant(attendantData);

        // Check/create shift
        try {
            const employeeId = attendantData.employee?.id || attendantData.employee_id;
            let activeShift = await shiftsApi.checkActive(employeeId, currentStation.id);

            if (!activeShift) {
                // Prompt for opening cash
                const openingCash = prompt('Enter opening cash amount for this shift:', '100');
                if (openingCash !== null) {
                    activeShift = await shiftsApi.start({
                        employee_id: employeeId,
                        station_id: currentStation.id,
                        opening_cash: parseFloat(openingCash) || 0,
                    });
                }
            }

            setShift(activeShift);

            // Load shift transactions
            if (activeShift) {
                loadShiftTransactions(activeShift.id);
            }
        } catch (err) {
            console.error('Error checking/creating shift:', err);
            setError('Failed to initialize shift: ' + err.message);
        }
    }

    // Load shift transactions
    async function loadShiftTransactions(shiftId) {
        try {
            const transactions = await shiftsApi.getTransactions(shiftId);
            setShiftTransactions(Array.isArray(transactions) ? transactions : []);
        } catch (err) {
            console.error('Error loading shift transactions:', err);
        }
    }

    // Handle attendant logout
    async function handleAttendantLogout() {
        if (confirm('Are you sure you want to logout?')) {
            try {
                if (attendant?.id) {
                    await attendantsApi.logout(attendant.id);
                }
                setAttendant(null);
                setShift(null);
                setShiftTransactions([]);
                setActiveTransaction(null);
            } catch (err) {
                console.error('Error logging out:', err);
            }
        }
    }

    // Handle fuel type selection
    function handleFuelTypeSelect(fuel) {
        setFuelType(fuel.id);
        setSelectedNozzle(fuel.nozzle);
        setPricePerLiter(fuel.price);
    }

    // Handle pump authorization (Local Simulation)
    async function handleAuthorizePump() {
        if (!attendant || !shift) {
            setError('Please login and ensure you have an active shift');
            return;
        }

        if (!presetValue || parseFloat(presetValue) <= 0) {
            setError('Please enter a valid preset value');
            return;
        }

        setAuthorizing(true);
        setError(null);

        try {
            // Local Simulation: Start immediately with Filling status
            const selectedFuelTypeConfig = fuelTypes.find(f => f.id === fuelType);
            const employeeName = attendant?.employee?.first_name || 'Attendant';

            // Sync Authorization
            updatePumpStatus(selectedPump, {
                Pump: selectedPump,
                State: 'Authorized',
                Status: 'Authorized',
                Nozzle: selectedNozzle,
                Volume: 0,
                Amount: 0,
                Price: pricePerLiter,
                User: employeeName,
                Transaction: 99999 // Dummy ID
            });

            setActiveTransaction({
                pumpNumber: selectedPump,
                nozzleNumber: selectedNozzle,
                fuelType: fuelType,
                fuelGradeId: selectedFuelTypeConfig?.fuelGradeId,
                presetType,
                presetValue: parseFloat(presetValue),
                price: pricePerLiter,
                volume: 0,
                amount: 0,
                status: 'Filling', // Start directly in filling for demo
            });

            // Reset form
            setPresetValue('');
        } catch (err) {
            console.error('Error authorizing pump:', err);
            setError('Failed to authorize pump: ' + err.message);
        } finally {
            setAuthorizing(false);
        }
    }

    // Local Simulation Loop (Auto-Finalize version) & Global Sync
    useEffect(() => {
        if (!activeTransaction) return;

        // Auto-finalize if Complete
        if (activeTransaction.status === 'Complete') {
            handleFinalizeTransaction();
            return;
        }

        if (activeTransaction.status !== 'Filling') return;

        const interval = setInterval(() => {
            setActiveTransaction(prev => {
                if (!prev || prev.status !== 'Filling') return prev;

                const fillRate = 0.5; // Liters per tick
                let newVolume = prev.volume + fillRate;
                let newAmount = newVolume * prev.price;
                let finished = false;

                // Check limits based on preset
                if (prev.presetType === 'Volume') {
                    if (newVolume >= prev.presetValue) {
                        newVolume = prev.presetValue;
                        newAmount = newVolume * prev.price;
                        finished = true;
                    }
                } else { // Amount
                    if (newAmount >= prev.presetValue) {
                        newAmount = prev.presetValue;
                        newVolume = newAmount / prev.price;
                        finished = true;
                    }
                }

                return {
                    ...prev,
                    volume: newVolume,
                    amount: newAmount,
                    status: finished ? 'Complete' : 'Filling'
                };
            });
        }, 100);

        return () => clearInterval(interval);
    }, [activeTransaction?.status]);

    // Sync active transaction with Global Context (Separate Effect to avoid React Warning)
    useEffect(() => {
        if (!activeTransaction) return;

        const fuelName = fuelTypes.find(f => f.id === activeTransaction.fuelType)?.name || '';
        const employeeName = attendant?.employee?.first_name || 'Attendant';
        const isComplete = activeTransaction.status === 'Complete';

        // Don't sync if just completed (will be handled by finalize)
        if (isComplete) return;

        updatePumpStatus(activeTransaction.pumpNumber, {
            Pump: activeTransaction.pumpNumber,
            State: activeTransaction.status === 'Filling' ? 'Filling' : 'Authorized',
            Status: activeTransaction.status === 'Filling' ? 'Filling' : 'Authorized',
            Nozzle: activeTransaction.nozzleNumber,
            Volume: activeTransaction.volume,
            Amount: activeTransaction.amount,
            Price: activeTransaction.price,
            FuelGradeName: fuelName,
            User: employeeName,
            Transaction: 99999
        });
    }, [activeTransaction, updatePumpStatus, fuelTypes, attendant]);

    // Handle finalize transaction (Manual Local Update ONLY)
    async function handleFinalizeTransaction() {
        if (!activeTransaction) return;

        try {
            const employeeId = attendant.employee?.id || attendant.employee_id;

            // Create transaction object for Local display only
            const newTransaction = {
                station_id: currentStation.id,
                pts_controller_id: null,
                pts_transaction_id: Math.floor(Math.random() * 100000),
                pump_number: activeTransaction.pumpNumber,
                nozzle: activeTransaction.nozzleNumber,
                volume: activeTransaction.volume,
                amount: activeTransaction.amount,
                price: activeTransaction.price,
                authorized_by_employee_id: employeeId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                // Additional fields for UI display
                id: `temp-${Date.now()}`,
                created_at: new Date().toISOString(),
                fuel_grade_name: fuelTypes.find(f => f.id === activeTransaction.fuelType)?.name || 'Unknown',
                total_amount: activeTransaction.amount,
                liters: activeTransaction.volume
            };

            // SKIPPED: await fuelTransactionsApi.register(newTransaction);
            // We now only update local state as requested, NO API CALL.

            // Manually update local state for immediate UI reflection
            setShiftTransactions(prev => [newTransaction, ...(Array.isArray(prev) ? prev : [])]);

            // Reset Global Pump Status to Idle
            updatePumpStatus(activeTransaction.pumpNumber, {
                Pump: activeTransaction.pumpNumber,
                State: 'Idle',
                Status: 'Idle',
                Nozzle: 0,
                Volume: 0,
                Amount: 0,
                Transaction: 0 // Clear ID
            });

            setActiveTransaction(null);
            setError(null);
            // Removed alert/console log for cleaner "auto" flow
        } catch (err) {
            console.error('Error finalizing transaction:', err);
            setError('Failed to finalize transaction: ' + (err.message));
        }
    }

    if (!currentStation) {
        return (
            <div className="p-6">
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg">
                    Please select a station first
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pump Simulator</h1>
                    <p className="text-slate-600">Authorize and monitor fuel dispensing</p>
                </div>
                {attendant && (
                    <button
                        onClick={handleAttendantLogout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Attendant Login */}
            {!attendant && (
                <AttendantLogin
                    stationId={currentStation.id}
                    onLogin={handleAttendantLogin}
                    darkMode={darkMode}
                />
            )}

            {/* Shift Panel */}
            {attendant && (
                <ShiftPanel
                    shift={shift}
                    attendant={attendant}
                    transactions={shiftTransactions}
                    darkMode={darkMode}
                />
            )}

            {/* Pump Authorization Interface */}
            {attendant && shift && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Authorization Panel */}
                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Authorize Pump</h3>

                        {/* Pump Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Pump Number
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={selectedPump}
                                onChange={(e) => setSelectedPump(parseInt(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Fuel Type Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fuel Type
                            </label>
                            {loadingPumps ? (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                                    <p className="text-sm text-slate-500">Loading fuel types...</p>
                                </div>
                            ) : fuelTypes.length === 0 ? (
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-sm text-amber-800">No fuel types configured. Please configure pumps first.</p>
                                </div>
                            ) : (
                                <div className={`grid gap-2 ${fuelTypes.length === 1 ? 'grid-cols-1' : fuelTypes.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                    {fuelTypes.map((fuel) => (
                                        <button
                                            key={fuel.id}
                                            onClick={() => handleFuelTypeSelect(fuel)}
                                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${fuelType === fuel.id
                                                ? `border-${fuel.color}-500 bg-${fuel.color}-50 text-${fuel.color}-700`
                                                : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                                }`}
                                        >
                                            {fuel.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Preset Configuration */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Preset Type
                                </label>
                                <select
                                    value={presetType}
                                    onChange={(e) => setPresetType(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Amount">Amount (ZMW)</option>
                                    <option value="Volume">Volume (L)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {presetType === 'Amount' ? 'Amount (ZMW)' : 'Volume (L)'}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder={presetType === 'Amount' ? '50.00' : '30.00'}
                                    value={presetValue}
                                    onChange={(e) => setPresetValue(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Price per Liter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Price per Liter (ZMW)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={pricePerLiter}
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Estimated Display */}
                        {presetValue && (
                            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-sm text-slate-600">
                                    {presetType === 'Amount'
                                        ? `Estimated Volume: ${(parseFloat(presetValue) / pricePerLiter).toFixed(2)} L`
                                        : `Estimated Amount: ZMW ${(parseFloat(presetValue) * pricePerLiter).toFixed(2)}`
                                    }
                                </p>
                            </div>
                        )}

                        {/* Authorize Button */}
                        <button
                            onClick={handleAuthorizePump}
                            disabled={authorizing || !presetValue || activeTransaction}
                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {authorizing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authorizing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" />
                                    Authorize Pump
                                </>
                            )}
                        </button>
                    </div>

                    {/* Transaction Monitor */}
                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Active Transaction</h3>

                        {!activeTransaction ? (
                            <div className="text-center py-12 text-slate-400">
                                <Gauge className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>No active transaction</p>
                                <p className="text-sm">Authorize a pump to begin</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Transaction Status */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Pump {activeTransaction.pumpNumber}</p>
                                        <p className="text-xs text-slate-500">Nozzle {activeTransaction.nozzleNumber}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${activeTransaction.status === 'Filling'
                                        ? 'bg-green-500 text-white'
                                        : activeTransaction.status === 'Authorized'
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-blue-500 text-white'
                                        }`}>
                                        {activeTransaction.status || 'Authorized'}
                                    </div>
                                </div>

                                {/* Transaction Metrics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg border">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Droplet className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-medium text-slate-600">Volume</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {(activeTransaction.volume || 0).toFixed(2)} L
                                        </p>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-lg border">
                                        <div className="flex items-center gap-2 mb-1">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            <span className="text-xs font-medium text-slate-600">Amount</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">
                                            ZMW {(activeTransaction.amount || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Indicator */}
                                {activeTransaction.status === 'Filling' && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                                        <div>
                                            <p className="font-semibold text-green-800">Fueling in progress...</p>
                                            <p className="text-sm text-green-700">Real-time updates from pump</p>
                                        </div>
                                    </div>
                                )}

                                {/* Finalize Button */}
                                {(activeTransaction.status === 'Complete' || (activeTransaction.volume && activeTransaction.volume > 0)) && (
                                    <button
                                        onClick={handleFinalizeTransaction}
                                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Finalize Transaction
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            {attendant && shift && shiftTransactions.length > 0 && (
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Shift Transactions</h3>
                    <div className="space-y-2">
                        {shiftTransactions.slice(0, 10).map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">
                                        Pump {tx.pump_number || tx.pump_id} - {tx.fuel_grade_name || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {new Date(tx.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">ZMW {parseFloat(tx.total_amount || tx.amount || 0).toFixed(2)}</p>
                                    <p className="text-sm text-slate-600">{parseFloat(tx.liters || tx.volume || 0).toFixed(2)} L</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
