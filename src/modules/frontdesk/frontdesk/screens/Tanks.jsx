// src/modules/frontdesk/screens/Tanks.jsx
import React from "react";
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

/**
 * Tanks.jsx
 * - Mocked ATG data (based on ATG_TANK_LEVELS fields)
 * - 24h trend with injected delivery markers
 * - Delivery markers show tooltip with amount & time (your choice #1)
 * - Overfill detection + alarm visuals
 */

function generateTrendWithDeliveries(baseVolume, deliveries) {
  // Create 24 data points: hours 0..23 with slight variation around baseVolume
  const trend = Array.from({ length: 24 }).map((_, hour) => {
    const noise = Math.round((Math.sin(hour / 3) * 20 + Math.random() * 10) * 10) / 10;
    return {
      hour: `${hour}:00`,
      volume: Math.round((baseVolume + noise) * 10) / 10,
      // delivery field injected later (if deliveries match hour)
    };
  });

  // deliveries: array of { hour: number, qty: number, supplier?, note? }
  deliveries.forEach((d) => {
    if (d.hour >= 0 && d.hour < 24) {
      trend[d.hour].delivery = {
        qty: d.qty,
        supplier: d.supplier,
        note: d.note,
        time: `${d.hour.toString().padStart(2, "0")}:00`,
      };

      // nudge the volume upward at that hour to reflect delivery spike
      trend[d.hour].volume = Math.round((trend[d.hour].volume + d.qty / 100) * 10) / 10;
    }
  });

  return trend;
}

export default function Tanks() {
  // Mock tanks with deliveries
  const tanks = [
    {
      // Unleaded tank
      tDate: "2024-01-15T15:32:00",
      ATGType: "OPW Integra 500",
      AlarmCode: "OK",
      Tank: 1,
      Ullage: 1500,
      ProductHeight: 1300,
      WaterHeight: 12,
      WaterVolume: 18,
      ProductVolume: 8500,
      Temperature: 26.3,
      RecalVolume: 8535,
      EmptyVolume: 1500,
      Date: "2024-01-15",
      Time: "15:32",
      TheoreticalLevel: 8600,
      UniqueID: "ATG-348392",
      Capacity: 10000,
      ProductName: "Unleaded",
      deliveries: [
        { hour: 3, qty: 5000, supplier: "PetroZambia", note: "Bulk delivery" },
        { hour: 14, qty: 2000, supplier: "LocalFuel", note: "Top-up" },
      ],
    },
    {
      // Premium tank
      tDate: "2024-01-15T15:30:00",
      ATGType: "OPW Integra 500",
      AlarmCode: "LOW LEVEL",
      Tank: 2,
      Ullage: 4500,
      ProductHeight: 700,
      WaterHeight: 5,
      WaterVolume: 8,
      ProductVolume: 3600,
      Temperature: 27.1,
      RecalVolume: 3620,
      EmptyVolume: 4500,
      Date: "2024-01-15",
      Time: "15:30",
      TheoreticalLevel: 3800,
      UniqueID: "ATG-884281",
      Capacity: 8000,
      ProductName: "Premium",
      deliveries: [{ hour: 6, qty: 3000, supplier: "PetroZambia", note: "Scheduled" }],
    },
    {
      // Diesel tank
      tDate: "2024-01-15T15:28:00",
      ATGType: "OPW Integra 500",
      AlarmCode: "WATER DETECTED",
      Tank: 3,
      Ullage: 9600,
      ProductHeight: 240,
      WaterHeight: 40,
      WaterVolume: 52,
      ProductVolume: 2400,
      Temperature: 25.4,
      RecalVolume: 2450,
      EmptyVolume: 9600,
      Date: "2024-01-15",
      Time: "15:28",
      TheoreticalLevel: 2600,
      UniqueID: "ATG-553922",
      Capacity: 12000,
      ProductName: "Diesel",
      deliveries: [{ hour: 1, qty: 4000, supplier: "Energy Corp", note: "Emergency refill" }],
    },
  ];

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
      <h1 className="text-2xl font-bold mb-6">ATG Tank Monitoring</h1>

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
                        <div className="font-semibold">{t.ProductVolume.toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Capacity</div>
                        <div className="font-semibold">{t.Capacity.toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Ullage</div>
                        <div className="font-semibold">{t.Ullage.toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Empty Vol</div>
                        <div className="font-semibold">{t.EmptyVolume.toLocaleString()} L</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Prod Height</div>
                        <div className="font-semibold">{t.ProductHeight} mm</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Water Height</div>
                        <div className="font-semibold">{t.WaterHeight} mm</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Temp</div>
                        <div className="font-semibold">{t.Temperature}°C</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Theoretical</div>
                        <div className="font-semibold">{t.TheoreticalLevel.toLocaleString()} L</div>
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
