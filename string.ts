export { isChinese, subStrLen, superTrim, trimWenJian, ywbdZzwbd }

const ZWBDFH = ['《','》','【','】','（', '）','﹝','﹞','〈','〉','，','：','？','！','；','％','～','．'];

// 判断给定字符是否为汉字
function isChinese (char: string = ''): boolean {
  if(ZWBDFH.indexOf(char) > -1) return false;
  return /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])$/gi.test(char) ? true : false;
}

// 将字符串截断为固定长度，如果长度大于指定长度，结尾加上"..."
function subStrLen(str: string, len: number) {
  return str.length > len ? str.substring(0, len) + '...' : str.substring(0, len)
}

// 清除字符串中的标点符号和前后空格
function superTrim(str: string = ''): string {
  str = str.replace(/[\-\s/,.，。·、°•?？_—〇《》【】（）()‘’“”：:;；%…+!！\"<>①②③④⑤⑥⑦⑧|*]/g, '');    
  return str;
}

// 将字符串中类似《XXX的XXXX》文件简写
function trimWenJian(str: string = ''): string {
  let patten = /《(.*)》/g;
  patten.test(str);
  let jc = RegExp.$1;
  if(jc) {
    jc = jc.replace('中国共产党', '');
    jc = jc.replace('中华人民共和国', '');
    if(jc.length > 8) {
      jc = jc.substring(0,3) + '……' + jc.substring(jc.length-3);
    }
    str = str.replace(patten, '《' + jc + '》');
  }
  return str
}

// 英文标点转中文标点符合
function ywbdZzwbd(str: string = ''): string {
  str = str.replace(/,/g, '，');
  str = str.replace(/:/g, '：');
  str = str.replace(/-/g, '—');
  str = str.replace(/>/g, '＞');
  str = str.replace(/\?/g, '？');
  str = str.replace(/\(/g, '（');
  str = str.replace(/\)/g, '）');
  return str
}