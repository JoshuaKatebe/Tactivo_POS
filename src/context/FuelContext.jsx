import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { fuelApi } from "../api/fuel";

const FuelContext = createContext(null);

export const useFuel = () => useContext(FuelContext);

export const FuelProvider = ({ children }) => {
    const [pumps, setPumps] = useState({});
    const [tanks, setTanks] = useState({});
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    // WebSocket ref
    const ws = useRef(null);

    // Fetch pump and tank data
    const fetchData = async () => {
        try {
            const [pumpsRes, tanksRes] = await Promise.all([
                fuelApi.getPumps(),
                fuelApi.getTanks()
            ]);

            // API client unwraps response.data.data if error === false
            // So pumpsRes and tanksRes should be the data objects directly
            if (pumpsRes && typeof pumpsRes === 'object') {
                setPumps(pumpsRes);
            }

            if (tanksRes && typeof tanksRes === 'object') {
                setTanks(tanksRes);
            }
        } catch (error) {
            console.error("Failed to fetch fuel data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Poll for updates every 2 seconds (WebSocket is primary, but polling ensures we get updates)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, []);

    // WebSocket Connection
    useEffect(() => {
        const connectToWs = () => {
            // Assuming protocol logic relative to window or fixed config
            // The guide says ws://<server-ip>:3000/ws
            // We'll trust the guide's explicit port/path, but usually it might be dynamic in prod
            const wsUrl = `ws://${window.location.hostname}:3000/ws`;

            console.log("Connecting to WebSocket:", wsUrl);
            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log("Fuel WebSocket Connected");
                setConnected(true);
            };

            ws.current.onclose = () => {
                console.log("Fuel WebSocket Disconnected");
                setConnected(false);
                // Reconnect after 3s
                setTimeout(connectToWs, 3000);
            };

            ws.current.onerror = (err) => {
                console.error("Fuel WebSocket Error:", err);
                ws.current.close();
            };

            ws.current.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    handleWsMessage(msg);
                } catch (e) {
                    console.error("Failed to parse WS message:", e);
                }
            };
        };

        connectToWs();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const handleWsMessage = (msg) => {
        switch (msg.type) {
            case "pumpStatus":
                // msg.data.status is the pump object
                // msg.data.pump is the ID
                setPumps((prev) => ({
                    ...prev,
                    [msg.data.pump]: msg.data.status,
                }));
                break;

            case "tankStatus":
                // msg.data.status is the tank object
                // msg.data.tank is the ID
                setTanks((prev) => ({
                    ...prev,
                    [msg.data.tank]: msg.data.status,
                }));
                break;

            case "transaction":
                // Handle completed transaction if needed globally (e.g. toast notification)
                console.log("New Transaction:", msg.data);
                break;

            default:
                // Ignore unknown
                break;
        }
    };

    // Actions
    const authorizePump = async (pumpId, params) => {
        try {
            await fuelApi.authorizePump(pumpId, params);
            return true;
        } catch (e) {
            console.error("Authorize failed:", e);
            throw e;
        }
    };

    const stopPump = async (pumpId) => {
        try {
            await fuelApi.stopPump(pumpId);
            return true;
        } catch (e) {
            console.error("Stop failed:", e);
            throw e;
        }
    };

    const emergencyStop = async (pumpId) => {
        try {
            await fuelApi.emergencyStop(pumpId);
            return true;
        } catch (e) {
            console.error("Emergency stop failed:", e);
            throw e;
        }
    };

    const value = {
        pumps,
        tanks,
        loading,
        connected,
        authorizePump,
        stopPump,
        emergencyStop
    };

    return <FuelContext.Provider value={value}>{children}</FuelContext.Provider>;
};
