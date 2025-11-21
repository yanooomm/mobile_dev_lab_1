import React, { createContext, useContext, useState } from "react";
import { MarkerData } from "../types";

// типы данных контекста
type MarkersContextType = {
  markers: MarkerData[]; // 
  addMarker: (marker: MarkerData) => void; 
  updateMarker: (id: string, data: Partial<MarkerData>) => void;
  deleteMarker: (id: string) => void;
};

const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

export function MarkersProvider({ children }: { children: React.ReactNode }) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const addMarker = (marker: MarkerData) => { 
    setMarkers((prev) => [...prev, marker]);
  };

  const updateMarker = (id: string, data: Partial<MarkerData>) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
  };

  const deleteMarker = (id: string) =>
    setMarkers(prev => prev.filter(m => m.id !== id));

  return (
    <MarkersContext.Provider value={{ markers, addMarker, updateMarker, deleteMarker }}>
      {children}
    </MarkersContext.Provider>
  );
}

// хук для удобного доступа к контексту
export function useMarkers() {
  const context = useContext(MarkersContext);
  if (!context) { // если useMarkers вызвали вне провайдера возвращаем ошибку
    throw new Error("useMarkers must be used within a MarkersProvider");
  }
  return context;
}
