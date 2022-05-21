import { Pool, PoolClient } from '../deps.ts';

let pool: Pool;

function poolConnect(config: any) {
  pool = new Pool(config, 3);
}

async function query(str: string, vals?: unknown[]) {
  try {
    const client: PoolClient = await pool.connect();
    let dbResult;
    if (vals && vals.length) {
      console.log(str, vals)
      dbResult = await client.queryObject({ text: str, args: vals });
    } else {
      dbResult = await client.queryObject(str);
    }
    client.release();
    return dbResult?.rowCount ? dbResult.rows : dbResult;
  } catch (e) {
    throw e;
  }
}

export { query, poolConnect };