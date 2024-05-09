import * as MediaLibrary from "expo-media-library";
const getVideoInfo = async videoUri => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
        return {
            width: 250,
            height: 300,
            duration: 1
        };
    }
    const asset = await MediaLibrary.createAssetAsync(videoUri);
    const { height, width, duration } = asset;
    return {
        height,
        width,
        duration,
        asset
    };
};
export default getVideoInfo;
