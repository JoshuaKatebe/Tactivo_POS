// ...existing code...
export const PUMPS_MOCK = [
  // 8 pump devices with 2 nozzles each = 16 nozzles total (UI will enumerate them Pump 1..16)
  {
    id: "pump-1",
    name: "Pump 1",
    grade: "Diesel",
    price: 15.50,
    nozzles: [
      { number: 1, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
      { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
    ],
    transactions: [],
  },
  {
    id: "pump-2",
    name: "Pump 2",
    grade: "Petrol",
    price: 17.20,
    nozzles: [
      { number: 1, status: "filling", currentSale: 80, currentLiters: 4.65, attendant: "Bob" },
      { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
    ],
    transactions: [{ id: "trx-2-1", nozzle: 1, amount: 80, volume: 4.65, time: "09:12", status: "pending", attendant: "Bob" }],
  },
  {
    id: "pump-3",
    name: "Pump 3",
    grade: "Diesel",
    price: 15.75,
    nozzles: [
      { number: 1, status: "maintenance", currentSale: 0, currentLiters: 0, attendant: null },
      { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
    ],
    transactions: [],
  },
  {
    id: "pump-4",
    name: "Pump 4",
    grade: "Petrol",
    price: 17.00,
    nozzles: [
      { number: 1, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
      { number: 2, status: "filling", currentSale: 35, currentLiters: 2.00, attendant: "Eve" },
    ],
    transactions: [{ id: "trx-4-1", nozzle: 2, amount: 35, volume: 2.0, time: "10:02", status: "pending", attendant: "Eve" }],
  },
  {
    id: "pump-5",
    name: "Pump 5",
    grade: "Diesel",
    price: 15.60,
    nozzles: [
      { number: 1, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
      { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
    ],
    transactions: [],
  },
  {
    id: "pump-6",
    name: "Pump 6",
    grade: "Petrol",
    price: 17.40,
    nozzles: [
      { number: 1, status: "offline", currentSale: 0, currentLiters: 0, attendant: null },
      { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
    ],
    transactions: [],
  },
  {
    id: "pump-7",
    name: "Pump 7",
    grade: "Diesel",
    price: 15.80,
    nozzles: [
      { number: 1, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
      { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
    ],
    transactions: [],
  },
  {
    id: "pump-8",
    name: "Pump 8",
    grade: "Petrol",
    price: 17.10,
    nozzles: [
      { number: 1, status: "filling", currentSale: 60, currentLiters: 3.5, attendant: "Grace" },
      { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
    ],
    transactions: [{ id: "trx-8-1", nozzle: 1, amount: 60, volume: 3.5, time: "12:05", status: "pending", attendant: "Grace" }],
  },
];
// ...existing code...