import React, { useState } from "react";
// import Tabs from "../../../components/ui/Tabs"; // Assuming we might need to adjust imports
import DashboardReport from "../components/reports/DashboardReport";
import PaymentTypeReport from "../components/reports/PaymentTypeReport";
import CashReconciliationReport from "../components/reports/CashReconciliationReport";
import TransactionMetricsReport from "../components/reports/TransactionMetricsReport";
import EmployeeActivityReport from "../components/reports/EmployeeActivityReport";
import TaxSummaryReport from "../components/reports/TaxSummaryReport";
import DailyBalancingReport from "../components/reports/DailyBalancingReport";
import FinancialDataReport from "../components/reports/FinancialDataReport";
import OperationalDataReport from "../components/reports/OperationalDataReport";
import AIAnalyticsReport from "../components/reports/AIAnalyticsReport";
import ExceptionsReport from "../components/reports/ExceptionsReport";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "payments", label: "Payments" },
    { id: "reconciliation", label: "Cash Recon" },
    { id: "transactions", label: "Tx Metrics" },
    { id: "employees", label: "Staff" },
    { id: "tax", label: "Tax" },
    { id: "balancing", label: "Daily Balancing" },
    { id: "financial", label: "Financial" },
    { id: "operational", label: "Ops Data" },
    { id: "ai", label: "AI Insights" },
    { id: "exceptions", label: "Exceptions" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardReport />;
      case "payments": return <PaymentTypeReport />;
      case "reconciliation": return <CashReconciliationReport />;
      case "transactions": return <TransactionMetricsReport />;
      case "employees": return <EmployeeActivityReport />;
      case "tax": return <TaxSummaryReport />;
      case "balancing": return <DailyBalancingReport />;
      case "financial": return <FinancialDataReport />;
      case "operational": return <OperationalDataReport />;
      case "ai": return <AIAnalyticsReport />;
      case "exceptions": return <ExceptionsReport />;
      default: return <DashboardReport />;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex-none">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Reports & Analytics</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Comprehensive station reporting and AI analytics.</p>
      </header>

      <div className="flex-none border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        {renderContent()}
      </div>
    </div>
  );
}