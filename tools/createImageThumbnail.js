import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
const createImageThumbmail = async imageUri => {
    const resizedImage = await ImageManipulator.manipulateAsync(imageUri, [
        { resize: { width: 45, height: 45 } }
    ]);
    const base64Image = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64
    });
    return base64Image;
};
export default createImageThumbmail;
