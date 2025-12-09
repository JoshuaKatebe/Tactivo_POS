import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Card } from "../../../../components/ui/Card";

export default function OperationalDataReport() {
    const tanks = [
        { name: "Tank A (Underground)", product: "Diesel", current: 12500, capacity: 20000, value: 375000, color: "bg-green-500" },
        { name: "Tank B (Underground)", product: "Unleaded", current: 4200, capacity: 15000, value: 112500, color: "bg-yellow-500" },
        { name: "Tank C (Aboveground)", product: "Premium", current: 8000, capacity: 10000, value: 240000, color: "bg-blue-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Pump Readings */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Pump/Nozzle Meter Readings</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-3 bg-slate-50">Pump</TableHead>
                            <TableHead className="text-left p-3 bg-slate-50">Nozzle</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Start Meter</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">End Meter</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Total Litres</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3 font-medium">Pump 1</TableCell>
                            <TableCell className="p-3">Diesel</TableCell>
                            <TableCell className="text-right p-3 text-slate-600">1,204,500</TableCell>
                            <TableCell className="text-right p-3 text-slate-600">1,205,000</TableCell>
                            <TableCell className="text-right p-3 font-bold">500</TableCell>
                        </TableRow>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3 font-medium">Pump 2</TableCell>
                            <TableCell className="p-3">Unleaded</TableCell>
                            <TableCell className="text-right p-3 text-slate-600">890,100</TableCell>
                            <TableCell className="text-right p-3 text-slate-600">890,450</TableCell>
                            <TableCell className="text-right p-3 font-bold">350</TableCell>
                        </TableRow>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3 font-medium">Pump 3</TableCell>
                            <TableCell className="p-3">Premium</TableCell>
                            <TableCell className="text-right p-3 text-slate-600">450,200</TableCell>
                            <TableCell className="text-right p-3 text-slate-600">450,550</TableCell>
                            <TableCell className="text-right p-3 font-bold">350</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>

            {/* Inventory Status with Visuals */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6 text-slate-800">Inventory Status (Real-time Tanks)</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {tanks.map((tank) => (
                        <div key={tank.name} className="border rounded-lg p-4 bg-slate-50 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium text-slate-900">{tank.product}</h4>
                                        <p className="text-xs text-slate-500">{tank.name}</p>
                                    </div>
                                    <span className="text-sm font-bold bg-white px-2 py-1 rounded shadow-sm border">{Math.round((tank.current / tank.capacity) * 100)}%</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Volume:</span>
                                        <span className="font-medium">{tank.current.toLocaleString()} L</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Capacity:</span>
                                        <span className="text-slate-700">{tank.capacity.toLocaleString()} L</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-slate-200 mt-2">
                                        <span className="text-slate-500">Value:</span>
                                        <span className="font-bold text-slate-900">ZMW {tank.value.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Progress Bar background */}
                            <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-200">
                                <div className={`h-full ${tank.color}`} style={{ width: `${(tank.current / tank.capacity) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-3 bg-slate-50">Tank</TableHead>
                            <TableHead className="text-left p-3 bg-slate-50">Fuel Type</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Current Volume (L)</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Capacity (L)</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Est. Value (ZMW)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tanks.map((tank, i) => (
                            <TableRow key={i} className="border-t hover:bg-slate-50">
                                <TableCell className="p-3">{tank.name}</TableCell>
                                <TableCell className="p-3"><span className={`inline-block w-2 h-2 rounded-full mr-2 ${tank.color}`}></span>{tank.product}</TableCell>
                                <TableCell className="text-right p-3 font-medium">{tank.current.toLocaleString()}</TableCell>
                                <TableCell className="text-right p-3">{tank.capacity.toLocaleString()}</TableCell>
                                <TableCell className="text-right p-3 text-slate-900">ZMW {tank.value.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
