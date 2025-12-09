import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Card } from "../../../../components/ui/Card";

export default function TaxSummaryReport() {
    const data = [
        { date: "2023-06-15", product: "Unleaded Petrol", category: "Fuel", total: 15000, taxRate: "16%", tax: 2400 },
        { date: "2023-06-15", product: "Diesel", category: "Fuel", total: 12000, taxRate: "16%", tax: 1920 },
        { date: "2023-06-15", product: "Store Items", category: "Goods", total: 5000, taxRate: "16%", tax: 800 },
        { date: "2023-06-15", product: "Zero-Rated Items", category: "Goods", total: 1200, taxRate: "0%", tax: 0 },
    ];
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800">Tax Summary (VAT)</h2>
                <div className="text-right">
                    <span className="text-sm text-slate-500">Total Tax Collected Today</span>
                    <p className="text-xl font-bold text-slate-900">ZMW 5,120.00</p>
                </div>
            </div>

            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-4 bg-slate-50">Date</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Product/Category</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Category</TableHead>
                            <TableHead className="text-right p-4 bg-slate-50">Tax Rate</TableHead>
                            <TableHead className="text-right p-4 bg-slate-50">Total Value (ZMW)</TableHead>
                            <TableHead className="text-right p-4 bg-slate-50">Tax Amount (ZMW)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i} className="border-t hover:bg-slate-50">
                                <TableCell className="p-4 text-slate-600">{row.date}</TableCell>
                                <TableCell className="p-4 font-medium text-slate-800">{row.product}</TableCell>
                                <TableCell className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${row.category === 'Fuel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {row.category}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right p-4 text-slate-600">{row.taxRate}</TableCell>
                                <TableCell className="text-right p-4 font-medium">{row.total.toLocaleString()}</TableCell>
                                <TableCell className="text-right p-4 font-bold text-slate-900">{row.tax.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <p className="text-xs text-slate-500 mt-2">* Tax calculations are based on configured rates per product category.</p>
        </div>
    );
}
