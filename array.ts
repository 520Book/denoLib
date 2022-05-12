export { addYqNum, u8arrToBase64 }

// 给数组元素添加①②之类的序号
function addYqNum(arr: string[]) {
  const XH = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
  for(let i=0; i<arr.length; i++) {
    arr[i] = XH[i] + arr[i];
  }
  return arr;
}

function u8arrToBase64(u8Arr: any) {
  let CHUNK_SIZE = 0x8000;
  let index = 0;
  let length = u8Arr.length;
  let result = '';
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}