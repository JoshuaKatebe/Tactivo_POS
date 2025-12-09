import React, { createContext, useEffect, useState } from "react";
import supabase from "@/api/supabaseClient";
import { useAuth } from "./AuthContext";
import { stationsApi } from "@/api/stations";


export const StationContext = createContext();

/**
 * Provides station data and selected station context
 */
export const StationProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [loading, setLoading] = useState(true);

  const { employee } = useAuth();

  // Load station data from API based on logged-in employee
  useEffect(() => {
    const fetchStation = async () => {
      setLoading(true);
      try {
        if (employee?.station_id) {
          const station = await stationsApi.getById(employee.station_id);
          setStations([station]);
          setCurrentStation(station);
        } else {
          // If no employee station, we might want to try loading from localStorage or just wait
          const saved = localStorage.getItem("currentStation");
          if (saved) {
            // If we have a saved ID but no employee context yet, we might try to fetch it
            // But for now, let's rely on the employee context being the source of truth
          }
        }
      } catch (err) {
        console.error("Error fetching station:", err);
      } finally {
        setLoading(false);
      }
    };

    if (employee) {
      fetchStation();
    }
  }, [employee]);

  // Save selected station to localStorage
  useEffect(() => {
    if (currentStation?.id) {
      localStorage.setItem("currentStation", currentStation.id);
    }
  }, [currentStation]);

  // Handle station change
  const handleSetStation = (stationId) => {
    const selected = stations.find((s) => s.id === stationId);
    if (selected) setCurrentStation(selected);
  };

  return (
    <StationContext.Provider
      value={{
        stations,
        currentStation,
        setCurrentStation: handleSetStation,
        loading,
      }}
    >
      {children}
    </StationContext.Provider>
  );
};

export const useStation = () => {
  const context = React.useContext(StationContext);
  if (!context) {
    throw new Error("useStation must be used within StationProvider");
  }
  return context;
};