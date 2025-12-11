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

    // DUMMY STATE for Pumps (Linked to Simulator)
    const [dummyPumps, setDummyPumps] = useState(() => {
        // Initialize 20 dummy pumps
        const initial = {};
        for (let i = 1; i <= 20; i++) {
            initial[i] = {
                Pump: i,
                State: 'Idle',
                Status: 'Idle',
                Nozzle: 0,
                Volume: 0,
                Amount: 0,
                Price: 0,
                FuelGradeName: '',
                User: ''
            };
        }
        return initial;
    });

    // Provide update method for Simulator
    const updatePumpStatus = (pumpNumber, statusObj) => {
        setDummyPumps(prev => ({
            ...prev,
            [pumpNumber]: {
                ...prev[pumpNumber],
                ...statusObj
            }
        }));
    };

    // Override pumps state with dummyPumps
    useEffect(() => {
        setPumps(dummyPumps);
        setLoading(false); // Immediate load
    }, [dummyPumps]);

    // Disable real API fetching for now
    /*
    // Poll for updates every 2 seconds (WebSocket is primary, but polling ensures we get updates)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, []);
    // WebSocket Connection ... (Disabled)
    */

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
        emergencyStop,
        updatePumpStatus // Export for Simulator
    };

    return <FuelContext.Provider value={value}>{children}</FuelContext.Provider>;
};
