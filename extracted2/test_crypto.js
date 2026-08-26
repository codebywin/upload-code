
const crypto = require('crypto');

const AES_KEY_STR = '1c6666689ebf1256'; // 16 bytes

function decryptApiKey(encryptedBase64) {
  try {
    const key = Buffer.from(AES_KEY_STR, 'utf8');
    const iv = Buffer.from(AES_KEY_STR, 'utf8'); // FBEncryptorAES default IV is key or zeros
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(Buffer.from(encryptedBase64, 'base64'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  } catch (e) {
    try {
      // Try zero IV
      const key = Buffer.from(AES_KEY_STR, 'utf8');
      const iv = Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      let decrypted = decipher.update(Buffer.from(encryptedBase64, 'base64'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString('utf8'));
    } catch (e2) {
      return null;
    }
  }
}

// Test encryption and decryption
const sampleObj = { userPhoneName: 'iPhone', userUDID: '00008030-001234567890', code: '123456', TimeStamp: '1787704000' };
const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(AES_KEY_STR), Buffer.from(AES_KEY_STR));
let enc = cipher.update(JSON.stringify(sampleObj), 'utf8', 'base64');
enc += cipher.final('base64');
console.log('Encrypted sample:', enc);

const decrypted = decryptApiKey(enc);
console.log('Decrypted UDID:', decrypted ? decrypted.userUDID : 'FAILED');

// Compute MD5
const rawSign = AES_KEY_STR + '0.2.1' + 'cn.yttxcs.w2pro' + '1' + decrypted.userUDID + sampleObj.TimeStamp + 'Success';
const vipSign = crypto.createHash('md5').update(rawSign).digest('hex').toUpperCase();
console.log('Calculated vipSign:', vipSign);
