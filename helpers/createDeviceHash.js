const createDeviceHash = () => {
    let digits = "0123456789";
    let hash = "";
    for (let i = 0; i < 26; i++) {
        hash += digits[Math.floor(Math.random() * digits.length)];
    }
    return hash;
};
export default createDeviceHash;
