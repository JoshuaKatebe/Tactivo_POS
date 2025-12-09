import React, { useMemo } from "react";
import PumpTile from "../components/PumpTile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, DollarSign } from "lucide-react";

export default function FrontdeskDashboard() {
  let pumps = [];
  let loading = true;

  try {
    const pts = usePTSController();
    if (pts) {
      pumps = pts.pumps || [];
      loading = pts.loading ?? false;
    }
  } catch (err) {
    loading = false;
    pumps = useMemo(
      () => [
        { id: "p1", name: "Pump 1", status: "active" },
        { id: "p2", name: "Pump 2", status: "active" },
        { id: "p3", name: "Pump 3", status: "idle" },
        { id: "p4", name: "Pump 4", status: "active" },
      ],
      []
    );
  }

  const tankLevels = useMemo(
    () => [
      { name: "Unleaded", pct: 72 },
      { name: "Premium", pct: 38 },
      { name: "Diesel", pct: 16 },
    ],
    []
  );

  const currentShift = useMemo(
    () => ({
      name: "Shift A",
      time: "08:00 - 16:00",
      cashier: "John Doe",
      sales: 24915,
      transactions: 42,
    }),
    []
  );

  const dailySales = useMemo(
    () => ({
      fuel: 32450.5,
      stock: 8900.0,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Cashier Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Overview of pumps, tanks, current shift and daily sales.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Pump Status (spans 2 cols on large screens) */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 dark:bg-slate-800/60 border">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Pump Status</CardTitle>
                <div className="text-sm text-slate-600 dark:text-slate-300">Updated just now</div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center">Connecting to Pumps...</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {pumps.map((pump) => (
                      <PumpTile key={pump.id} pump={pump} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-white/70 dark:bg-slate-800/60 border">
                <CardHeader>
                  <CardTitle>Tank Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tankLevels.map((t) => (
                      <div key={t.name} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{t.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Capacity</div>
                        </div>
                        <div className="w-40">
                          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-3 bg-green-500"
                              style={{ width: `${Math.max(2, Math.min(100, t.pct))}%` }}
                            />
                          </div>
                          <div className="text-xs text-right mt-1">{t.pct}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-slate-800/60 border">
                <CardHeader>
                  <CardTitle>Daily Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Stat label="Fuel" amount={dailySales.fuel} icon={<Droplet className="w-5 h-5 text-blue-500" />} />
                    <Stat label="Stock" amount={dailySales.stock} icon={<DollarSign className="w-5 h-5 text-amber-500" />} />
                  </div>
                  <div className="mt-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">View Reports</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column: Current Shift + Actions */}
          <div>
            <Card className="bg-white/70 dark:bg-slate-800/60 border">
              <CardHeader>
                <CardTitle>Current Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shift</span>
                    <span>{currentShift.name} ({currentShift.time})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cashier</span>
                    <span>{currentShift.cashier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sales</span>
                    <span className="font-medium">ZMW {currentShift.sales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transactions</span>
                    <span>{currentShift.transactions}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">End Shift</Button>
                    <Button variant="ghost" className="w-full">Duplicate Slip</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 space-y-4">
              <Card className="bg-white/70 dark:bg-slate-800/60 border">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full bg-green-600">Payments</Button>
                    <Button className="w-full bg-rose-600">Refund</Button>
                    <Button className="w-full bg-indigo-600">Safe Drop</Button>
                    <Button className="w-full bg-yellow-600">Prepay</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ------------------ Helper Components ------------------ */
function Stat({ label, amount, icon }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-white/5 dark:bg-white/3">
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100 dark:bg-slate-700">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        <div className="font-semibold">ZMW {Number(amount).toLocaleString()}</div>
      </div>
    </div>
  );
}
