import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import StationSelector from "@/components/layout/StationSelector";

export default function Navbar({ onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 py-3 shadow-sm"
    >
      {/* Left: Hamburger (mobile) + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden hover:bg-accent/20"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>

        <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Z360 POS
        </span>
      </div>

      {/* Middle: Station Selector */}
      <div className="hidden sm:flex items-center">
        <StationSelector />
      </div>

      {/* Right: Theme Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-accent/20"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-blue-600" />
          )}
        </Button>
      </div>
    </motion.nav>
  );
}
