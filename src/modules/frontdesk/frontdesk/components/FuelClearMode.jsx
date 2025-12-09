// FuelClearMode.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FuelClearMode({
  open,
  payload,
  onClose,
  onAccept,
}) {
  const [received, setReceived] = useState("");

  useEffect(() => {
    if (open && payload) setReceived(String(payload.amount || ""));
  }, [open, payload]);

  if (!payload) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
          >
            <Card className="w-full max-w-xl bg-slate-800 border border-slate-600 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Clear Attendant — Pump {payload.pumpId} Nozzle{" "}
                  {payload.nozzleId}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-white">
                <div className="mb-4">
                  <div className="text-sm text-slate-300">Attendant</div>
                  <div className="font-semibold">{payload.attendantName}</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-slate-300">Amount Due</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ZMW {Number(payload.amount).toFixed(2)}
                  </div>
                </div>

                <label className="block text-sm text-slate-300 mb-1">
                  Amount Received
                </label>
                <input
                  value={received}
                  onChange={(e) => setReceived(e.target.value)}
                  className="w-full p-2 rounded bg-slate-900 text-white border border-slate-600 mb-5"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => onAccept(Number(received || 0))}
                  >
                    Accept & Print
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
