// src/modules/frontdesk/screens/Tanks.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet, Thermometer, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { fuelApi } from "@/api/fuel";

/**
 * Tanks.jsx
 * - Mocked ATG data (based on ATG_TANK_LEVELS fields)
 * - 24h trend with injected delivery markers
 * - Delivery markers show tooltip with amount & time (your choice #1)
 * - Overfill detection + alarm visuals
 */

import { useFuel } from "@/context/FuelContext";

// ... (keep generateTrendWithDeliveries if you want, or simplify)
function generateTrendWithDeliveries(baseVolume, deliveries = []) {
  // Simplified trend for now
  return Array.from({ length: 24 }).map((_, hour) => ({
    hour: `${hour}:00`,
    volume: baseVolume,
  }));
}

export default function Tanks() {
  const { tanks: tanksData, loading } = useFuel();

  // Dummy Data State
  const [dummyTanks, setDummyTanks] = useState([
    {
      Tank: 1,
      ProductName: "Petrol",
      Capacity: 25000,
      ProductVolume: 14250, // 57%
      ProductHeight: 1200,
      WaterHeight: 0,
      Temperature: 24.5,
      TankFillingPercentage: 57,
      AlarmCode: "OK",
      UniqueID: "TK-1"
    },
    {
      Tank: 2,
      ProductName: "Diesel",
      Capacity: 25000,
      ProductVolume: 17750, // 71%
      ProductHeight: 1500,
      WaterHeight: 0,
      Temperature: 23.8,
      TankFillingPercentage: 71,
      AlarmCode: "OK",
      UniqueID: "TK-2"
    },
    {
      Tank: 3,
      ProductName: "Premium",
      Capacity: 20000,
      ProductVolume: 2000, // Starts low
      ProductHeight: 200,
      WaterHeight: 0,
      Temperature: 24.0,
      TankFillingPercentage: 10,
      AlarmCode: "LOW LEVEL", // Initially low
      UniqueID: "TK-3"
    }
  ]);

  // Refueling Simulation for Tank 3
  useEffect(() => {
    const interval = setInterval(() => {
      setDummyTanks(prev => prev.map(t => {
        if (t.Tank === 3) {
          // Increment volume
          const fillRate = 50; // Liters per tick
          let newVol = t.ProductVolume + fillRate;
          if (newVol > t.Capacity) newVol = 2000; // Reset loop

          const newPercent = Math.round((newVol / t.Capacity) * 100);

          return {
            ...t,
            ProductVolume: newVol,
            TankFillingPercentage: newPercent,
            ProductHeight: Math.round(newVol / 10), // Rough calc
            AlarmCode: newPercent < 15 ? "LOW LEVEL" : (newPercent > 95 ? "OVERFILL" : "OK")
          };
        }
        return t;
      }));
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, []);

  const tanks = useMemo(() => {
    return dummyTanks.map(t => {
      // Estimate capacity if not provided
      const capacity = t.Capacity || 10000;
      const productVolume = t.ProductVolume || 0;
      const ullage = capacity - productVolume;

      return {
        Tank: t.Tank,
        ProductName: t.ProductName,
        ProductVolume: productVolume,
        ProductHeight: t.ProductHeight || 0,
        WaterHeight: t.WaterHeight || 0,
        Temperature: t.Temperature || 0,
        TankFillingPercentage: t.TankFillingPercentage || 0,
        Capacity: capacity,
        Ullage: ullage,
        EmptyVolume: 0,
        TheoreticalLevel: productVolume,
        ATGType: "ATG",
        AlarmCode: t.AlarmCode,
        Date: new Date().toLocaleDateString(),
        Time: new Date().toLocaleTimeString(),
        UniqueID: t.UniqueID,
        deliveries: []
      };
    });
  }, [dummyTanks]);

  if (loading && tanks.length === 0 && false) { // Disable loading check for dummy data
    return <div className="p-8 text-center">Loading Tank Data...</div>;
  }

  const productColor = (name) => {
    if (name === "Unleaded") return "bg-green-500";
    if (name === "Premium") return "bg-yellow-500";
    return "bg-sky-600"; // Diesel
  };

  const alarmColor = (code) => {
    if (code === "OK") return "bg-green-600";
    if (code === "LOW LEVEL") return "bg-red-600 animate-pulse";
    if (code === "WATER DETECTED") return "bg-orange-600 animate-ping";
    if (code === "OVERFILL") return "bg-rose-600";
    return "bg-gray-600";
  };

  // Custom tooltip: if hovered payload has a delivery -> show delivery details, else show normal
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="bg-white/95 dark:bg-slate-800/95 border rounded p-2 text-xs shadow">
        <div className="font-semibold mb-1">{label}</div>
        <div>Volume: <span className="font-medium">{Number(data.volume).toLocaleString()} L</span></div>
        {data.delivery ? (
          <div className="mt-1">
            <div className="font-semibold text-sm">Delivery</div>
            <div>Qty: <span className="font-medium">{data.delivery.qty.toLocaleString()} L</span></div>
            <div>Time: {data.delivery.time}</div>
            {data.delivery.supplier && <div>Supplier: {data.delivery.supplier}</div>}
            {data.delivery.note && <div className="text-slate-500 text-xs mt-1">{data.delivery.note}</div>}
          </div>
        ) : null}
      </div>
    );
  };

  // Render
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <h1 className="text-2xl font-bold mb-2">ATG Tank Monitoring</h1>

      <div className="mb-4 text-sm text-slate-600 flex justify-between">
        <span>Real-time Monitor</span>
        <span>
          <span className="text-emerald-600">
            Live tanks: {tanks.length}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tanks.map((t) => {
          // prepare trend with deliveries injected
          const trend = generateTrendWithDeliveries(t.ProductVolume, t.deliveries || []);

          const percent = Math.round((t.ProductVolume / t.Capacity) * 100);
          const overfill = percent > 95; // arbitrary threshold for overfill alert

          return (
            <Card key={t.UniqueID} className="bg-white/80 dark:bg-slate-800/60 border">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Tank {t.Tank}</span>
                      <span className="text-sm text-slate-500">— {t.ProductName}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">ATG: {t.ATGType}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={`${alarmColor(t.AlarmCode)} text-white`}>
                      {t.AlarmCode}
                    </Badge>
                    {overfill && (
                      <Badge className="bg-rose-600 text-white ml-1">OVERFILL</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex gap-6">
                  {/* Cylinder */}
                  <div className="relative w-24 h-64 rounded-b-3xl rounded-t-xl border-2 border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner">
                    <div
                      className={`absolute bottom-0 w-full transition-all duration-700 ${productColor(t.ProductName)}`}
                      style={{ height: `${Math.max(1, Math.min(100, percent))}%` }}
                    />

                    {/* water layer */}
                    {t.WaterHeight > 0 && (
                      <div
                        className="absolute bottom-0 w-full bg-blue-300/80"
                        style={{ height: "6%" }}
                        title="Water layer detected"
                      />
                    )}

                    {/* small label */}
                    <div className="absolute top-1 left-1 text-xs text-slate-700 dark:text-slate-200">
                      {percent}%
                    </div>
                  </div>

                  {/* Data */}
                  <div className="text-sm flex-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-slate-500">Volume</div>
                        <div className="font-semibold">{(t.ProductVolume || 0).toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Capacity</div>
                        <div className="font-semibold">{(t.Capacity || 0).toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Ullage</div>
                        <div className="font-semibold">{(t.Ullage || 0).toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Empty Vol</div>
                        <div className="font-semibold">{(t.EmptyVolume || 0).toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Prod Height</div>
                        <div className="font-semibold">{t.ProductHeight || 0} mm</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Water Height</div>
                        <div className="font-semibold">{t.WaterHeight || 0} mm</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Temp</div>
                        <div className="font-semibold">{t.Temperature || 0}°C</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Theoretical</div>
                        <div className="font-semibold">{(t.TheoreticalLevel || 0).toLocaleString()} L</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 mt-2">
                      Updated: {t.Date} {t.Time}
                    </div>
                  </div>
                </div>

                <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

                {/* Trend + delivery markers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold">24h Trend</div>
                    <div className="text-xs text-slate-500">Delivery markers shown</div>
                  </div>

                  <div style={{ width: "100%", height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend} margin={{ top: 6, right: 6, left: 6, bottom: 6 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} minTickGap={10} />
                        <YAxis domain={["dataMin - 50", "dataMax + 50"]} hide />
                        <Tooltip content={<CustomTooltip />} />

                        {/* delivery vertical lines */}
                        {trend.map((pt, i) =>
                          pt.delivery ? (
                            <ReferenceLine
                              key={`rl-${i}`}
                              x={pt.hour}
                              stroke="#0ea5e9"
                              strokeDasharray="4 3"
                              label={{
                                value: "Delivery",
                                position: "top",
                                fill: "#0ea5e9",
                                fontSize: 10,
                              }}
                            />
                          ) : null
                        )}

                        {/* main line */}
                        <Line
                          type="monotone"
                          dataKey="volume"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={(dotProps) => {
                            const { cx, cy, payload } = dotProps;
                            // If this point has a delivery, render a teal droplet marker
                            if (payload && payload.delivery) {
                              return (
                                <g>
                                  <circle cx={cx} cy={cy} r={6} fill="#06b6d4" stroke="#0369a1" strokeWidth={1} />
                                  <text
                                    x={cx}
                                    y={cy + 4}
                                    fill="white"
                                    fontSize="10"
                                    fontWeight="600"
                                    textAnchor="middle"
                                  >
                                    💧
                                  </text>
                                </g>
                              );
                            }
                            // regular small dot
                            return <circle cx={cx} cy={cy} r={2.5} fill="#3b82f6" />;
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Delivery cards below chart (readable) */}
                  <div className="mt-3 space-y-2">
                    <div className="text-sm font-semibold mb-1">Recent Deliveries</div>
                    <div className="grid grid-cols-1 gap-2">
                      {t.deliveries && t.deliveries.length ? (
                        t.deliveries
                          .slice()
                          .reverse()
                          .map((d, idx) => (
                            <div key={idx} className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                              <div>
                                <div className="font-medium">+{d.qty.toLocaleString()} L</div>
                                <div className="text-xs text-slate-500">{d.supplier} • {d.note}</div>
                              </div>
                              <div className="text-xs text-slate-500">{d.hour}:00</div>
                            </div>
                          ))
                      ) : (
                        <div className="text-xs text-slate-500">No deliveries in the last 24h</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
