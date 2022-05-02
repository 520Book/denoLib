export { addYqNum }

// 给数组元素添加①②之类的序号
function addYqNum(arr: string[]) {
  const XH = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
  for(let i=0; i<arr.length; i++) {
    arr[i] = XH[i] + arr[i];
  }
  return arr;
}