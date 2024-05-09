const getMethods = classInstance => {
    const methods = [];
    for (let key of Object.getOwnPropertyNames(
        Object.getPrototypeOf(classInstance)
    )) {
        if (typeof classInstance[key] === "function") {
            if (!(key == "constructor" || key == "handler")) {
                methods.push(key)
            }
        }
    }
    return methods;
};
export default getMethods;
