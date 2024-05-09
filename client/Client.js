import { Crypto, request, fileRequest, getFileRequest } from "../utils";
import {
    createDeviceHash,
    getClient,
    getRnd,
    parseMarkdown,
    getApi
} from "../helpers";
import {
    getFileBuffer,
    getFileName,
    getFileMime,
    createFileInline,
    getImageDimensions,
    createImageThumbnail,
    getEvents,
    getVideoInfo,
    getVideoThumbnail,
    getAudioInfo,
    getMusicInfo,
    getNowTime,
    getStateTime,
    responseToBuffer,
    concatBuffer
} from "../tools";
class Client {
    constructor(auth, privateKey, platform = "web") {
        this.auth = Crypto.changeAuthType(auth.trim());
        this.privateKey = privateKey;
        this.platform = platform.toLowerCase().startsWith("we")
            ? "web"
            : "android";
        this.crypto = new Crypto(auth, privateKey);
    }
    async handler(method, data, options) {
        let isCanceled = false;
        function cancelRequest() {
            isCanceled = true;
        }
        let forEncData = {
            client: getClient(this.platform),
            method: method,
            input: data
        };
        let enc_data = this.crypto.encrypt(JSON.stringify(forEncData));
        let signData = this.crypto.signData(enc_data);
        let encData = {
            api_version: "6",
            auth: this.auth,
            data_enc: enc_data,
            sign: signData
        };
        let result;
        if (options.onStartRequest) {
            options.onStartRequest({
                requestTime: getNowTime(),
                methodType: method,
                methodData: data,
                cancelRequest
            });
        }
        while (true) {
            if (isCanceled) {
                if (options.onCancelRequest) {
                    options.onCancelRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data
                    });
                }
                return { status: "CANCEL REQUEST" };
                break;
            }
            try {
                result = await request(encData);
                if (options.onSendRequest) {
                    options.onSendRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data
                    });
                }
                break;
            } catch (e) {
                if (options.onErrorRequest) {
                    options.onErrorRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data,
                        cancelRequest
                    });
                }
                continue;
            }
        }
        let response = result.data;
        return JSON.parse(this.crypto.decrypt(response["data_enc"]));
    }
    //get Updates Methods
    onMessage(callback, options = getEvents()) {
        this.getChatsUpdates();
        let ws = new WebSocket(getApi("sock"));
        ws.onopen = e => {
            if (options.onOpen) {
                options.onOpen(e);
            }
            ws.send(
                JSON.stringify({
                    api_version: "5",
                    auth: this.crypto.auth,
                    method: "handShake"
                })
            );
        };
        ws.onerror = e => {
            if (options.onError) {
                options.onError(e);
            }
        };
        ws.onclose = e => {
            if (options.onClose) {
                options.onClose(e);
            }
        };
        ws.onmessage = e => {
            let result = JSON.parse(e.data);
            if (result.status) {
                if (options.onMessage) {
                    options.onMessage(result);
                }
                callback(result);
            } else {
                let { data_enc } = result;
                delete result.data_enc;
                result.receiveData = JSON.parse(this.crypto.decrypt(data_enc));
                if (options.onMessage) {
                    options.onMessage(result);
                }
                callback(result);
            }
        };
    }
    async getChatsUpdates(state, options = getEvents()) {
        return await this.handler(
            "getChatsUpdates",
            {
                state: state || getStateTime()
            },
            options
        );
    }
    //Login methods
    async registerDevice(appName = "TechCode", options = getEvents()) {
        let inputData = {
            token_type: "Web",
            token: "",
            app_version: "WB_4.4.9",
            lang_code: "fa",
            system_version: "Android 12",
            device_model: appName,
            device_hash: createDeviceHash()
        };
        if (
            this.platform.toLowerCase().includes("and") ||
            this.platform.toLowerCase().includes("ios")
        ) {
            inputData["token_type"] = "Firebase";
            inputData["app_version"] = "MA_3.6.4";
            inputData["system_version"] = "Android 12";
        }
        if (this.platform.toLowerCase().includes("pwa")) {
            inputData["token_type"] = "APNS";
            inputData["app_version"] = "PW_2.1.4";
            inputData["system_version"] = "Android 12";
        }
        return await this.handler("registerDevice", inputData, options);
    }
    /*send file methods*/
    async requestSendFile(fileName, fileSize, options = getEvents()) {
        fileName = getFileName(fileName);
        let mime = getFileMime(fileName);
        if (options.onStartRequestFile)
            options.onStartRequestFile({
                startTime: new Date().getTime()
            });
        let result = await this.handler(
            "requestSendFile",
            {
                file_name: fileName,
                size: fileSize,
                mime
            },
            options
        );
        if (options.onEndRequestFile)
            options.onEndRequestFile({
                endTime: new Date().getTime()
            });
        if (result.data) {
            if (options.onSuccessRequestFile)
                options.onSuccessRequestFile({
                    esuccessTime: new Date().getTime()
                });
            result.data.file_name = fileName;
            result.data.file_size = fileSize;
            result.data.mime = mime;
        } else {
            if (options.onErrorRequestFile)
                options.onErrorRequestFile({
                    errorTime: new Date().getTime()
                });
        }
        return result;
    }
    async uploadFile(fileData = {}, buffer, options = {}) {
        let isCanceled = false;
        function cancelUpload() {
            isCanceled = true;
        }
        let bytef = buffer;
        let header = {
            "access-hash-send": fileData.access_hash_send,
            auth: this.crypto.auth,
            "file-id": String(fileData.id),
            "chunk-size": String(bytef.length),
            "content-type": "application/octet-stream",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/3.12.1"
        };
        let result = {};
        if (bytef.length <= 131072) {
            header["part-number"] = "1";
            header["total-part"] = "1";
            header["content-length"] = String(bytef.length);
            if (options.onStartUpload) {
                options.onStartUpload({
                    startTime: getNowTime(),
                    fileSize: bytef.length,
                    cancelUpload,
                    totalPart: 1
                });
            }
            while (true) {
                if (isCanceled) {
                    if (options.onUploadCanceled) {
                        options.onUploadCanceled({
                            cancelTime: getNowTime(),
                            totalPart: 1,
                            partNumber: 1,
                            fileSize: bytef.length,
                            uploadedSize: 0
                        });
                    }
                    return { fileData, status: "UPLOAD CANCELED" };
                    break;
                }
                try {
                    result = await fileRequest(
                        fileData.upload_url,
                        bytef,
                        header
                    );
                    if (options.onUploadPartSend) {
                        options.onUploadPartSend({
                            sendTime: getNowTime(),
                            fileSize: bytef.length,
                            uploadedSize: bytef.length,
                            totalPart: 1,
                            partNumber: 1,
                            cancelUpload
                        });
                    }
                    break;
                } catch (e) {
                    if (options.onErrorUpload) {
                        options.onErrorUpload({
                            errorTime: getNowTime(),
                            totalPart: 1,
                            partNumber: 1,
                            fileSize: bytef.length,
                            uploadedSize: 0,
                            cancelUpload
                        });
                    }
                    continue;
                }
            }
            if (options.onEndUpload) {
                options.onEndUpload({
                    endTime: getNowTime(),
                    totalPart: 1,
                    fileSize: bytef.length
                });
            }
        } else {
            uploadedSize = 0;
            const t = Math.floor(bytef.length / 131072) + 1;
            if (options.onStartUpload) {
                options.onStartUpload({
                    startTime: getNowTime(),
                    fileSize: bytef.length,
                    cancelUpload,
                    totalPart: t
                });
            }
            for (let i = 1; i <= t; i++) {
                if (isCanceled) {
                    if (options.onUploadCanceled) {
                        options.onUploadCanceled({
                            cancelTime: getNowTime(),
                            totalPart: 1,
                            partNumber: 1,
                            fileSize: bytef.length,
                            uploadedSize: 0
                        });
                    }
                    return { fileData, status: "UPLOAD CANCELED" };
                    break;
                }
                if (i !== t) {
                    const k = (i - 1) * 131072;
                    header["chunk-size"] = "131072";
                    header["part-number"] = String(i);
                    header["total-part"] = String(t);
                    while (true) {
                        if (isCanceled) {
                            if (options.onUploadCanceled) {
                                options.onUploadCanceled({
                                    cancelTime: getNowTime(),
                                    totalPart: 1,
                                    partNumber: 1,
                                    fileSize: bytef.length,
                                    uploadedSize: 0
                                });
                            }
                            return { fileData, status: "UPLOAD CANCELED" };
                            break;
                        }
                        try {
                            result = await fileRequest(
                                fileData.upload_url,
                                bytef.slice(k, k + 131072),
                                header
                            );
                            uploadedSize += 131072;
                            if (options.onUploadPartSend) {
                                options.onUploadPartSend({
                                    sendTime: getNowTime(),
                                    fileSize: bytef.length,
                                    uploadedSize: uploadedSize,
                                    totalPart: t,
                                    partNumber: i,
                                    cancelUpload
                                });
                            }
                            break;
                        } catch (e) {
                            if (options.onErrorUpload) {
                                options.onErrorUpload({
                                    errorTime: getNowTime(),
                                    totalPart: t,
                                    partNumber: i,
                                    fileSize: bytef.length,
                                    uploadedSize: uploadedSize,
                                    cancelUpload
                                });
                            }
                            continue;
                        }
                    }
                } else {
                    const k = (i - 1) * 131072;
                    header["chunk-size"] = String(bytef.slice(k).length);
                    header["part-number"] = String(i);
                    header["total-part"] = String(t);
                    while (true) {
                        if (isCanceled) {
                            if (options.onUploadCanceled) {
                                options.onUploadCanceled({
                                    cancelTime: getNowTime(),
                                    totalPart: 1,
                                    partNumber: 1,
                                    fileSize: bytef.length,
                                    uploadedSize: 0
                                });
                            }
                            return { fileData, status: "UPLOAD CANCELED" };
                            break;
                        }
                        try {
                            result = await fileRequest(
                                fileData.upload_url,
                                bytef.slice(k),
                                header
                            );
                            if (options.onUploadPartSend) {
                                options.onUploadPartSend({
                                    sendTime: getNowTime(),
                                    fileSize: bytef.length,
                                    uploadedSize: bytef.length,
                                    totalPart: t,
                                    partNumber: i,
                                    cancelUpload
                                });
                                break;
                            }
                        } catch (e) {
                            console.log(e);
                            if (options.onErrorUpload) {
                                options.onErrorUpload({
                                    errorTime: getNowTime(),
                                    totalPart: t,
                                    partNumber: i,
                                    fileSize: bytef.length,
                                    uploadedSize: uploadedSize,
                                    cancelUpload
                                });
                            }
                            continue;
                        }
                    }
                }
            }
            if (options.onEndUpload) {
                options.onEndUpload({
                    endTime: getNowTime(),
                    totalPart: t,
                    fileSize: bytef.length
                });
            }
        }
        return result;
    }
    async sendPhoto(
        chat_id,
        fileUri,
        caption,
        message_id,
        options = {
            events: getEvents(),
            metadata: null
        }
    ) {
        let fileBuffer = await getFileBuffer(fileUri);
        let fileSize = fileBuffer.length;
        let fileData = await this.requestSendFile(
            fileUri,
            fileSize,
            options.events
        );
        if (fileData.data) {
            let uploadData = await this.uploadFile(
                fileData.data,
                fileBuffer,
                options.events
            );
            if (uploadData.data) {
                if (uploadData.data.access_hash_rec) {
                    let fileInline = createFileInline(
                        fileData.data,
                        uploadData.data.access_hash_rec,
                        "Image"
                    );
                    if (options.metadata) {
                        let width = options.metadata.width || 250;
                        let height = options.metadata.height || 300;
                        fileInline.width = width;
                        fileInline.height = height;
                    } else {
                        let { width, height, size } =
                            await getImageDimensions(fileUri);
                        fileInline.width = width;
                        fileInline.height = height;
                    }
                    fileInline.thumb_inline =
                        await createImageThumbnail(fileUri);
                    console.log(fileInline);
                    return await this.sendMessage(
                        chat_id,
                        caption,
                        message_id,
                        fileInline
                    );
                } else {
                    return uploadData;
                }
            } else {
                return uploadData;
            }
        } else {
            return fileData;
        }
    }
    async sendVideo(
        chat_id,
        fileUri,
        caption,
        message_id,
        options = {
            events: getEvents(),
            metadata: null
        }
    ) {
        let fileBuffer = await getFileBuffer(fileUri);
        let fileSize = fileBuffer.length;
        let fileData = await this.requestSendFile(
            fileUri,
            fileSize,
            options.events
        );
        if (fileData.data) {
            let uploadData = await this.uploadFile(
                fileData.data,
                fileBuffer,
                options.events
            );
            if (uploadData.data) {
                if (uploadData.data.access_hash_rec) {
                    let fileInline = createFileInline(
                        fileData.data,
                        uploadData.data.access_hash_rec,
                        "Video"
                    );
                    let videoThumbnail;
                    if (options.metadata) {
                        let width = options.metadata.width || 250;
                        let height = options.metadata.height || 300;
                        let duration = options.metadata.duration || 1;
                        fileInline.width = width;
                        fileInline.height = height;
                        fileInline.time = duration;
                        videoThumbnail = await createImageThumbnail(
                            await getVideoThumbnail(fileUri, duration)
                        );
                    } else {
                        let { width, height, duration } =
                            await getVideoInfo(fileUri);
                        fileInline.width = width;
                        fileInline.height = height;
                        fileInline.time = duration * 1000;
                        videoThumbnail = await createImageThumbnail(
                            await getVideoThumbnail(fileUri, duration)
                        );
                    }
                    fileInline.thumb_inline = videoThumbnail;
                    return await this.sendMessage(
                        chat_id,
                        caption,
                        message_id,
                        fileInline
                    );
                } else {
                    return uploadData;
                }
            } else {
                return uploadData;
            }
        } else {
            return fileData;
        }
    }
    async sendMusic(
        chat_id,
        fileUri,
        caption,
        message_id,
        options = {
            events: getEvents(),
            metadata: null
        }
    ) {
        let fileBuffer = await getFileBuffer(fileUri);
        let fileSize = fileBuffer.length;
        let fileData = await this.requestSendFile(
            fileUri,
            fileSize,
            options.events
        );
        if (fileData.data) {
            let uploadData = await this.uploadFile(
                fileData.data,
                fileBuffer,
                options.events
            );
            if (uploadData.data) {
                if (uploadData.data.access_hash_rec) {
                    let fileInline = createFileInline(
                        fileData.data,
                        uploadData.data.access_hash_rec,
                        "Music"
                    );
                    let title;
                    if (options.metadata) {
                        fileInline.music_performer =
                            options.metadata.artist || "Unknown";
                        fileInline.time = options.metadata.duration || 1;
                        title = options.metadata.tite || "Unknown";
                    } else {
                        let { duration } = await getAudioInfo(fileUri);
                        let musicInfo = await getMusicInfo(fileUri);
                        let artist;
                        if (musicInfo) {
                            artist = musicInfo.artist || "Unknown";
                            title = musicInfo.artist || getFileName(fileUri);
                        } else {
                            artist = "Unknown";
                            title = getFileName(fileUri);
                        }
                        fileInline.file_name = title;
                        fileInline.time = duration * 1000;
                        fileInline.music_performer = artist;
                    }
                    fileInline.is_round = false;
                    return await this.sendMessage(
                        chat_id,
                        caption,
                        message_id,
                        fileInline
                    );
                } else {
                    return uploadData;
                }
            } else {
                return uploadData;
            }
        } else {
            return fileData;
        }
    }
    async sendVoice(
        chat_id,
        fileUri,
        caption,
        message_id,
        options = {
            events: getEvents(),
            metadata: null
        }
    ) {
        let fileBuffer = await getFileBuffer(fileUri);
        let fileSize = fileBuffer.length;
        let fileData = await this.requestSendFile(
            fileUri,
            fileSize,
            options.events
        );
        if (fileData.data) {
            let uploadData = await this.uploadFile(
                fileData.data,
                fileBuffer,
                options.events
            );
            if (uploadData.data) {
                if (uploadData.data.access_hash_rec) {
                    let fileInline = createFileInline(
                        fileData.data,
                        uploadData.data.access_hash_rec,
                        "Voice"
                    );
                    let title;
                    if (options.metadata) {
                        fileInline.time = options.metadata.duration || 0;
                        title = options.metadata.tite || "Unknown";
                    } else {
                        let { duration } = await getAudioInfo(fileUri);
                        title = getFileName(fileUri);
                        fileInline.time = duration * 1000;
                    }
                    fileInline.file_name = title;
                    return await this.sendMessage(
                        chat_id,
                        caption,
                        message_id,
                        fileInline
                    );
                } else {
                    return uploadData;
                }
            } else {
                return uploadData;
            }
        } else {
            return fileData;
        }
    }
    async sendFile(
        chat_id,
        fileUri,
        caption,
        message_id,
        options = {
            events: getEvents()
        }
    ) {
        let fileBuffer = await getFileBuffer(fileUri);
        let fileSize = fileBuffer.length;
        let fileData = await this.requestSendFile(
            fileUri,
            fileSize,
            options.events
        );
        if (fileData.data) {
            let uploadData = await this.uploadFile(
                fileData.data,
                fileBuffer,
                options.events
            );
            if (uploadData.data) {
                if (uploadData.data.access_hash_rec) {
                    let fileInline = createFileInline(
                        fileData.data,
                        uploadData.data.access_hash_rec,
                        "File"
                    );
                    return await this.sendMessage(
                        chat_id,
                        caption,
                        message_id,
                        fileInline
                    );
                } else {
                    return uploadData;
                }
            } else {
                return uploadData;
            }
        } else {
            return fileData;
        }
    }
    async sendGif(
        chat_id,
        fileUri,
        caption,
        message_id,
        options = {
            events: getEvents(),
            metadata: null
        }
    ) {
        let fileBuffer = await getFileBuffer(fileUri);
        let fileSize = fileBuffer.length;
        let fileData = await this.requestSendFile(
            fileUri,
            fileSize,
            options.events
        );
        if (fileData.data) {
            let uploadData = await this.uploadFile(
                fileData.data,
                fileBuffer,
                options.events
            );
            if (uploadData.data) {
                if (uploadData.data.access_hash_rec) {
                    let fileInline = createFileInline(
                        fileData.data,
                        uploadData.data.access_hash_rec,
                        "Gif"
                    );
                    let videoThumbnail;
                    if (options.metadata) {
                        let width = options.metadata.width || 250;
                        let height = options.metadata.height || 300;
                        let duration = options.metadata.duration || 1;
                        fileInline.width = width;
                        fileInline.height = height;
                        fileInline.time = duration;
                        videoThumbnail = await createImageThumbnail(
                            await getVideoThumbnail(fileUri, duration)
                        );
                    } else {
                        let { width, height, duration } =
                            await getVideoInfo(fileUri);
                        fileInline.width = width;
                        fileInline.height = height;
                        fileInline.time = duration * 1000;
                        videoThumbnail = await createImageThumbnail(
                            await getVideoThumbnail(fileUri, duration)
                        );
                    }
                    fileInline.thumb_inline = videoThumbnail;
                    return await this.sendMessage(
                        chat_id,
                        caption,
                        message_id,
                        fileInline
                    );
                } else {
                    return uploadData.data;
                }
            } else {
                return uploadData.data;
            }
        } else {
            return fileData;
        }
    }
    //download methods
    async downloadFile(file_inline, options = getEvents()) {
        let isCanceled = false;
        function cancelDownload() {
            isCanceled = true;
        }
        let { size, file_id, access_hash_rec, dc_id } = file_inline;
        let arrayBuffers = [];
        let headers = {
             auth: this.crypto.auth,
            "file-id": file_id,
            "access-hash-rec": access_hash_rec,
        };
        if (size <= 262144) {
            if (options.onDownloadStart) {
                options.onDownloadStart({
                    totalParts: 1,
                    downloadTime: new Date().getTime(),
                    cancelDownload
                });
            }
            while (true) {
                if (isCanceled) {
                    if (options.onDownloadCanceled) {
                        options.onDownloadCanceled({
                            cancelTime: new Date().getTime(),
                            cancelInPart: 1,
                            totalPart: 1
                        });
                    }
                    break;
                }
                try {
                    let res = await getFileRequest(
                        `https://messenger${dc_id}.iranlms.ir/GetFile.ashx`,
                        headers
                    );
                    arrayBuffers = res;
                    if (options.onDownloadPart) {
                        options.onDownloadPart({
                            downloadPartTime: new Date().getTime(),
                            totalPart: 1,
                            downloadedPart: 1,
                            cancelDownload
                        });
                    }
                    break;
                } catch (e) {
                    continue;
                }
            }
        } else {
            if (options.onDownloadStart) {
                options.onDownloadStart({
                    totalParts: Math.ceil(size / 262144),
                    downloadTime: new Date().getTime(),
                    cancelDownload
                });
            }
            let startIndex = 0;
            let endIndex = 262144;
            let bufferList = [];
            for (let i = 0; i < Math.ceil(size / 262144); i++) {
                headers["start-index"] = startIndex;
                headers["last-index"] = endIndex;
                startIndex = endIndex + 1;
                endIndex = startIndex + 262143;
                if (isCanceled) {
                    if (options.onDownloadCanceled) {
                        options.onDownloadCanceled({
                            cancelTime: new Date().getTime(),
                            cancelInPart: i,
                            totalPart: Math.ceil(size / 262144)
                        });
                    }
                    break;
                }
                while (true) {
                    if (isCanceled) {
                        if (options.onDownloadCanceled) {
                            options.onDownloadCanceled({
                                cancelTime: new Date().getTime(),
                                cancelInPart: i+1,
                                totalPart: Math.ceil(size / 262144)
                            });
                        }
                        break;
                    }
                    try {
                        let res = await getFileRequest(
                            `https://messenger${dc_id}.iranlms.ir/GetFile.ashx`,
                            headers
                        );
                        bufferList.push(new Uint8Array(res))
                        if (options.onDownloadPart) {
                            options.onDownloadPart({
                                downloadPartTime: new Date().getTime(),
                                totalPart: Math.ceil(size / 262144),
                                downloadedPart: i+1,
                                cancelDownload
                            });
                        }
                        break;
                    } catch (e) {
                        continue;
                    }
                }
            }
            arrayBuffers = concatBuffer(bufferList)
        }
        if (options.onDownloadEnd) {
            options.onDownloadEnd({
                endDownloadTime: new Date().getTime(),
                totalPart: Math.ceil(size / 262144),
                downloadedPart: Math.ceil(size / 262144)
            });
        }
        return arrayBuffers;
    }
    async downloadAvatar(avatar_thumbmail, options = getEvents()) {
        let isCanceled = false;
        let bytes;
        function cancelDownload() {
            isCanceled = true;
        }
        avatar_thumbmail.size = 262144;
        let { size, file_id, access_hash_rec, dc_id } = avatar_thumbmail;
        let headers = {
            auth: this.crypto.auth,
            "file-id": file_id,
            "access-hash-rec": access_hash_rec,
            "content-type": "text/plain",
            "last-index": "262144",
            "start-index": "0"
        };
        while (true) {
            if (isCanceled) {
                if (options.onDownloadCanceled) {
                    options.onDownloadCanceled({
                        cancelTime: new Date().getTime(),
                        cancelInPart: 1,
                        totalPart: 1
                    });
                }
                break;
            }
            try {
                let res = await getFileRequest(
                    `https://messenger${dc_id}.iranlms.ir/GetFile.ashx`,
                    headers
                );
                bytes = res
                if (options.onDownloadPart) {
                    options.onDownloadPart({
                        downloadPartTime: new Date().getTime(),
                        totalPart: 1,
                        downloadedPart: 1,
                        cancelDownload
                    });
                }
                break;
            } catch (e) {
                continue;
            }
        }
        if (options.onDownloadEnd) {
            options.onDownloadEnd({
                endDownloadTime: new Date().getTime(),
                totalPart: Math.ceil(fileInfo.size / 262144),
                downloadedPart: Math.ceil(fileInfo.size / 262144)
            });
        }
        return bytes;
    }
    /*send message methods*/
    async sendMessage(
        chat_id,
        text,
        message_id,
        fileInline = null,
        options = getEvents()
    ) {
        let markdownData = parseMarkdown(text);
        return await this.handler(
            "sendMessage",
            {
                ...(markdownData[0].length !== 0 && {
                    metadata: { meta_data_parts: markdownData[0] }
                }),
                object_guid: chat_id,
                rnd: getRnd(),
                file_inline: fileInline,
                ...(markdownData[1] && { text: markdownData[1] }),
                ...(message_id && {
                    reply_to_message_id: message_id
                })
            },
            options
        );
    }
    async editMessage(chat_id, message_id, new_text, options = getEvents()) {
        return await this.handler(
            "editMessage",
            {
                object_guid: chat_id,
                message_id: message_id,
                text: new_text
            },
            options
        );
    }
    async deleteMessages(chat_id, message_ids, global, options = getEvents()) {
        return await this.handler(
            "deleteMessages",
            {
                object_guid: chat_id,
                message_id: message_ids,
                type: global ? "Global" : "Local"
            },
            options
        );
    }
    async sendLocation(
        chat_id,
        latitude,
        longitude,
        message_id,
        options = getEvents()
    ) {
        return await this.handler(
            "sendMessage",
            {
                object_guid: chat_id,
                rnd: getRnd(),
                ...(message_id && {
                    reply_to_message_id: message_id
                }),
                file_inline: null,
                location: {
                    latitude: latitude,
                    longitude: longitude
                }
            },
            options
        );
    }
    async forwardMessages(from, to, message_ids, options = getEvents()) {
        return await this.handler(
            "forwardMessages",
            {
                from_object_guid: from,
                to_object_guid: to,
                message_ids: message_ids,
                rnd: getRnd()
            },
            options
        );
    }
    //Messages methods
    async getMessages(object_guid, max_id, filter_type, options = getEvents()) {
        return await this.handler(
            "getMessages",
            {
                object_guid: object_guid,
                sort: "FromMax",
                filter_type: filter_type,
                max_id: max_id
            },
            options
        );
    }
    async getMessagesInterval(
        object_guid,
        middle_message_id,
        filter_type,
        options = getEvents()
    ) {
        return await this.handler(
            "getMessagesInterval",
            {
                object_guid,
                middle_message_id,
                filter_type
            },
            options
        );
    }
    async getMessagesByID(object_guid, message_ids, options = getEvents()) {
        return await this.handler(
            "getMessagesByID",
            {
                object_guid,
                message_ids
            },
            options
        );
    }
    async actionOnMessageReaction(
        object_guid,
        message_id,
        action,
        reaction_id,
        options = getEvents()
    ) {
        action = action ? "Add" : "Remove";
        return await this.handler(
            "actionOnMessageReaction",
            { action, reaction_id, message_id, object_guid },
            options
        );
    }
    //users methods
    async getUserInfo(user_guid, options = getEvents()) {
        return await this.handler(
            "getUserInfo",
            {
                user_guid
            },
            options
        );
    }
    async getBlockedUsers(start_id, options = getEvents()) {
        return await this.handler(
            "getBlockedUsers",
            {
                start_id
            },
            ""
        );
    }
    async setBlockUser(user_guid, action, options = getEvents()) {
        switch (action) {
            case 0:
                action = "Block";
                break;
            default:
                action = "Unblock";
        }
        return await this.handler(
            "setBlockUser",
            {
                user_guid,
                action
            },
            options
        );
    }
    async getAvatars(object_guid, options = getEvents()) {
        return await this.handler(
            "getAvatars",
            {
                object_guid
            },
            options
        );
    }
    //account methods
    async getMySessions(options = getEvents()) {
        return await this.handler("getMySessions", {}, options);
    }
    async deleteSession(session_key, options = getEvents()) {
        return await this.handler(
            "deleteSession",
            {
                session_key
            },
            options
        );
    }
    async deleteOtherSessions(options = getEvents()) {
        return await this.handler("deleteOtherSessions", {}, options);
    }
    async updateProfile(first_name, last_name, bio, options = getEvents()) {
        return await this.handler(
            "updateProfile",
            {
                first_name,
                last_name,
                bio,
                updated_parameters: ["first_name", "last_name", "bio"]
            },
            options
        );
    }
    async deleteAvatar(avatar_id, object_guid, options = getEvents()) {
        return await this.handler(
            "deleteAvatar",
            {
                object_guid,
                avatar_id
            },
            options
        );
    }
    async updateUsername(username, options = getEvents()) {
        return await this.handler(
            "updateUsername",
            {
                username
            },
            options
        );
    }
    async logout(options = getEvents()) {
        return await this.handler("logout", {}, options);
    }
    async updateAvatar(file_id, object_guid, options = getEvents()) {
        return await this.handler(
            "uploadAvatar",
            {
                object_guid,
                thumbnail_file_id: file_id,
                main_file_id: file_id
            },
            options
        );
    }
    //channel methods
    async getChannelInfo(channel_guid, options = getEvents()) {
        return await this.handler(
            "getChannelInfo",
            {
                channel_guid
            },
            options
        );
    }
    async joinChannelByLink(link, options = getEvents()) {
        link = link.split("/");
        link = link[link.length - 1];
        return await this.handler(
            "joinChannelByLink",
            {
                hash_link: link
            },
            options
        );
    }
    async joinChannelAction(channel_guid, action, options = getEvents()) {
        switch (action) {
            case 0:
                action = "Leave";
                break;
            default:
                action = "Join";
        }
        return await this.handler(
            "joinChannelAction",
            {
                channel_guid,
                action
            },
            options
        );
    }
    async channelPreviewByJoinLink(link, options = getEvents()) {
        link = link.split("/");
        link = link[link.length - 1];
        return await this.handler(
            "channelPreviewByJoinLink",
            {
                hash_link: link
            },
            options
        );
    }
    async getChannelLink(channel_guid, options = getEvents()) {
        return await this.handler(
            "getChannelLink",
            {
                channel_guid
            },
            options
        );
    }
    async getChannelAllMembers(
        channel_guid,
        start_id,
        search_text,
        options = getEvents()
    ) {
        return await this.handler(
            "getChannelAllMembers",
            {
                channel_guid,
                start_id,
                search_text
            },
            options
        );
    }
    async addChannelMembers(channel_guid, member_guids, options = getEvents()) {
        return await this.handler(
            "addChannelMembers",
            {
                channel_guid,
                member_guids
            },
            options
        );
    }
    async banChannelMember(
        channel_guid,
        member_guid,
        action,
        options = getEvents()
    ) {
        action = action ? "Set" : "Unset";
        return await this.handler(
            "banChannelMember",
            {
                channel_guid,
                member_guid,
                action
            },
            options
        );
    }
    async getBannedChannelMembers(
        channel_guid,
        search_text,
        start_id,
        options = getEvents()
    ) {
        return await this.handler(
            "getBannedChannelMembers",
            {
                channel_guid,
                search_text,
                start_id
            },
            options
        );
    }
    async requestChangeObjectOwner(
        object_guid,
        new_owner_user_guid,
        options = getEvents()
    ) {
        return await this.handler(
            "requestChangeObjectOwner",
            {
                object_guid,
                new_owner_user_guid
            },
            options
        );
    }
    async getPendingObjectOwner(object_guid, options = getEvents()) {
        return await this.handler(
            "getPendingObjectOwner",
            {
                object_guid
            },
            options
        );
    }
    async editChannelInfo(
        channel_guid,
        title,
        description,
        options = getEvents()
    ) {
        return await this.handler(
            "editChannelInfo",
            {
                channel_guid,
                title,
                description,
                updated_parameters: ["title", "description"]
            },
            options
        );
    }
    async setChannelLink(channel_guid, options = getEvents()) {
        return await this.handler(
            "setChannelLink",
            {
                channel_guid
            },
            options
        );
    }
    async setTypeChannel(channel_guid, type, options = getEvents()) {
        type = type + "";
        switch (type) {
            case "0":
                type = "Private";
                break;
            case "1":
                type = "Public";
                break;
            default:
                type = "Private";
        }
        return await this.handler(
            "editChannelInfo",
            {
                channel_guid,
                channel_type: type,
                updated_parameters: ["channel_type"]
            },
            options
        );
    }
    async updateChannelUsername(channel_guid, username, options = getEvents()) {
        return await this.handler(
            "updateChannelUsername",
            {
                channel_guid,
                username
            },
            options
        );
    }
    async checkChannelUsername(username, options = getEvents()) {
        return await this.handler(
            "checkChannelUsername",
            {
                username
            },
            options
        );
    }
    async getChannelAdminMembers(
        channel_guid,
        start_id,
        options = getEvents()
    ) {
        return await this.handler(
            "getChannelAdminMembers",
            {
                channel_guid,
                start_id
            },
            options
        );
    }
    async setChannelAdmin(
        channel_guid,
        member_guid,
        access_list,
        action,
        options = getEvents()
    ) {
        action = action ? "SetAdmin" : "UnsetAdmin";
        return await this.handler(
            "",
            {
                channel_guid,
                member_guid,
                action: action,
                ...(action == "SetAdmin" && { access_list: access_list })
            },
            options
        );
    }
    async getChannelAdminAccessList(
        channel_guid,
        member_guid,
        options = getEvents()
    ) {
        return await this.handler(
            "getChannelAdminAccessList",
            {
                channel_guid,
                member_guid
            },
            options
        );
    }
    async channelSignMessages(
        channel_guid,
        sign_messages,
        options = getEvents()
    ) {
        sign_messages = !!sign_messages;
        return await this.handler(
            "editChannelInfo",
            {
                channel_guid,
                sign_messages,
                updated_parameters: ["sign_messages"]
            },
            options
        );
    }
    async createChannel(
        title,
        description,
        channel_type,
        member_guids,
        options = getEvents()
    ) {
        return await this.handler(
            "addChannel",
            {
                title,
                description,
                channel_type,
                member_guids
            },
            options
        );
    }
    //group Methods
    async getGroupInfo(group_guid, options = getEvents()) {
        return await this.handler(
            "getGroupInfo",
            {
                group_guid
            },
            options
        );
    }
    async joinGroup(link, options = getEvents()) {
        link = link.split("/");
        link = link[link.length - 1];
        return await this.handler(
            "joinGroup",
            {
                hash_link: link
            },
            options
        );
    }
    async leaveGroup(group_guid, options = getEvents()) {
        return await this.handler(
            "leaveGroup",
            {
                group_guid
            },
            options
        );
    }
    async groupPreviewByJoinLink(link, options = getEvents()) {
        link = link.split("/");
        link = link[link.length - 1];
        return await this.handler(
            "groupPreviewByJoinLink",
            {
                hash_link: link
            },
            options
        );
    }
    async getCommonGroups(user_guid, options = getEvents()) {
        return await this.handler(
            "getCommonGroups",
            {
                user_guid
            },
            options
        );
    }
    async getGroupAllMembers(
        group_guid,
        search_text,
        start_id,
        options = getEvents()
    ) {
        return await this.handler(
            "getGroupAllMembers",
            {
                group_guid,
                search_text,
                start_id
            },
            options
        );
    }
    async getGroupDefaultAccess(group_guid, options = getEvents()) {
        return await this.handler(
            "getGroupDefaultAccess",
            {
                group_guid
            },
            options
        );
    }
    async setGroupDefaultAccess(
        group_guid,
        access_list,
        options = getEvents()
    ) {
        return await this.handler(
            "setGroupDefaultAccess",
            {
                group_guid,
                access_list
            },
            options
        );
    }
    async setGroupTimer(group_guid, slow_level, options = getEvents()) {
        let slowLevel = [0, 10, 30, 60, 300, 900, 3600];
        let slow = slowLevel[slow_level];
        return await this.handler(
            "editGroupInfo",
            {
                group_guid,
                slow_mode: slow,
                updated_parameters: ["slow_mode"]
            },
            options
        );
    }
    async getGroupLink(group_guid, options = getEvents()) {
        return await this.handler(
            "getGroupLink",
            {
                group_guid
            },
            options
        );
    }
    async addGroupMembers(group_guid, member_guids, options = getEvents()) {
        return await this.handler(
            "addGroupMembers",
            {
                group_guid,
                member_guids
            },
            options
        );
    }
    async banGroupMember(
        group_guid,
        member_guid,
        action,
        options = getEvents()
    ) {
        action = action ? "Set" : "Unset";
        return await this.handler(
            "banGroupMember",
            {
                group_guid,
                member_guid,
                action
            },
            options
        );
    }
    async getBannedGroupMembers(
        group_guid,
        search_text,
        start_id,
        options = getEvents()
    ) {
        return await this.handler(
            "getBannedGroupMembers",
            {
                group_guid,
                search_text,
                start_id
            },
            options
        );
    }
    async getGroupAdminMembers(group_guid, start_id, options = getEvents()) {
        return await this.handler(
            "getGroupAdminMembers",
            {
                group_guid,
                start_id
            },
            options
        );
    }
    async setGroupAdmin(
        group_guid,
        member_guid,
        access_list,
        action,
        options = getEvents()
    ) {
        action = action ? "SetAdmin" : "setGroupAdmin";
        return await this.handler(
            "setGroupAdmin",
            {
                group_guid,
                member_guid,
                action,
                access_list
            },
            options
        );
    }
    async getGroupAdminAccessList(
        group_guid,
        member_guid,
        options = getEvents()
    ) {
        return await this.handler(
            "getGroupAdminAccessList",
            {
                group_guid,
                member_guid
            },
            options
        );
    }
    async getGroupOnlineCount(group_guid, options = getEvents()) {
        return await this.handler(
            "getGroupOnlineCount",
            {
                group_guid
            },
            options
        );
    }
    async showChatHistoryForNewMembers(
        group_guid,
        account,
        options = getEvents()
    ) {
        action = action ? "Visible" : "Hidden";
        return await this.handler(
            "editGroupInfo",
            {
                group_guid,
                chat_history_for_new_members: status,
                updated_parameters: ["chat_history_for_new_members"]
            },
            options
        );
    }
    async showGlassMessage(group_guid, action, options = getEvents()) {
        action = action ? true : false;
        return await this.handler(
            "editGroupInfo",
            {
                group_guid,
                event_messages: status,
                updated_parameters: ["event_messages"]
            },
            options
        );
    }
    async changeGroupLink(group_guid, options = getEvents()) {
        return await this.handler(
            "setGroupLink",
            {
                group_guid
            },
            options
        );
    }
    async editGroupInfo(group_guid, title, description, options = getEvents()) {
        return await this.handler(
            "editGroupInfo",
            {
                group_guid,
                title,
                description,
                updated_parameters: ["title", "description"]
            },
            options
        );
    }
    async createGroup(title, member_guids, options = getEvents()) {
        return await this.handler(
            "addGroup",
            {
                title,
                member_guids
            },
            options
        );
    }
    async deleteGroup(group_guid, options = getEvents()) {
        return await this.handler(
            "deleteNoAccessGroupChat",
            {
                group_guid
            },
            options
        );
    }
    //contact methods
    async getContacts(start_id, options = getEvents()) {
        return await this.handler(
            "getContacts",
            {
                start_id
            },
            options
        );
    }
    async getContactsUpdates(state = getStateTime(), options = getEvents()) {
        return await this.handler(
            "getContactsUpdates",
            {
                state
            },
            options
        );
    }
    async getContactsLastOnline(user_guids, options = getEvents()) {
        return await this.handler(
            "getContactsLastOnline",
            {
                user_guids
            },
            options
        );
    }
    async deleteContact(user_guid, options = getEvents()) {
        return await this.handler(
            "deleteContact",
            {
                user_guid
            },
            options
        );
    }
    async changeContactInfo(
        first_name,
        last_name,
        phone,
        options = getEvents()
    ) {
        return await this.handler(
            "addAddressBook",
            {
                first_name,
                last_name,
                phone
            },
            options
        );
    }
    //chat methods
    async getChats(start_id, options = getEvents()) {
        return await this.handler(
            "getChats",
            {
                start_id
            },
            options
        );
    }
    async deleteUserChat(
        user_guid,
        last_deleted_message_id,
        options = getEvents()
    ) {
        return await this.handler(
            "deleteUserChat",
            {
                user_guid,
                last_deleted_message_id
            },
            options
        );
    }
    async setPinMessage(
        object_guid,
        message_id,
        action,
        options = getEvents()
    ) {
        action = action ? "Pin" : "Unpin";
        return await this.handler(
            "setPinMessage",
            {
                object_guid,
                message_id,
                action
            },
            options
        );
    }
    async endChatActivity(object_guid, activity, options = getEvents()) {
        switch (activity) {
            case "1":
                activity = "Typing";
                break;
            case "2":
                activity = "Recording";
                break;
            case "3":
                activity = "Uploading";
                break;
            default:
                activity = "Typing";
        }
        return await this.handler(
            "sendChatActivity",
            {
                object_guid,
                activity
            },
            options
        );
    }
    async deleteChatHistory(
        object_guid,
        last_message_id,
        options = getEvents()
    ) {
        return await this.handler(
            "deleteChatHistory",
            {
                object_guid,
                last_message_id
            },
            options
        );
    }
    //other methods
    async getLinkFromAppUrl(uri, options = getEvents()) {
        return await this.handShake(
            "getLinkFromAppUrl",
            {
                app_url: uri
            },
            options
        );
    }
    async getObjectByUsername(username, options = getEvents()) {
        username = username.split("@");
        username = username[username.length - 1];
        return await this.handler(
            "getObjectByUsername",
            {
                username
            },
            options
        );
    }
    async getMyGif(options = getEvents()) {
        return await this.handler("getMyGifSet", {}, options);
    }
    async addToMyGif(object_guid, message_id, options = getEvents()) {
        return await this.handler(
            "addToMyGif",
            {
                message_id,
                object_guid
            },
            options
        );
    }
    async searchGlobalMessages(search_text, start_id, options = getEvents()) {
        return await this.handler(
            "searchGlobalMessages",
            {
                search_text,
                type: "Text",
                start_id
            },
            options
        );
    }
    async searchGlobalObjects(search_text, options = getEvents()) {
        return await this.handler(
            "searchGlobalObjects",
            {
                search_text
            },
            options
        );
    }
    async searchChatMessages(object_guid, search_text, options = getEvents()) {
        return await this.handler(
            "searchChatMessages",
            {
                search_text,
                type: "Text",
                object_guid
            },
            options
        );
    }
    async checkUserUsername(username, options = getEvents()) {
        return await this.handler(
            "checkUserUsername",
            {
                username
            },
            options
        );
    }
    async getAbsObjects(objects_guids, options = getEvents()) {
        return await this.handler(
            "getAbsObjects",
            {
                objects_guids
            },
            options
        );
    }
    async getAvailableReactions(options = getEvents()) {
        return await this.handler("getAvailableReactions", {}, options);
    }
}
export default Client;
