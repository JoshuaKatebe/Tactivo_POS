import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Card } from "../../../../components/ui/Card";

export default function DailyBalancingReport() {
    const data = [
        { shift: "Shift #1 (Morning)", manager: "Alice M.", sales: 45000, cashedIn: 45000, balance: 0, status: "Balanced" },
        { shift: "Shift #2 (Afternoon)", manager: "Bob D.", sales: 52000, cashedIn: 51800, balance: -200, status: "Shortage" },
        { shift: "Shift #3 (Night)", manager: "Charlie T.", sales: 30000, cashedIn: 30050, balance: 50, status: "Overage" },
    ];
    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">Daily Balancing (Management Utility)</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="text-blue-600 text-sm font-medium">Total Sales (All Shifts)</div>
                    <div className="text-2xl font-bold text-blue-900 mt-1">ZMW 127,000</div>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200">
                    <div className="text-green-600 text-sm font-medium">Total Cash Collected</div>
                    <div className="text-2xl font-bold text-green-900 mt-1">ZMW 126,850</div>
                </Card>
                <Card className="p-4 bg-red-50 border-red-200">
                    <div className="text-red-600 text-sm font-medium">Net Variance</div>
                    <div className="text-2xl font-bold text-red-900 mt-1">- ZMW 150</div>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-4 bg-slate-50">Shift Number</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Manager</TableHead>
                            <TableHead className="text-right p-4 bg-slate-50">Total Sales</TableHead>
                            <TableHead className="text-right p-4 bg-slate-50">Total Cashed In</TableHead>
                            <TableHead className="text-right p-4 bg-slate-50">Balance</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i} className="border-t hover:bg-slate-50">
                                <TableCell className="p-4 font-medium text-slate-900">{row.shift}</TableCell>
                                <TableCell className="p-4 text-slate-600">{row.manager}</TableCell>
                                <TableCell className="text-right p-4 font-medium">{row.sales.toLocaleString()}</TableCell>
                                <TableCell className="text-right p-4 font-medium">{row.cashedIn.toLocaleString()}</TableCell>
                                <TableCell className={`text-right p-4 font-bold ${row.balance < 0 ? 'text-red-500' : row.balance > 0 ? 'text-green-500' : 'text-slate-400'}`}>
                                    {row.balance === 0 ? '-' : row.balance.toLocaleString()}
                                </TableCell>
                                <TableCell className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${row.status === 'Balanced' ? 'bg-green-100 text-green-800' :
                                            row.status === 'Shortage' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'}`}>
                                        {row.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
