import * as VideoThumbnails from "expo-video-thumbnails";
const getVideoThumbnail = async (videoUri, videoDuration) => {
    let { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: videoDuration / 2
    });
    return uri;
};
export default getVideoThumbnail;
