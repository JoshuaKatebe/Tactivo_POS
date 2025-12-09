import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StationSelector() {
  const [station, setStation] = React.useState(
    localStorage.getItem("selectedStation") || "station1"
  );

  const handleChange = (value) => {
    setStation(value);
    localStorage.setItem("selectedStation", value);
  };

  return (
    <Select value={station} onValueChange={handleChange}>
      <SelectTrigger className="w-44 sm:w-52 bg-background border-border">
        <SelectValue placeholder="Select Station" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="station1">Lusaka Main Station</SelectItem>
        <SelectItem value="station2">Ndola Branch</SelectItem>
        <SelectItem value="station3">Kitwe Station</SelectItem>
      </SelectContent>
    </Select>
  );
}
