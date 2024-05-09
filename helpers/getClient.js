const getClient = platform => {
    if (platform.startsWith("web")) {
        return {
            "app_name": "Main",
            "app_version": "4.4.9",
            "platform": "Web",
            "package": "web.rubika.ir",
            "lang_code": "fa"
        };
    } else if (platform.startsWith("and")) {
        return {
            "app_name": "Main",
            "app_version": "3.6.4",
            "lang_code": "fa",
            "package": "app.rbmain.a",
            "temp_code": "26",
            "platform": "Android"
        };
    } else {
        return {
            "app_name": "Main",
            "app_version": "2.1.4",
            "package": "m.rubika.ir",
            "platform": "PWA"
        };
    }
};
export default getClient;
