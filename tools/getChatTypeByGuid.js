const getChatTypeByGuid = objectGuid => {
    let types = [
        ["u0", "User"],
        ["g0", "Group"],
        ["c0", "Channel"],
        ["s0", "Service"],
        ["b0", "Bot"]
    ];
    for (let type of types) {
        if (objectGuid.startsWith(type[0])) {
            return type[1];
        }
        return "";
    }
};
export default getChatTypeByGuid;
