import React from "react";
import { Card } from "../../../../components/ui/Card";
import LineChart from "../../../../components/charts/LineChart";
import BarChart from "../../../../components/charts/BarChart";

export default function DashboardReport() {
    const salesData = [
        { name: "Mon", value: 12400 },
        { name: "Tue", value: 14500 },
        { name: "Wed", value: 13200 },
        { name: "Thu", value: 18900 },
        { name: "Fri", value: 24500 },
        { name: "Sat", value: 28700 },
        { name: "Sun", value: 21300 },
    ];

    const fuelVsStore = [
        { name: "Mon", fuel: 10400, store: 2000 },
        { name: "Tue", fuel: 12500, store: 2000 },
        { name: "Wed", fuel: 11200, store: 2000 },
        { name: "Thu", fuel: 15900, store: 3000 },
        { name: "Fri", fuel: 20500, store: 4000 },
        { name: "Sat", fuel: 23700, store: 5000 },
        { name: "Sun", fuel: 18300, store: 3000 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Quick Stats */}
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-slate-500">Total Sales Today</h3>
                    <p className="text-2xl font-bold mt-2">ZMW 24,500</p>
                    <span className="text-xs text-green-500 font-medium">+12% vs Yesterday</span>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-slate-500">Transactions</h3>
                    <p className="text-2xl font-bold mt-2">142</p>
                    <span className="text-xs text-green-500 font-medium">+5% vs Yesterday</span>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-slate-500">Total Fuel Volume</h3>
                    <p className="text-2xl font-bold mt-2">1,240 L</p>
                    <span className="text-xs text-slate-400">Stable</span>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-slate-500">Active Pumps</h3>
                    <p className="text-2xl font-bold mt-2">8/8</p>
                    <span className="text-xs text-green-500 font-medium">All Online</span>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Weekly Sales Trend</h3>
                    <div className="h-64">
                        <LineChart data={salesData} xKey="name" yKey="value" color="#2563eb" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Fuel Sales Volume</h3>
                    <div className="h-64">
                        <BarChart data={salesData} xKey="name" yKey="value" color="#0ea5e9" />
                    </div>
                </div>
            </div>
        </div>
    );
}
