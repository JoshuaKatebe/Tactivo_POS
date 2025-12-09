import React from "react";
import { Card } from "../../../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/Table";

export default function TransactionMetricsReport() {
    return (
        <div className="space-y-6">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-5">
                    <h3 className="text-sm font-medium text-slate-500">Total Transactions</h3>
                    <p className="text-3xl font-bold mt-2 text-slate-900">210</p>
                </Card>
                <Card className="p-5">
                    <h3 className="text-sm font-medium text-slate-500">Avg Transaction Value</h3>
                    <p className="text-3xl font-bold mt-2 text-slate-900">ZMW 593</p>
                </Card>
                <Card className="p-5">
                    <h3 className="text-sm font-medium text-slate-500">Voided Transactions</h3>
                    <p className="text-3xl font-bold mt-2 text-red-600">3</p>
                </Card>
                <Card className="p-5">
                    <h3 className="text-sm font-medium text-slate-500">Total Refunds</h3>
                    <p className="text-3xl font-bold mt-2 text-orange-600">ZMW 1,200</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Breakdown Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-slate-50">
                        <h3 className="text-lg font-medium text-slate-800">Detailed Breakdown</h3>
                    </div>

                    <Table>
                        <TableBody>
                            <TableRow className="border-b">
                                <TableCell className="p-4 text-slate-600">Successful Transactions</TableCell>
                                <TableCell className="p-4 text-right font-medium text-slate-900">207</TableCell>
                                <TableCell className="p-4 text-right text-sm text-slate-500">98.5%</TableCell>
                            </TableRow>
                            <TableRow className="border-b">
                                <TableCell className="p-4 text-slate-600">Voided Transactions</TableCell>
                                <TableCell className="p-4 text-right font-medium text-slate-900">3</TableCell>
                                <TableCell className="p-4 text-right text-sm text-slate-500">1.4%</TableCell>
                            </TableRow>
                            <TableRow className="border-b">
                                <TableCell className="p-4 text-slate-600">Items Refunded (Qty)</TableCell>
                                <TableCell className="p-4 text-right font-medium text-slate-900">5</TableCell>
                                <TableCell className="p-4 text-right text-sm text-slate-500">-</TableCell>
                            </TableRow>
                            <TableRow className="border-b">
                                <TableCell className="p-4 text-slate-600">Discounted Transactions</TableCell>
                                <TableCell className="p-4 text-right font-medium text-slate-900">12</TableCell>
                                <TableCell className="p-4 text-right text-sm text-slate-500">5.7%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="p-4 text-slate-600">Total Discounts Given</TableCell>
                                <TableCell className="p-4 text-right font-medium text-slate-900">ZMW 450.00</TableCell>
                                <TableCell className="p-4 text-right text-sm text-slate-500">-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Void/Refund Log */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-slate-50">
                        <h3 className="text-lg font-medium text-slate-800">Recent Exceptions</h3>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left p-3 text-xs uppercase text-slate-500">Time</TableHead>
                                <TableHead className="text-left p-3 text-xs uppercase text-slate-500">Type</TableHead>
                                <TableHead className="text-right p-3 text-xs uppercase text-slate-500">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-b">
                                <TableCell className="p-3 text-slate-600">14:20</TableCell>
                                <TableCell className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">VOID</span></TableCell>
                                <TableCell className="p-3 text-right font-medium">ZMW 150.00</TableCell>
                            </TableRow>
                            <TableRow className="border-b">
                                <TableCell className="p-3 text-slate-600">11:05</TableCell>
                                <TableCell className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">REFUND</span></TableCell>
                                <TableCell className="p-3 text-right font-medium">ZMW 50.00</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="p-3 text-slate-600">09:12</TableCell>
                                <TableCell className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">VOID</span></TableCell>
                                <TableCell className="p-3 text-right font-medium">ZMW 1,200.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
