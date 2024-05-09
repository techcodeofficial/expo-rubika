const createTmp = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    let tmp = "";
    for (let i = 0; i < 32; i++) {
        tmp += chars[Math.floor(Math.random() * chars.length)];
    }
    return tmp;
};
export default createTmp;
