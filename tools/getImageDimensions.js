import * as MediaLibrary from "expo-media-library";
const getImageDimensions = async imageUri => {
    const { height, width, size } =
        await MediaLibrary.createAssetAsync(imageUri);
    return {
        height,
        width,
        size
    };
};
export default getImageDimensions;
