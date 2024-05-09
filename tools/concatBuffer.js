import { Buffer } from "buffer";
const concatBuffer = arrayFromBufferArray => {
    return Buffer.concat(arrayFromBufferArray);
};
export default concatBuffer;
