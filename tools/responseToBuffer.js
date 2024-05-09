import { Buffer } from "buffer";
const responseToBuffer = response => {
    let buffer = new Uint8Array(Buffer.from(response));
    return buffer;
};
export default responseToBuffer;
