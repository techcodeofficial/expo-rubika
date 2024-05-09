import * as MediaLibrary from "expo-media-library";
const getAudioInfo = async audioUri => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        return {
            duration: 1
        };
    }
    const asset = await MediaLibrary.createAssetAsync(audioUri);
    const { duration } = asset;
    return {
        duration,
        asset
    };
};
export default getAudioInfo;
