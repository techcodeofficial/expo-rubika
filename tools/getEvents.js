const getEvents = () => {
    return {
        onStartRequestFile: null,
        onEndRequestFile: null,
        onSuccessRequestFile: null,
        onErrorRequestFile: null,
        onStartUpload: null,
        onUploadPartSend: null,
        onEndUpload: null,
        onErrorUpload: null,
        onUploadCanceled: null,
        onErrorRequest: null,
        onStartRequest: null,
        onSendRequest: null,
        onCancelRequest: null,
        onOpen: null,
        onError: null,
        onClose: null,
        onMessage: null,
        onDownloadStart: null,
        onDownloadPart: null,
        onDownloadEnd: null,
        onDownloadCanceled: null
    };
};
export default getEvents;
