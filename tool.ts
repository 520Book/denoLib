export { sleep }
 
// 睡眠，单位毫秒
function sleep(delay = 1000) {
  if(delay < 200) delay = delay *100;
  return new Promise(resolve => setTimeout(resolve, delay))
}