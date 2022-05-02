export { sha1 }

function encodeUTF8(str: string) {
  let result = [];
  let char;
  let x;

  for (let i = 0; i < str.length; i++) {
    if ((char = str.charCodeAt(i)) < 0x80) {
      result.push(char);
    } else if (char < 0x800) {
      result.push(0xC0 + (char >> 6 & 0x1F), 0x80 + (char & 0x3F));
    } else {
      if ((x = char ^ 0xD800) >> 10 == 0) {  //对四字节UTF-16转换为Unicode        
        char = (x << 10) + (str.charCodeAt(++i) ^ 0xDC00) + 0x10000,
          result.push(0xF0 + (char >> 18 & 0x7), 0x80 + (char >> 12 & 0x3F));
      } else {
        result.push(0xE0 + (char >> 12 & 0xF));
      }
      result.push(0x80 + (char >> 6 & 0x3F), 0x80 + (char & 0x3F));
    };
  }
  return result;
}

// 字符串加密成 hex 字符串
function sha1(str: string) {
  let data = new Uint8Array(encodeUTF8(str));
  let i, j, t;
  let l = ((data.length + 8) >>> 6 << 4) + 16;

  let u8Arr = new Uint8Array(l << 2);
  u8Arr.set(new Uint8Array(data.buffer));

  let u32Arr = new Uint32Array(u8Arr.buffer);

  for (t = new DataView(u32Arr.buffer), i = 0; i < l; i++) {
    u32Arr[i] = t.getUint32(i << 2);
  }

  u32Arr[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
  u32Arr[l - 1] = data.length << 3;

  let w: any = [];

  let rol = function (n:any, c: any) { 
    return n << c | n >>> (32 - c); 
  };
  let k = [1518500249, 1859775393, -1894007588, -899497514];

  let m = [1732584193, -271733879, 0, 0, -1009589776];
  m[2] = ~m[0];
  m[3] = ~m[1];

  let f: any = [
    function () { return m[1] & m[2] | ~m[1] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; },
    function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
    function () { return m[1] ^ m[2] ^ m[3]; }
  ]

  for (i = 0; i < u32Arr.length; i += 16) {
    var o = m.slice(0);
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? u32Arr[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
        t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
        m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
    for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
  };
  t = new DataView(new Uint32Array(m).buffer);

  for (let i = 0; i < 5; i++) {
    m[i] = t.getUint32(i << 2);
  }

  var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
    return (e < 16 ? '0' : '') + e.toString(16);
  }).join('');

  return hex;
}