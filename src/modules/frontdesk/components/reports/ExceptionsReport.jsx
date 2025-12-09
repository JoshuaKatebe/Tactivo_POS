import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";
import { Card } from "../../../../components/ui/Card";

export default function ExceptionsReport() {
    const data = [
        { time: "10:45 AM", type: "Voided Tx", details: "Transaction #10244 cancelled by Manager", value: 450, user: "Admin", status: "Resolved" },
        { time: "11:20 AM", type: "Refund", details: "Refund for wrong fuel grade pumped", value: 200, user: "Manager", status: "Pending Review" },
        { time: "02:15 PM", type: "Deleted Item", details: "Engine Oil removed from cart", value: 150, user: "Cashier 1", status: "Auto-Approved" },
        { time: "04:30 PM", type: "Price Override", details: "Bulk discount applied manually", value: -50, user: "Manager", status: "Flagged" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">Exceptions (Voids, Refunds, Deletions)</h2>

            <Card className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left p-4 bg-slate-50">Time</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Type</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Details</TableHead>
                            <TableHead className="text-right p-4 bg-slate-50">Value (ZMW)</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Authorized By</TableHead>
                            <TableHead className="text-left p-4 bg-slate-50">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i} className="border-t hover:bg-slate-50">
                                <TableCell className="p-4 text-slate-500 text-sm">{row.time}</TableCell>
                                <TableCell className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase
                        ${row.type.includes('Void') ? 'bg-red-100 text-red-700' :
                                            row.type.includes('Refund') ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-100 text-slate-700'}`}>
                                        {row.type}
                                    </span>
                                </TableCell>
                                <TableCell className="p-4 text-slate-700">{row.details}</TableCell>
                                <TableCell className="text-right p-4 font-medium text-slate-900">{Math.abs(row.value).toLocaleString()}</TableCell>
                                <TableCell className="p-4 text-slate-600">{row.user}</TableCell>
                                <TableCell className="p-4">
                                    <span className={`text-xs font-medium
                        ${row.status === 'Resolved' ? 'text-green-600' :
                                            row.status === 'Flagged' ? 'text-red-500' :
                                                'text-slate-500'}`}>
                                        {row.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <div className="flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50">
                    Download Audit Log
                </button>
            </div>
        </div>
    );
}
