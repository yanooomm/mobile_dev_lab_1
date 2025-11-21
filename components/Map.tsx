import { useRouter } from "expo-router";
import React from "react";
import MapView, { LongPressEvent, Marker } from "react-native-maps";
import { useMarkers } from "../context/MarkersContext";
import { MarkerData } from "../types";

export default function Map() {
  const { markers, addMarker } = useMarkers();
  const router = useRouter(); // роутер для перехода на страницу маркера когда пользователь нажимает на маркер

  // обработка долгого нажатия на карту
  const handleLongPress = (event: LongPressEvent) => {
    const { coordinate } = event.nativeEvent; // получаем объект с координатами, где пользователь долго нажал на карту
    const newMarker: MarkerData = { // создаем новый маркер
      id: Date.now().toString(),
      coordinate,
      title: "Новый маркер",
      description: "",
      images: [],
    };
    addMarker(newMarker);
  };

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 58.0105,
        longitude: 56.2294,
        latitudeDelta: 0.05, // задаем масштаб карты
        longitudeDelta: 0.05,
      }}
      onLongPress={handleLongPress} // привязываем обработчик добавления нового маркера
    >

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
          tracksViewChanges={true}
          onCalloutPress={() => router.push(`/marker/${marker.id}`)} // при нажатии на маркер переходим на экран его деталей
        />
      ))}
    </MapView>
  );
}
