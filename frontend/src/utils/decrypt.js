import CryptoJS from 'crypto-js';

const SECRET_KEY = 'globetrotter-secret-2025-16bytes';

const decryptPayload = (response) => {
  try {
    const { iv, encryptedData } = response.data;
    const decrypted = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: CryptoJS.enc.Base64.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error('Decryption failed:', err);
    return null;
  }
};

export default decryptPayload;