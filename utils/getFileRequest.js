import axios from "axios";
const getFileRequest = async (url, headers) => {
    let res = await axios({
      method:"GET",
      responseType: 'arraybuffer',
      headers,
      url
    });
    return res.data;
};
export default getFileRequest;
