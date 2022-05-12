import { u8arrToBase64 } from './array.ts';

export { getImageBase64 }

function getImageBase64(path: string) {
  return u8arrToBase64(Deno.readFileSync(path));
}
