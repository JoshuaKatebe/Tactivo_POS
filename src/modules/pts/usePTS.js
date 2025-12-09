import { useEffect, useState } from "react";
import ptsClient from "./ptsClient";
import { Pump } from "./pumpModel";

export function usePTS() {
  const [pumps, setPumps] = useState([]);

  // Fetch initial config once
  async function loadConfig() {
    const request = ptsClient.buildRequest([
      { fn: "GetPumpsConfiguration", fnRef: window.GetPumpsConfiguration, args: [] },
      { fn: "GetFuelGradesConfiguration", fnRef: window.GetFuelGradesConfiguration, args: [] }
    ]);

    const response = await ptsClient.send(request);

    // Convert response → Pump model instances
    const pumpObjects = response.Packets
      .find(p => p.Type === "PumpsConfiguration")
      .Data.Pumps
      .map(p => new Pump(p.Id, "OFFLINE"));

    setPumps(pumpObjects);
  }

  // Poll for status every second
  async function poll() {
    const commands = pumps.map(p => ({
      fn: "PumpGetStatus",
      fnRef: window.PumpGetStatus,
      args: [p.id]
    }));

    const request = ptsClient.buildRequest(commands);
    const response = await ptsClient.send(request);

    // Update pumps based on response
    // (mapping logic to be added)
  }

  useEffect(() => {
    loadConfig();
    const interval = setInterval(poll, 1000);
    return () => clearInterval(interval);
  }, [pumps.length]);

  return pumps;
}
