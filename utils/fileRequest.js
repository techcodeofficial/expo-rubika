import axios from "axios";
const fileRequest = async (url, body, headers) => {
    let { data } = await axios.post(url, body, {
        headers
    });
    return data;
};
export default fileRequest;
