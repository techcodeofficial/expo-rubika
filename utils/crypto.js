import forge from "node-forge";
import { Buffer } from "buffer";
import CryptoJS from "crypto-js";
function replaceCharAt(e, t, i) {
    return e.substring(0, t) + i + e.substring(t + i.length);
}
function secret(e) {
    const t = e.substring(0, 8);
    const i = e.substring(8, 16);
    let n = e.substring(16, 24) + t + e.substring(24, 32) + i;
    let s = 0;
    while (s < n.length) {
        let char = n[s];
        if (char >= "0" && char <= "9") {
            const t = String.fromCharCode(
                ((char.charCodeAt(0) - "0".charCodeAt(0) + 5) % 10) +
                    "0".charCodeAt(0)
            );
            n = replaceCharAt(n, s, t);
        } else {
            const t = String.fromCharCode(
                ((char.charCodeAt(0) - "a".charCodeAt(0) + 9) % 26) +
                    "a".charCodeAt(0)
            );
            n = replaceCharAt(n, s, t);
        }
        s += 1;
    }
    return n;
}
class RubikaCrypto {
    constructor(auth, private_key = null) {
        this.auth = auth;
        this.key = Buffer.from(secret(auth), "utf-8").toString();
        this.iv = "00000000000000000000000000000000";
        if (private_key) {
            this.keypair = private_key.replace(/\\n/g, "\n");
        }
    }
    static changeAuthType(auth_enc) {
        let n = "";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = lowercase.toUpperCase();
        const digits = "0123456789";
        for (let s of auth_enc) {
            if (lowercase.includes(s)) {
                n += String.fromCharCode(
                    ((32 - (s.charCodeAt(0) - 97)) % 26) + 97
                );
            } else if (uppercase.includes(s)) {
                n += String.fromCharCode(
                    ((29 - (s.charCodeAt(0) - 65)) % 26) + 65
                );
            } else if (digits.includes(s)) {
                n += String.fromCharCode(
                    ((13 - (s.charCodeAt(0) - 48)) % 10) + 48
                );
            } else {
                n += s;
            }
        }
        return n;
    }
    encrypt(text) {
        const keyHex = CryptoJS.enc.Utf8.parse(this.key);
        const ivHex = CryptoJS.enc.Hex.parse(this.iv);
        const encrypted = CryptoJS.AES.encrypt(text, keyHex, {
            iv: ivHex
        });
        return encrypted.toString();
    }
    decrypt(encryptedText) {
        const keyHex = CryptoJS.enc.Utf8.parse(this.key);
        const ivHex = CryptoJS.enc.Hex.parse(this.iv);
        const decrypted = CryptoJS.AES.decrypt(encryptedText, keyHex, {
            iv: ivHex
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    static rsaOaepDecrypt(privateKey, encryptedData) {
        const key = forge.pki.privateKeyFromPem(privateKey);
        const encryptedBytes = forge.util.decode64(encryptedData);
        const decryptedData = key.decrypt(encryptedBytes, "RSA-OAEP");
        return decryptedData;
    }
    static generateRsaKey() {
        let keypair = forge.pki.rsa.generateKeyPair({ bits: 1024 });
        return {
            privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
            publicKey: this.changeAuthType(
                Buffer.from(
                    forge.pki.publicKeyToPem(keypair.publicKey)
                ).toString("base64")
            )
        };
    }
    signData(data) {
        const privateKey = forge.pki.privateKeyFromPem(this.keypair);
        const md = forge.md.sha256.create();
        md.update(data, "utf8");
        const signature = privateKey.sign(md);
        return forge.util.encode64(signature);
    }
}
export default RubikaCrypto;
