import React from "react";
import { Card } from "../../../../components/ui/Card";

export default function AIAnalyticsReport() {
    return (
        <div className="space-y-6">
            {/* Header Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-blue-900">AI Anomaly Detection Active</h3>
                        <p className="text-blue-700">System is monitoring transactions, inventory, and sensor data in real-time.</p>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-sm text-blue-600 font-medium">Last Scan</div>
                    <div className="text-lg font-bold text-blue-900">Just now</div>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-slate-800">Recent Discrepancy Alerts</h2>

            <div className="space-y-4">
                {/* Critical Alert */}
                <Card className="border-l-4 border-l-red-500 overflow-hidden">
                    <div className="p-4 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded uppercase">Critical</span>
                                <h3 className="font-semibold text-slate-900">Cash Shortage Detected</h3>
                            </div>
                            <span className="text-sm text-slate-500">Yesterday, Shift 2 • 18:45 PM</span>
                        </div>
                        <div className="mt-3 pl-0 md:pl-16">
                            <p className="text-slate-700">
                                Declared cash (<span className="font-medium text-slate-900">ZMW 4,800</span>) is significantly lower than system total (<span className="font-medium text-slate-900">ZMW 5,000</span>) for Cashier ID #442.
                            </p>
                            <p className="text-sm text-slate-500 mt-1">Variance: - ZMW 200.00 (4%)</p>
                        </div>
                        <div className="mt-4 pl-0 md:pl-16 flex gap-3">
                            <button className="text-sm font-medium text-red-600 hover:text-red-700">Investigate</button>
                            <button className="text-sm font-medium text-slate-500 hover:text-slate-700">Dismiss</button>
                        </div>
                    </div>
                </Card>

                {/* Warning Alert */}
                <Card className="border-l-4 border-l-orange-500 overflow-hidden">
                    <div className="p-4 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 text-xs font-bold text-orange-700 bg-orange-100 rounded uppercase">Warning</span>
                                <h3 className="font-semibold text-slate-900">Fuel Dispensed Mismatch</h3>
                            </div>
                            <span className="text-sm text-slate-500">Today, 14:30 PM</span>
                        </div>
                        <div className="mt-3 pl-0 md:pl-16">
                            <p className="text-slate-700">
                                Pump 2 dispensed <span className="font-medium text-slate-900">45.4 Litres</span>, but Sale recorded <span className="font-medium text-slate-900">40.0 Litres</span>.
                            </p>
                            <p className="text-sm text-slate-500 mt-1">Potential calibration drift or unregistered dispensing detected.</p>
                        </div>
                    </div>
                </Card>

                {/* Info Alert */}
                <Card className="border-l-4 border-l-blue-500 overflow-hidden">
                    <div className="p-4 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded uppercase">Insight</span>
                                <h3 className="font-semibold text-slate-900">Unusual Refund Activity</h3>
                            </div>
                            <span className="text-sm text-slate-500">Today, 10:15 AM</span>
                        </div>
                        <div className="mt-3 pl-0 md:pl-16">
                            <p className="text-slate-700">
                                High number of refunds processed by Manager ID #12 within 1 hour.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
