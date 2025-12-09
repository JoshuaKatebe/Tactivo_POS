import React, { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import {
  Clock,
  User,
  DollarSign,
  TrendingUp,
  Settings,
  Play,
  Square,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { shiftsApi } from "@/api/shifts";
import { employeesApi } from "@/api/employees";
import { useStation } from "@/context/StationContext";
import { useAuth } from "@/context/AuthContext";

export default function ShiftsPage() {
  const { currentStation } = useStation();
  const { employee, user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, open, closed
  const [activeTab, setActiveTab] = useState("shifts"); // shifts, settings
  const [showStartShiftModal, setShowStartShiftModal] = useState(false);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedEmployeeForShift, setSelectedEmployeeForShift] = useState(null);
  const [startingCash, setStartingCash] = useState(0);
  const [settings, setSettings] = useState({
    shiftDuration: 8,
    autoClose: false,
    requireManagerApproval: true,
    defaultCashier: null,
  });

  // Load shifts and employees
  useEffect(() => {
    const loadData = async () => {
      if (!currentStation?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [shiftsData, employeesData] = await Promise.all([
          shiftsApi.getAll({ station_id: currentStation.id }),
          employeesApi.getAll({ station_id: currentStation.id, active: true }),
        ]);

        // Enrich shifts with employee names
        const enrichedShifts = (shiftsData || []).map((shift) => {
          const employee = (employeesData || []).find((emp) => emp.id === shift.employee_id);
          return {
            ...shift,
            employee_name: shift.employee_name || (employee ? `${employee.first_name} ${employee.last_name}` : "Unknown"),
          };
        });

        setShifts(enrichedShifts);
        setEmployees(employeesData || []);
      } catch (err) {
        console.error("Error loading shifts:", err);
        setError(err.message || "Failed to load shifts");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentStation?.id]);

  // Filter shifts
  const filteredShifts = useMemo(() => {
    let filtered = shifts;

    // Filter by status
    if (filterStatus === "open") {
      filtered = filtered.filter((s) => !s.end_time);
    } else if (filterStatus === "closed") {
      filtered = filtered.filter((s) => s.end_time);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.employee_name?.toLowerCase().includes(term) ||
          s.shift_number?.toLowerCase().includes(term) ||
          s.id?.toLowerCase().includes(term)
      );
    }

    return filtered.sort((a, b) => new Date(b.start_time || b.created_at) - new Date(a.start_time || a.created_at));
  }, [shifts, filterStatus, searchTerm]);

  // Get current open shifts (can be multiple)
  const openShifts = useMemo(() => {
    return shifts.filter((s) => !s.end_time && s.station_id === currentStation?.id);
  }, [shifts, currentStation?.id]);

  // Calculate shift statistics
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayShifts = shifts.filter((s) => {
      const shiftDate = new Date(s.start_time || s.created_at);
      return shiftDate >= today;
    });

    const openShifts = shifts.filter((s) => !s.end_time).length;
    const totalSales = todayShifts.reduce((sum, s) => sum + (parseFloat(s.total_sales || s.total_amount || 0)), 0);
    const totalTransactions = todayShifts.reduce((sum, s) => sum + (parseInt(s.transaction_count || 0)), 0);

    return {
      openShifts,
      todayShifts: todayShifts.length,
      totalSales,
      totalTransactions,
    };
  }, [shifts]);

  const handleStartShift = async () => {
    if (!currentStation?.id || !selectedEmployeeForShift) {
      setError("Please select an employee");
      return;
    }

    try {
      const newShift = await shiftsApi.start({
        station_id: currentStation.id,
        employee_id: selectedEmployeeForShift,
        opening_cash: startingCash || 0,
      });

      // Enrich shift data with employee name
      const employee = employees.find((emp) => emp.id === selectedEmployeeForShift);
      const enrichedShift = {
        ...newShift,
        employee_name: employee ? `${employee.first_name} ${employee.last_name}` : "Unknown",
        employee_id: selectedEmployeeForShift,
      };

      setShifts((prev) => [enrichedShift, ...prev]);
      setShowStartShiftModal(false);
      setSelectedEmployeeForShift(null);
      setStartingCash(0);
    } catch (err) {
      console.error("Error starting shift:", err);
      setError(err.message || "Failed to start shift");
    }
  };

  const handleEndShift = async (shiftId, endData) => {
    try {
      const updatedShift = await shiftsApi.end(shiftId, {
        end_cash: endData.end_cash || 0,
        notes: endData.notes || "",
      });

      // Preserve employee name from existing shift or enrich it
      setShifts((prev) =>
        prev.map((s) => {
          if (s.id === shiftId) {
            // Find employee to get name if not present
            const employee = employees.find((emp) => emp.id === (updatedShift.employee_id || s.employee_id));
            return {
              ...updatedShift,
              employee_name: s.employee_name || (employee ? `${employee.first_name} ${employee.last_name}` : "Unknown"),
              employee_id: s.employee_id || updatedShift.employee_id,
            };
          }
          return s;
        })
      );
      setShowEndShiftModal(false);
      setSelectedShift(null);
    } catch (err) {
      console.error("Error ending shift:", err);
      setError(err.message || "Failed to end shift");
    }
  };

  const handleSaveSettings = async () => {
    // In a real app, you'd save these to the backend
    localStorage.setItem("shiftSettings", JSON.stringify(settings));
    // Show success message
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-lg mb-2">Loading shifts...</div>
            <div className="text-sm text-slate-500">Please wait</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Shift Management</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage shifts, track sales, and configure settings • {openShifts.length} active shift{openShifts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowStartShiftModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Shift
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab(activeTab === "shifts" ? "settings" : "shifts")}
            >
              <Settings className="w-4 h-4 mr-2" />
              {activeTab === "shifts" ? "Settings" : "Back to Shifts"}
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Open Shifts</p>
                  <p className="text-3xl font-bold mt-1">{stats.openShifts}</p>
                </div>
                <Clock className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Today's Shifts</p>
                  <p className="text-3xl font-bold mt-1">{stats.todayShifts}</p>
                </div>
                <Calendar className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Today's Sales</p>
                  <p className="text-3xl font-bold mt-1">ZMW {stats.totalSales.toLocaleString()}</p>
                </div>
                <DollarSign className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Transactions</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalTransactions}</p>
                </div>
                <TrendingUp className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Shifts Grid */}
        {openShifts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Shifts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openShifts.map((shift) => (
                <Card key={shift.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                            {shift.employee_name || "Unknown Employee"}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Started {new Date(shift.start_time || shift.created_at).toLocaleTimeString()}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <Badge className="bg-green-500 text-white text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Sales: ZMW {parseFloat(shift.total_sales || shift.total_amount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedShift(shift);
                          setShowEndShiftModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 ml-2 flex-shrink-0"
                      >
                        <Square className="w-3.5 h-3.5 mr-1.5" />
                        End
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        {activeTab === "shifts" ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shift History</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search shifts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === "open" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("open")}
                    >
                      Open
                    </Button>
                    <Button
                      variant={filterStatus === "closed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterStatus("closed")}
                    >
                      Closed
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredShifts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No shifts found</p>
                  </div>
                ) : (
                  filteredShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${shift.end_time ? "bg-slate-200 dark:bg-slate-700" : "bg-blue-100 dark:bg-blue-900/30"}`}>
                          <User className={`w-6 h-6 ${shift.end_time ? "text-slate-600 dark:text-slate-400" : "text-blue-600 dark:text-blue-400"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {shift.employee_name || "Unknown Employee"}
                            </h4>
                            {!shift.end_time && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(shift.start_time || shift.created_at).toLocaleString()}
                            {shift.end_time && ` - ${new Date(shift.end_time).toLocaleString()}`}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                            <span>Sales: ZMW {parseFloat(shift.total_sales || shift.total_amount || 0).toLocaleString()}</span>
                            <span>Transactions: {shift.transaction_count || 0}</span>
                          </div>
                        </div>
                      </div>
                      {!shift.end_time && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShift(shift);
                            setShowEndShiftModal(true);
                          }}
                        >
                          <Square className="w-4 h-4 mr-2" />
                          End Shift
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Shift Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shiftDuration">Default Shift Duration (hours)</Label>
                  <Input
                    id="shiftDuration"
                    type="number"
                    value={settings.shiftDuration}
                    onChange={(e) => setSettings({ ...settings, shiftDuration: parseInt(e.target.value) || 8 })}
                    min={4}
                    max={12}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-close shifts at end of day</Label>
                    <p className="text-sm text-slate-500">Automatically close all open shifts at midnight</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoClose}
                    onChange={(e) => setSettings({ ...settings, autoClose: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Manager Approval for Shift End</Label>
                    <p className="text-sm text-slate-500">Manager must approve before closing a shift</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requireManagerApproval}
                    onChange={(e) => setSettings({ ...settings, requireManagerApproval: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>

                <div>
                  <Label htmlFor="defaultCashier">Default Cashier</Label>
                  <select
                    id="defaultCashier"
                    value={settings.defaultCashier || ""}
                    onChange={(e) => setSettings({ ...settings, defaultCashier: e.target.value || null })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">None</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setActiveTab("shifts")}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Shift Modal */}
        {showStartShiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Start New Shift</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setShowStartShiftModal(false);
                    setSelectedEmployeeForShift(null);
                    setStartingCash(0);
                  }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="employeeSelect">Select Employee</Label>
                  <select
                    id="employeeSelect"
                    value={selectedEmployeeForShift || ""}
                    onChange={(e) => setSelectedEmployeeForShift(e.target.value || null)}
                    className="w-full p-2.5 border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">-- Choose an employee --</option>
                    {employees
                      .filter((emp) => {
                        // Only show employees without active shifts
                        const hasActiveShift = openShifts.some((shift) => shift.employee_id === emp.id);
                        return !hasActiveShift;
                      })
                      .map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name} - {emp.employee_code || emp.id}
                        </option>
                      ))}
                  </select>
                  {employees.filter((emp) => !openShifts.some((shift) => shift.employee_id === emp.id)).length === 0 && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                      All active employees already have shifts open
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="startCash">Opening Cash (ZMW)</Label>
                  <Input
                    id="startCash"
                    type="number"
                    value={startingCash}
                    onChange={(e) => setStartingCash(parseFloat(e.target.value) || 0)}
                    min={0}
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => {
                    setShowStartShiftModal(false);
                    setSelectedEmployeeForShift(null);
                    setStartingCash(0);
                  }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStartShift}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedEmployeeForShift}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Shift
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* End Shift Modal */}
        {showEndShiftModal && selectedShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>End Shift</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowEndShiftModal(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Shift Summary</p>
                  <p className="font-semibold mt-1">
                    Sales: ZMW {parseFloat(selectedShift.total_sales || selectedShift.total_amount || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Transactions: {selectedShift.transaction_count || 0}
                  </p>
                </div>
                <div>
                  <Label htmlFor="endCash">Ending Cash (ZMW)</Label>
                  <Input id="endCash" type="number" defaultValue={0} min={0} step="0.01" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <textarea
                    id="notes"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Add any notes about this shift..."
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowEndShiftModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const endCash = document.getElementById("endCash")?.value || 0;
                      const notes = document.getElementById("notes")?.value || "";
                      handleEndShift(selectedShift.id, { end_cash: parseFloat(endCash), notes });
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    End Shift
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

