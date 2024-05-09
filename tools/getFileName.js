const getFileName = uri => {
    let decodeUri = decodeURIComponent(uri).split("/");
    let fileName = decodeUri[decodeUri.length - 1];
    return fileName;
};
export default getFileName;
