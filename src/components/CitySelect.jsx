

"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "muhuratmitra_city";

const CITIES = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Varanasi",
  "Jaipur",
];

export default function CitySelect({ initialCity = "Jaipur" }) {
  const [city, setCity] = useState(initialCity);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore saved city after component mounts
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem(STORAGE_KEY);

      if (savedCity && CITIES.includes(savedCity)) {
        setCity(savedCity);
      }
    } catch (error) {
      console.error("Unable to restore selected city:", error);
    }

    setIsInitialized(true);
  }, []);

  // Persist city whenever selection changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(STORAGE_KEY, city);
    } catch (error) {
      console.error("Unable to save selected city:", error);
    }
  }, [city, isInitialized]);

  return (
    <div className="w-full sm:w-52">
      <label
        htmlFor="home-city"
        className="mb-1.5 block text-xs font-medium text-muted-foreground"
      >
        आपका शहर
      </label>

      <Select value={city} onValueChange={setCity}>
        <SelectTrigger
          id="home-city"
          aria-label="अपना शहर चुनें"
          className="w-full bg-card"
        >
          <MapPin
            className="mr-2 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <SelectValue placeholder="शहर चुनें" />
        </SelectTrigger>

        <SelectContent>
          {CITIES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

