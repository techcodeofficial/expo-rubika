const getStateTime = () => {
    let date = String(new Date().getTime()).split("");
    let state = parseInt(date.slice(0, 10).join("")) - 200;
    return state;
};
export default getStateTime;
