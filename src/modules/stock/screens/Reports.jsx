import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Reports() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full border-dashed border-2 bg-slate-50 dark:bg-slate-800/50">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                        Stock Reports
                    </h2>
                    <p className="text-slate-500 text-sm">
                        This module is coming soon. You will be able to generate detailed stock reports and analytics.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

