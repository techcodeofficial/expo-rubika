const getFileMime = uri => {
    let decodeUri = decodeURIComponent(uri).split(".");
    let mime = decodeUri[decodeUri.length - 1];
    return mime;
};
export default getFileMime;
