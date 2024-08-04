import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  const fileUploaded = await storage.createFile(
    "65000e9572111b980c70",
    ID.unique(),
    file
  );
  return fileUploaded;
};

export default uploadImage;
