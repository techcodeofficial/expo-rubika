import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
const getFileBuffer = async fileUri => {
    let content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64
    });
    let buffer = new Uint8Array(Buffer.from(content, "base64"));
    return buffer;
};
export default getFileBuffer;
