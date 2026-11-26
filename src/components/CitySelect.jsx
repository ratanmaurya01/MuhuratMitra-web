
"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, ChevronDown, Check, X } from "lucide-react";
const STORAGE_KEY = "muhuratmitra_city";
const CITIES = [
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "New Delhi", state: "Delhi NCR" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Pune", state: "Maharashtra" },
];

export default function CitySelect({ initialCity = "Jaipur" }) {
  const [city, setCity] = useState(initialCity);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const savedCity = localStorage.getItem(STORAGE_KEY);

      if (savedCity && CITIES.some((item) => item.name === savedCity)) {
        setCity(savedCity);
      }
    } catch (error) {
      console.error("Unable to restore city:", error);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    try {
      localStorage.setItem(STORAGE_KEY, selectedCity);
    } catch (error) {
      console.error("Unable to save city:", error);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Selected City */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          padding: "10px 16px",
          borderRadius: "50px",
          border: "1px solid #F0D9C4",
          background: "#FFF9EF",
          color: "#572D20",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        <MapPin size={17} color="#D65A24" />
        {city}
        <ChevronDown size={16} />
      </button>

      {/* Modal rendered directly inside document.body */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsOpen(false);
              }
            }}
            style={{
              position: "fixed",
              inset: 0,
              width: "100vw",
              height: "100dvh",
              zIndex: 2147483647,
              background: "rgba(0, 0, 0, 0.58)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              boxSizing: "border-box",
              backdropFilter: "blur(3px)",
            }}
          >
            {/* Modal Card */}
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="city-modal-title"
              onMouseDown={(event) => event.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "420px",
                maxHeight: "min(680px, calc(100dvh - 40px))",
                overflowY: "auto",
                background: "#FFFCFA",
                border: "1px solid #F0E3D6",
                borderRadius: "26px",
                padding: "24px",
                boxSizing: "border-box",
                boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "22px",
                }}
              >
                <h2
                  id="city-modal-title"
                  style={{
                    margin: 0,
                    color: "#48251C",
                    fontSize: "22px",
                    fontWeight: 600,
                  }}
                >
                  Select Your City
                </h2>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  style={{
                    border: 0,
                    background: "transparent",
                    color: "#8A6858",
                    cursor: "pointer",
                    padding: "6px",
                  }}
                >
                  <X size={21} />
                </button>
              </div>

              {/* City Options */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {CITIES.map((item) => {
                  const selected = city === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleCityChange(item.name)}
                      style={{
                        width: "100%",
                        minHeight: "58px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 13px",
                        borderRadius: "13px",
                        border: selected
                          ? "1.5px solid #E9783F"
                          : "1px solid #F2E6D9",
                        background: selected ? "#FFF5E5" : "#FFFFFF",
                        cursor: "pointer",
                        textAlign: "left",
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <MapPin size={19} color="#E66A2E" />

                        <span>
                          <span
                            style={{
                              display: "block",
                              color: "#4C352A",
                              fontSize: "14px",
                              fontWeight: 500,
                            }}
                          >
                            {item.name}
                          </span>

                          <span
                            style={{
                              display: "block",
                              marginTop: "3px",
                              color: "#A18A7B",
                              fontSize: "12px",
                            }}
                          >
                            {item.state}
                          </span>
                        </span>
                      </span>

                      {selected && (
                        <Check size={19} color="#E66A2E" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Close Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    minWidth: "100px",
                    padding: "11px 24px",
                    border: 0,
                    borderRadius: "30px",
                    background: "#E65D1F",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
