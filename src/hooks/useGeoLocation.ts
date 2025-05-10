"use client";

import { useState, useEffect } from "react";

interface GeoLocationData {
  country: string;
  loading: boolean;
  error: string | null;
}

export function useGeoLocation(): GeoLocationData {
  const [geoData, setGeoData] = useState<GeoLocationData>({
    country: "",
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
          throw new Error("Failed to fetch geolocation data");
        }
        const data = await response.json();
        setGeoData({
          country: data.country_name || "",
          loading: false,
          error: null,
        });
      } catch (error) {
        setGeoData({
          country: "",
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    fetchGeoLocation();
  }, []);

  return geoData;
}
