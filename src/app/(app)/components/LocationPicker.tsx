"use client";

import React from "react";
import Script from "next/script";
import Autocomplete from "react-google-autocomplete";

type LocationAutocompleteProps = {
  onSelect: (place: google.maps.places.PlaceResult) => void;
};

export default function LocationAutocomplete({ onSelect }: LocationAutocompleteProps) {
  return (
    <>
      {/* Load Google Maps Script */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />

      {/* Autocomplete input */}
      <Autocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place: google.maps.places.PlaceResult) => {
          console.log("Selected:", place);
          onSelect(place);
        }}
        options={{
          types: ["geocode"], // for addresses
          componentRestrictions: { country: "ph" }, // optional: limit to PH
        }}
        placeholder="Enter address"
        className="border p-2 rounded w-full"
      />
    </>
  );
}
