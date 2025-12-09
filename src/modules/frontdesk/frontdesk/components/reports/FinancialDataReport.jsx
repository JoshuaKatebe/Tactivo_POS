import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Card } from "../../../../components/ui/Card";

export default function FinancialDataReport() {
    return (
        <div className="space-y-8">
            {/* Fuel Sales */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Fuel Sales</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-3 bg-slate-50">Date</TableHead>
                            <TableHead className="text-left p-3 bg-slate-50">Product</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Total Litres</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Total Sales (ZMW)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3">2023-06-15</TableCell>
                            <TableCell className="p-3">Diesel</TableCell>
                            <TableCell className="text-right p-3">400 L</TableCell>
                            <TableCell className="text-right p-3">12,000</TableCell>
                        </TableRow>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3">2023-06-15</TableCell>
                            <TableCell className="p-3">Unleaded Petrol</TableCell>
                            <TableCell className="text-right p-3">350 L</TableCell>
                            <TableCell className="text-right p-3">9,800</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>

            {/* Non-Fuel Sales */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Non-Fuel Sales (Shop)</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-3 bg-slate-50">Date</TableHead>
                            <TableHead className="text-left p-3 bg-slate-50">Category</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Tx Count</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Total Sales (ZMW)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3">2023-06-15</TableCell>
                            <TableCell className="p-3">Beverages</TableCell>
                            <TableCell className="text-right p-3">45</TableCell>
                            <TableCell className="text-right p-3">2,500</TableCell>
                        </TableRow>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3">2023-06-15</TableCell>
                            <TableCell className="p-3">Snacks</TableCell>
                            <TableCell className="text-right p-3">32</TableCell>
                            <TableCell className="text-right p-3">1,800</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>

            {/* Expense Report */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Expense & Petty Cash</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-3 bg-slate-50">Date</TableHead>
                            <TableHead className="text-left p-3 bg-slate-50">Expense Type</TableHead>
                            <TableHead className="text-left p-3 bg-slate-50">Description</TableHead>
                            <TableHead className="text-right p-3 bg-slate-50">Amount (ZMW)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3">2023-06-15</TableCell>
                            <TableCell className="p-3">Stationery</TableCell>
                            <TableCell className="p-3">Purchase of receipt rolls</TableCell>
                            <TableCell className="text-right p-3 text-red-600 font-medium">450</TableCell>
                        </TableRow>
                        <TableRow className="border-t hover:bg-slate-50">
                            <TableCell className="p-3">2023-06-15</TableCell>
                            <TableCell className="p-3">Cleaning</TableCell>
                            <TableCell className="p-3">Cleaning supplies</TableCell>
                            <TableCell className="text-right p-3 text-red-600 font-medium">200</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
