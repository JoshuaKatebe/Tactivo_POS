import { useState, useEffect } from "react";
import { getActiveShift, startShift, closeShift } from "../api/shifts";

export default function useShift(attendant) {
  const [shift, setShift] = useState(null);

  useEffect(() => {
    if (!attendant) return;
    getActiveShift(attendant.id).then(setShift);
  }, [attendant]);

  async function beginShift() {
    const newShift = await startShift(attendant.id);
    setShift(newShift);
  }

  async function endShift(summary) {
    await closeShift(shift.id, summary);
    setShift(null);
  }

  return { shift, beginShift, endShift };
}
