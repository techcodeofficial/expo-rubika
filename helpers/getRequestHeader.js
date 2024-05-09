const getRequestHeader = () => {
    let httpHeader = {
        "Content-Type": "text/plain",
        "Accept": "application/json, text/plain, */*",
        "User-Agent":
            "Mozilla/5.0 (Linux; U; Android 12; en; M2004J19C Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/110.0.0.0 Mobile Safari/537.36",
    };
    return httpHeader;
};
export default getRequestHeader;
