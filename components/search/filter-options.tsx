import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filters } from "@/types/cases";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterOptionsProps {
  onFilterChange: (filters: Filters) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilterChange }) => {
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>(
    [],
  );
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([2023, 2024]);

  const handleJurisdictionChange = (jurisdiction: string) => {
    setSelectedJurisdictions((prev) => {
      const newSelection = prev.includes(jurisdiction)
        ? prev.filter((j) => j !== jurisdiction)
        : [...prev, jurisdiction];
      onFilterChange({
        jurisdictions: newSelection,
        yearRange,
        courts: selectedCourts,
      });
      return newSelection;
    });
  };

  const handleCourtChange = (court: string) => {
    setSelectedCourts((prev) => {
      const newSelection = prev.includes(court)
        ? prev.filter((c) => c !== court)
        : [...prev, court];
      onFilterChange({
        jurisdictions: selectedJurisdictions,
        yearRange,
        courts: newSelection,
      });
      return newSelection;
    });
  };

  const removeCourt = (court: string) => {
    setSelectedCourts((prev) => {
      const newSelection = prev.filter((c) => c !== court);
      onFilterChange({
        jurisdictions: selectedJurisdictions,
        yearRange,
        courts: newSelection,
      });
      return newSelection;
    });
  };

  const removeJurisdiction = (jurisdiction: string) => {
    setSelectedJurisdictions((prev) => {
      const newSelection = prev.filter((j) => j !== jurisdiction);
      onFilterChange({
        jurisdictions: newSelection,
        yearRange,
        courts: selectedCourts,
      });
      return newSelection;
    });
  };

  const handleYearRangeChange = (index: number, value: string) => {
    const newYearRange: [number, number] = [...yearRange] as [number, number];
    newYearRange[index] = parseInt(value);
    setYearRange(newYearRange);
    onFilterChange({
      jurisdictions: selectedJurisdictions,
      yearRange: newYearRange,
      courts: selectedCourts,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jurisdictions
        </label>
        <Select onValueChange={handleJurisdictionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Jurisdictions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Jamaica">Jamaica</SelectItem>
            <SelectItem value="barbados">Barbados</SelectItem>
            <SelectItem value="trinidad">Trinidad and Tobago</SelectItem>
            <SelectItem value="guyana">Guyana</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedJurisdictions.map((jurisdiction) => (
            <Badge key={jurisdiction} variant="secondary">
              {jurisdiction}
              <button
                onClick={() => removeJurisdiction(jurisdiction)}
                className="ml-1 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Court
        </label>
        <Select onValueChange={handleCourtChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Court" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Supreme Court">Supreme Court</SelectItem>
            <SelectItem value="Court of Appeal">Court of Appeal</SelectItem>
            <SelectItem value="High Court">High Court</SelectItem>
            <SelectItem value="Magistrates Court">Magistrates Court</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCourts.map((court) => (
            <Badge key={court} variant="secondary">
              {court}
              <button
                onClick={() => removeCourt(court)}
                className="ml-1 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Year Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="1961"
            max="2024"
            value={yearRange[0]}
            onChange={(e) => handleYearRangeChange(0, e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
          <span>to</span>
          <input
            type="number"
            min="1961"
            max="2024"
            value={yearRange[1]}
            onChange={(e) => handleYearRangeChange(1, e.target.value)}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;
