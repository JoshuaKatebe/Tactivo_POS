import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import PieChart from "../../../../components/charts/PieChart";

export default function PaymentTypeReport() {
    const data = [
        { type: "Card", amount: 47980, pct: "38.5%", value: 47980 },
        { type: "Cash", amount: 76600, pct: "61.5%", value: 76600 },
        { type: "Mobile Money", amount: 12500, pct: "10.0%", value: 12500 },
        { type: "Loyalty Points", amount: 450, pct: "0.4%", value: 450 },
        { type: "Credit Customer", amount: 5600, pct: "4.5%", value: 5600 },
    ];

    const chartData = data.map(d => ({ name: d.type, value: d.value }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold">Sales by Payment Type</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-3">Payment Type</TableHead>
                            <TableHead className="text-right p-3">Amount (ZMW)</TableHead>
                            <TableHead className="text-right p-3">Percentage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.type} className="border-t">
                                <TableCell className="p-3">{row.type}</TableCell>
                                <TableCell className="text-right p-3">{row.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-right p-3">{row.pct}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium mb-4 text-center">Distribution</h3>
                <div className="h-64">
                    <PieChart data={chartData} />
                </div>
            </div>
        </div>
    );
}
