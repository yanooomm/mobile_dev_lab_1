import React, { useState } from "react";
import { Button, Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ImageData } from "../types";

type Props = {
  images: ImageData[];
  onDelete: (id: string) => void; 
};

export default function ImageList({ images, onDelete }: Props) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null); 

  return (
    <View style={styles.container}>
      {images.map((img) => ( // проходимся по каждому изображению 
        <TouchableOpacity key={img.id} onPress={() => setSelectedImage(img)}/>
      ))}
      
      <Modal visible={!!selectedImage} transparent>
        <View style={styles.modal}>
          {selectedImage && (
            <>
              <Image source={{ uri: selectedImage.uri }} style={styles.preview} />
              <Button title="Удалить" onPress={() => { onDelete(selectedImage.id); setSelectedImage(null); }} />
              <Button title="Закрыть" onPress={() => setSelectedImage(null)} />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap" },
  image: { width: 100, height: 100, margin: 5, borderRadius: 8 },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  preview: { width: 250, height: 250, marginBottom: 10 },
});
