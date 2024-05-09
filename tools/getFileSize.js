import getFileBuffer from "./getFileBuffer";
const getFileSize = async fileUri => {
    return getFileBuffer(fileUri).length;
};
export default getFileSize;
