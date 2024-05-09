import musicInfo from "expo-music-info-2";
const getMusicInfo = async (musicUri, extractCover) => {
    let musicMetadata = await musicInfo.getMusicInfoAsync(musicUri, {
        title: true,
        artist: true,
        albom: true,
        picture: !!extractCover
    });
    return musicMetadata;
};
export default getMusicInfo;
