import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Fuel, Package, Boxes, Layers, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({
  currentCategory,
  setCurrentCategory,
  ptsConnected = true, // optional prop - default disconnected
  onLogout = null,
  onBackOfficeRequest = null,      // optional logout handler
}) {
  const navigate = useNavigate();

  const categories = [
    { name: "all", label: "All Products", icon: Layers },
    { name: "pump", label: "Pumps", icon: Fuel },
    { name: "stock", label: "Stock Products", icon: Boxes },
    { name: "backoffice", label: "Back Office", icon: Package },
  ];

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
      return;
    }
    // default logout behaviour
    localStorage.removeItem("authToken");
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-3 
                       border-b border-blue-600 bg-blue-900/80 backdrop-blur-sm">
      {/* POS Title */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-wide">TACTIVO Z360 fuel POS</h1>

        {/* Category Buttons */}
        <div className="flex gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.name}
                variant="secondary"
                onClick={() => {
                  setCurrentCategory(cat.name);
                  if (cat.name === "backoffice") {
                    if (typeof onBackOfficeRequest === "function") {
                      onBackOfficeRequest(); // open manager auth modal
                    }
                    return;
                  }
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium",
                  currentCategory === cat.name
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-blue-700 text-white hover:bg-blue-600"
                )}
              >
                <Icon size={16} />
                {cat.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Right side: PTS2 status + Logout + user */}
      <div className="flex items-center gap-4">
        {/* PTS2 connection indicator */}
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium",
            ptsConnected ? "bg-emerald-600 text-white" : "bg-gray-700 text-white/90"
          )}
          title={ptsConnected ? "PTS2 controller connected" : "PTS2 controller disconnected"}
        >
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full inline-block",
              ptsConnected ? "bg-emerald-300" : "bg-red-400"
            )}
          />
          <span>PTS2: {ptsConnected ? "Connected" : "Disconnected"}</span>
        </div>

        {/* Logout button (separated) */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:bg-white/5"
        >
          <LogOut size={16} />
          Logout
        </Button>

        {/* User info */}
        <div className="text-sm text-blue-300">
          User: <span className="text-white font-medium">Sylvia</span>
        </div>
      </div>
    </header>
  );
}
