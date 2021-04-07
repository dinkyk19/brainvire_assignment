const CryptoJS = require("crypto-js");
const key = "ry81=321r3idjdbnts2";



module.exports = {
    encrypt(password) {
        var ciphertext = CryptoJS.AES.encrypt(password, key).toString();
        return ciphertext;
    },

    decrypt(password) {
        var bytes = CryptoJS.AES.decrypt(password, key);
        var decryptText = bytes.toString(CryptoJS.enc.Utf8);
        return decryptText;
    }
}