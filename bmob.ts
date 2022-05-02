const BMOB_API_URL = 'https://api2.bmob.cn/1/classes/';
  
export class Bmob {
  protected headers: any = { }

  constructor(APP_ID: string, REST_APP_KEY: string) {
    this.headers = {
      'X-Bmob-Application-Id': APP_ID,
      'X-Bmob-REST-API-Key': REST_APP_KEY,
      'Content-Type': 'application/json',
    }
  }

  async findAll(table: string) {
    let res: any = await fetch(BMOB_API_URL + table + '?count=1&limit=0', { headers: this.headers });
    let json = await res.json();
    let count = json.count;
    let results: any[] = [];
    const LIMIT = 500;
    for(let page = 0; page < Math.ceil(count/LIMIT); page++ ) {
      let skip = page * LIMIT; 
      res = await this.find(`${table}?skip=${skip}&limit=${LIMIT}`);
      results = results.concat(res);
    }
    return results;
  }

  async find(table: string) {
    let res = await fetch(BMOB_API_URL + table, { headers: this.headers });
    let json = await res.json();
    return json.results;
  }

  async update(table: string, objectId: string, data: any) {
    let res = await fetch(BMOB_API_URL + table + '/' + objectId, {
      method: 'PUT',
      headers: this.headers,      
      body: JSON.stringify(data),
    });
    let json = await res.json();
    return json.code == 200 ? json.results : json;
  }

  async insert(table: string, data: any) {
    let res = await fetch(BMOB_API_URL + table, {
      method: 'POST',
      headers: this.headers,   
      body: JSON.stringify(data),
    });
    let json = await res.json();
    return json.code == 200 ? json.results : json;
  }
}