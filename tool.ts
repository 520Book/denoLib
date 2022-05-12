export { sleep, rndNum }
 
// 睡眠，单位毫秒
function sleep(delay = 1000) {
  if(delay < 200) delay = delay *100;
  return new Promise(resolve => setTimeout(resolve, delay))
}

// 生成随机数
function rndNum(min:number, max?:number): number {
  if(!max) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}