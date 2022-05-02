export { getBaiDuToken, getTencentToken }

async function getBaiDuToken(BAIDU_AK:string, BAIDU_SK:string) {
  const BAIDU_URL = 'https://aip.baidubce.com/oauth/2.0/token?';
  const BAIDU_token_url = `${BAIDU_URL}grant_type=client_credentials&client_id=${BAIDU_AK}&client_secret=${BAIDU_SK}`;
  let res = await fetch(BAIDU_token_url);
  let json = await res.json();
  return json.access_token;
}

async function getTencentToken(WX_appid: string, WX_secret: string) {
  const WX_URL = 'https://api.weixin.qq.com/cgi-bin/token?'
  const WX_token_url = `${WX_URL}grant_type=client_credential&appid=${WX_appid}&secret=${WX_secret}`;
  let res = await fetch(WX_token_url);
  let json = await res.json();
  return json.access_token;
}