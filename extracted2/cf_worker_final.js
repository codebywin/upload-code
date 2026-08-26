
import { createDecipheriv, createHash } from 'node:crypto';

const AES_KEY = Buffer.from('1c6666689ebf1256', 'utf8');

function decryptApiKey(b64) {
  try {
    const decipher = createDecipheriv('aes-128-cbc', AES_KEY, AES_KEY);
    let dec = decipher.update(Buffer.from(b64, 'base64'));
    dec = Buffer.concat([dec, decipher.final()]);
    return JSON.parse(dec.toString('utf8'));
  } catch (e) {
    try {
      const decipher2 = createDecipheriv('aes-128-cbc', AES_KEY, Buffer.alloc(16, 0));
      let dec2 = decipher2.update(Buffer.from(b64, 'base64'));
      dec2 = Buffer.concat([dec2, decipher2.final()]);
      return JSON.parse(dec2.toString('utf8'));
    } catch (e2) {
      return null;
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    let timestamp = Math.floor(Date.now() / 1000).toString();
    let udid = 'ACTIVATED_DEVICE';
    let code = '123456';

    if (request.method === 'POST') {
      try {
        const bodyText = await request.text();
        const params = new URLSearchParams(bodyText);
        
        if (params.has('TimeStamp')) timestamp = params.get('TimeStamp');
        if (params.has('UDID')) udid = params.get('UDID');
        
        if (params.has('apiKey')) {
          const clientData = decryptApiKey(params.get('apiKey'));
          if (clientData) {
            if (clientData.userUDID) udid = clientData.userUDID;
            if (clientData.TimeStamp) timestamp = clientData.TimeStamp;
            if (clientData.code) code = clientData.code;
          }
        }
      } catch (err) {}
    }

    // Generate exact vipSign MD5 hash
    const rawSignature = '1c6666689ebf1256' + '0.2.1' + 'cn.yttxcs.w2pro' + '1' + udid + timestamp + 'Success';
    const vipSign = createHash('md5').update(rawSignature).digest('hex').toUpperCase();

    const responseData = {
      'code': 200,
      'status': 'success',
      'Checking': 'Success',
      'CheckOJBK': 'Succojbk',
      'vipSign': vipSign,
      'vipToken': '1',
      'UDID': udid,
      'Name': 'w2 Pro VIP',
      'Package': 'cn.yttxcs.w2pro',
      'Version': '0.2.1',
      'TimeStamp': timestamp,
      'Tips': 'Kích hoạt VIP thành công!',
      'Tips1': 'Tweak w2 Pro đã sẵn sàng sử dụng',
      'LLY': '1',
      'TWEAKTC': '0',
      'HYTC': '0',
      'vip_active': '1',
      'VIPUrl': '',
      'BuyUrl': '',
      'IconURL': ''
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
