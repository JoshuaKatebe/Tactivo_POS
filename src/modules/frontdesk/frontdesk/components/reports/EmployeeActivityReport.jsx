import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Card } from "../../../../components/ui/Card";

export default function EmployeeActivityReport() {
    const data = [
        { name: "John Doe", id: "A001", shift: "Morning (06:00-14:00)", txCount: 45, total: 12500, products: { petrol: 5000, diesel: 7000, lubes: 500 } },
        { name: "Jane Smith", id: "A002", shift: "Afternoon (14:00-22:00)", txCount: 52, total: 14200, products: { petrol: 6000, diesel: 8000, lubes: 200 } },
        { name: "Mike Ross", id: "A003", shift: "Night (22:00-06:00)", txCount: 28, total: 8500, products: { petrol: 3000, diesel: 5000, lubes: 500 } },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">Attendants/Employee Activity</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Top Performers Cards could go here if needed */}
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left p-4 bg-slate-50">Employee</TableHead>
                                <TableHead className="text-left p-4 bg-slate-50">Shift Info</TableHead>
                                <TableHead className="text-right p-4 bg-slate-50">Tx Count</TableHead>
                                <TableHead className="text-right p-4 bg-slate-50">Total Sales</TableHead>
                                <TableHead className="text-right p-4 bg-slate-50">Diesel</TableHead>
                                <TableHead className="text-right p-4 bg-slate-50">Petrol</TableHead>
                                <TableHead className="text-right p-4 bg-slate-50">Lubes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, i) => (
                                <TableRow key={i} className="border-t hover:bg-slate-50 group transition-colors">
                                    <TableCell className="p-4">
                                        <div className="font-medium text-slate-900">{row.name}</div>
                                        <div className="text-xs text-slate-500">ID: {row.id}</div>
                                    </TableCell>
                                    <TableCell className="p-4 text-slate-600">{row.shift}</TableCell>
                                    <TableCell className="text-right p-4 font-medium">{row.txCount}</TableCell>
                                    <TableCell className="text-right p-4 font-bold text-slate-900">ZMW {row.total.toLocaleString()}</TableCell>
                                    <TableCell className="text-right p-4 text-slate-600">{row.products.diesel.toLocaleString()}</TableCell>
                                    <TableCell className="text-right p-4 text-slate-600">{row.products.petrol.toLocaleString()}</TableCell>
                                    <TableCell className="text-right p-4 text-slate-600">{row.products.lubes.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <div className="text-right">
                <button className="text-sm text-blue-600 font-medium hover:underline">Export to CSV</button>
            </div>
        </div>
    );
}
