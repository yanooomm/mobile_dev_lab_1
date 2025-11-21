import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ImageList from "../../components/ImageList";
import { useMarkers } from "../../context/MarkersContext";
import { ImageData } from "../../types";

export default function MarkerDetails() {
  const { id } = useLocalSearchParams(); // получаем ид маркера из урла
  const router = useRouter();
  const { markers, updateMarker, deleteMarker } = useMarkers();

  const marker = markers.find((m) => m.id === id); // ищем нужный маркер из массива по ид (undefined если не найден)

  const [title, setTitle] = useState(marker?.title || ""); 
  const [description, setDescription] = useState(marker?.description || "");
  const [images, setImages] = useState<ImageData[]>(marker?.images || []);
  const coordinate = marker?.coordinate;

  const addImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ // ждем когда пользователь выберет фото из галереи
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const newImage: ImageData = { // создаем объект newImage
          id: Date.now().toString(),
          uri: result.assets[0].uri,
        };
        setImages([...images, newImage]); // создаем новый массив, который содержит старые изображения + новое
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выбрать изображение");
    }
  };

  const deleteImage = (imgId: string) => {
    setImages(images.filter((img) => img.id !== imgId)); // создаем новый массив, оставляя только нужные изображения
  };

  // сохранение данных
  const handleSave = () => {
    if (!marker) return; // если маркер не существует, то ничего не делаем
    updateMarker(marker.id, { title, description, images });
    Alert.alert("Сохранено", "Данные маркера обновлены!");
    router.back(); // возвращаемся на предыдущую страницу (назад к карте)
  };

  if (!marker) { // если маркер не найден, то отображаем сообщение и по кнопке "Назад" возвращаемся к карте
    return (
      <View style={styles.container}>
        <Text>Маркер не найден</Text>
        <Button title="Назад" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}> 

      <Text style={styles.sectionTitle}>Координаты:</Text>
      <Text style={styles.coords}>
        Широта: {coordinate?.latitude.toFixed(5)}{"\n"}
        Долгота: {coordinate?.longitude.toFixed(5)}
      </Text>

      <Text style={styles.label}>Заголовок:</Text>
      <TextInput
        placeholder="Введите заголовок"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Описание:</Text>
      <TextInput
        placeholder="Введите описание"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.textarea}
      />

      <View style={styles.buttonContainer}>
        <Button title="Добавить изображение" onPress={addImage} />
      </View>

      <ImageList images={images} onDelete={deleteImage} /> 

      <View style={styles.saveButton}>
        <Button title="Сохранить" onPress={handleSave} />
      </View>

      <Button
        title="Удалить маркер"
        color="red"
        onPress={() => {
          if (!marker) return;
          deleteMarker(marker.id); 
          Alert.alert("Маркер удален");
          router.back(); 
        }}
      />

      <View style={styles.backButton}>
        <Button title="Назад" color="gray" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  coords: {
    marginBottom: 16,
    color: "#444",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 4,
    fontSize: 16,
    marginBottom: 12,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    minHeight: 80,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 10,
  },
  backButton: {
    marginTop: 10,
  },
});
