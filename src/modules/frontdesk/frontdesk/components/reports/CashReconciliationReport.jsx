import React from "react";
import { Card } from "../../../../components/ui/Card";

export default function CashReconciliationReport() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
                <h3 className="text-sm font-medium text-slate-500">Cash in Drawer (System)</h3>
                <p className="text-2xl font-bold mt-2">ZMW 5,400</p>
            </Card>
            <Card className="p-4">
                <h3 className="text-sm font-medium text-slate-500">Actual Cash Counted</h3>
                <p className="text-2xl font-bold mt-2 text-blue-600">ZMW 5,350</p>
            </Card>
            <Card className="p-4">
                <h3 className="text-sm font-medium text-slate-500">Declared Drops</h3>
                <p className="text-2xl font-bold mt-2">ZMW 5,000</p>
            </Card>
            <Card className="p-4 border-red-200 bg-red-50">
                <h3 className="text-sm font-medium text-red-700">Shortage</h3>
                <p className="text-2xl font-bold mt-2 text-red-700">- ZMW 50</p>
            </Card>
        </div>
    );
}
