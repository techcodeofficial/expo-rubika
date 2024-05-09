import { Crypto, request } from "../utils";
import { createTmp, getClient, formatPhoneNumber } from "../helpers";
import { getEvents } from "../tools";
import Client from "./Client";
class Login {
    constructor(platform = "web", registering = false, appName = "TechCode") {
        this.platform = platform.toLowerCase().startsWith("we")
            ? "web"
            : "android";
        this.tmp = createTmp();
        this.crypto = new Crypto(this.tmp);
        this.registering = registering;
        this.appName = appName;
    }
    async handler(method, data, options) {
        let isCanceled = false;
        function cancelRequest() {
            isCanceled = true;
        }
        let forEncData = {
            client: getClient(this.platform),
            method: method,
            input: data
        };
        let enc_data = this.crypto.encrypt(JSON.stringify(forEncData));
        let encData = {
            api_version: "6",
            tmp_session: this.tmp,
            data_enc: enc_data
        };
        let result;
        if (options.onStartRequest) {
            options.onStartRequest({
                requestTime: getNowTime(),
                methodType: method,
                methodData: data,
                cancelRequest
            });
        }
        while (true) {
            if (isCanceled) {
                if (options.onCancelRequest) {
                    options.onCancelRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data
                    });
                }
                return { status: "CANCEL REQUEST" };
                break;
            }
            try {
                result = await request(encData);
                if (options.onSendRequest) {
                    options.onSendRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data
                    });
                }
                break;
            } catch (e) {
                if (options.onErrorRequest) {
                    options.onErrorRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data,
                        cancelRequest
                    });
                }
                continue;
            }
        }
        let response = result.data;
        return JSON.parse(this.crypto.decrypt(response["data_enc"]));
    }
    async sendCode(phone, pass_key, options = getEvents()) {
        phone = formatPhoneNumber(phone);
        return await this.handler(
            "sendCode",
            {
                phone_number: phone,
                send_type: "SMS",
                pass_key: pass_key
            },
            options
        );
    }
    async signIn(phone, code, phone_code_hash, options = getEvents()) {
        phone = formatPhoneNumber(phone);
        let RSAKey = Crypto.generateRsaKey();
        let result = await this.handler(
            "signIn",
            {
                phone_number: phone,
                phone_code_hash: phone_code_hash,
                phone_code: code,
                public_key: RSAKey.publicKey
            },
            options
        );
        if (result.data) {
            if (result.data.auth) {
                let privateKey = RSAKey.privateKey;
                let decodeAuth = Crypto.rsaOaepDecrypt(
                    privateKey,
                    result.data.auth
                );
                if (this.registering) {
                    let client = new Client(
                        decodeAuth,
                        privateKey,
                        this.platform
                    );
                    let registerResult = await client.registerDevice(
                        this.appName
                    );
                    return {
                        result,
                        registerResult,
                        privateKey,
                        decodeAuth
                    };
                }
                return {
                    result,
                    privateKey,
                    decodeAuth
                };
            } else {
                return { result };
            }
        } else {
            return { result };
        }
    }
}
export default Login;
