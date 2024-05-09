const getApi = (type= "api") => {
    if (type.toLowerCase() == "api") {
        return `https://messengerg2c${
            Math.floor(Math.random() * 269) + 1
        }.iranlms.ir/`;
    } else if(type.includes("sock")){
        let socketApiList = [
            "wss://msocket1.iranlms.ir:80",
            "wss://jsocket1.iranlms.ir:80",
            "wss://jsocket2.iranlms.ir:80",
            "wss://jsocket3.iranlms.ir:80",
            "wss://jsocket4.iranlms.ir:80",
            "wss://jsocket5.iranlms.ir:80",
            "wss://nsocket6.iranlms.ir:80",
            "wss://nsocket7.iranlms.ir:80",
            "wss://nsocket8.iranlms.ir:80",
            "wss://nsocket9.iranlms.ir:80",
            "wss://nsocket10.iranlms.ir:80",
            "wss://nsocket11.iranlms.ir:80",
            "wss://nsocket12.iranlms.ir:80",
            "wss://nsocket13.iranlms.ir:80"
        ];
        let socketApi =
            socketApiList[Math.floor(Math.random() * socketApiList.length)];
        return socketApi;
    }else{
      return `https://rubino${
            Math.floor(Math.random() * 14) + 1
        }.iranlms.ir/`;
    }
};
export default getApi;