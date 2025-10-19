import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants";

const pickImage = async (): Promise<string | null> => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (!result.canceled && result.assets.length > 0) {
    console.log("Selected image result:", result.assets[0].uri);
    return result.assets[0].uri;
  }

  return null;
};

const uploadPhoto = async (uri: string): Promise<string> => {
  const formData = new FormData();
  formData.append("imagen", {
    uri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any); // 'as any' needed for React Native FormData

  try {
    const response = await axios.post(`${BASE_URL}/user/upload-propfile-photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const useUploadImage = (setSetupData: (data: any) => void) => {
  const [image, setImage] = useState<string | null>(null);
  const handleImagePicker = async () => {
    try {
      const uri = await pickImage();
      if (uri) {
        const uploadedImageUrl = await uploadPhoto(uri);
        setImage(uploadedImageUrl);
        setSetupData((prevData: any) => ({
          ...prevData,
          fotoUrl: uploadedImageUrl,
        }));
      }
    } catch (error) {
      console.error("Error in handleImagePicker:", error);
    }
  };

  return { handleImagePicker, image };
};
