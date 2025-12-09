// src/components/ui/Tabs.jsx
import React, { useState } from "react";

/**
 * Simple reusable Tabs system
 * Usage:
 * <Tabs value={tab} onValueChange={setTab}>
 *   <TabsList>
 *     <TabsTrigger value="one">Tab One</TabsTrigger>
 *     <TabsTrigger value="two">Tab Two</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="one">Content A</TabsContent>
 *   <TabsContent value="two">Content B</TabsContent>
 * </Tabs>
 */

export function Tabs({ value, onValueChange, children }) {
  return (
    <div className="w-full">
      {/* Clone children and pass down value props */}
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { tabValue: value, onValueChange })
          : child
      )}
    </div>
  );
}

export function TabsList({ children }) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1 mb-4">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, tabValue, onValueChange }) {
  const active = tabValue === value;
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={`flex-1 py-2 text-sm font-medium rounded-md transition
        ${active
          ? "bg-blue-600 text-white"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, tabValue, children }) {
  if (value !== tabValue) return null;
  return <div className="w-full">{children}</div>;
}

export default { Tabs, TabsList, TabsTrigger, TabsContent };
