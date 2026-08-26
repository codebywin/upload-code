
function md5(str) {
  var crypto = require('crypto');
  return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
}

console.log(md5('1c6666689ebf1256'));
